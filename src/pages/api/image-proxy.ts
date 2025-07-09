// pages/api/image-proxy.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { url } = req.query
  if (typeof url !== 'string') {
    return res.status(400).end('url 쿼리 필요')
  }

  let decoded: string
  try {
    decoded = decodeURIComponent(url)
  } catch {
    console.error('[프록시] url 디코딩 실패:', url)
    return res.status(400).end('url 디코딩 실패')
  }

  const encodedUrl = encodeURI(decoded)
  const allowedDomains = ['gz-zigu.store', 'www.gz-zigu.store']
  try {
    const hostname = new URL(encodedUrl).hostname
    if (!allowedDomains.includes(hostname)) {
      return res.status(403).end('허용되지 않은 도메인')
    }
  } catch {
    return res.status(400).end('잘못된 url')
  }

  console.log('[프록시] 요청 URL:', encodedUrl);
  console.log('[프록시] 전체 요청 헤더:', req.headers);
  console.log('[프록시] 쿠키:', req.headers.cookie || '없음');
  
  // 쿠키에서 JSESSIONID 추출
  const cookies = req.headers.cookie || '';
  const jsessionId = cookies.match(/JSESSIONID=([^;]+)/)?.[1];
  console.log('[프록시] JSESSIONID:', jsessionId || '없음');
  
  try {
    const backendRes = await axios.get(encodedUrl, {
      responseType: 'stream',
      timeout: 15000,
      headers: {
        Cookie: req.headers.cookie ?? '',
        'User-Agent': 'Mozilla/5.0 (compatible; ImageProxy/1.0)',
        Accept: 'image/*,*/*;q=0.8',
        Referer: 'https://gz-zigu.store/',
        // 추가 헤더들
        'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
      },
      validateStatus: status => status < 500,
    })

    if (backendRes.status >= 400) {
      console.error(`[프록시] ${backendRes.status} 에러:`, encodedUrl);
      console.error(`[프록시] 응답 헤더:`, backendRes.headers);
      
      // 에러 응답 본문 확인 (JSON일 가능성 높음)
      try {
        // axios stream을 텍스트로 변환
        const chunks: Buffer[] = [];
        backendRes.data.on('data', (chunk: Buffer) => chunks.push(chunk));
        await new Promise((resolve) => backendRes.data.on('end', resolve));
        
        const errorBodyText = Buffer.concat(chunks).toString('utf-8');
        console.error(`[프록시] 에러 응답 본문 (텍스트):`, errorBodyText);
        
        // JSON 파싱 시도
        try {
          const errorJson = JSON.parse(errorBodyText);
          console.error(`[프록시] 에러 응답 본문 (JSON):`, errorJson);
        } catch (jsonErr) {
          console.error(`[프록시] JSON 파싱 실패, 원본 텍스트:`, errorBodyText);
        }
      } catch (e) {
        console.error(`[프록시] 에러 응답 본문 읽기 실패:`, e);
      }
      
      // 403 에러의 경우 특별한 처리
      if (backendRes.status === 403) {
        console.error('[프록시] 403 Forbidden - 인증 필요한 이미지일 수 있음');
        return res.status(403).json({
          error: '이미지에 접근할 권한이 없습니다. 로그인이 필요할 수 있습니다.',
          url: encodedUrl,
          suggestion: '로그인 후 다시 시도해주세요.'
        });
      }
      
      // 404 에러의 경우 특별한 처리
      if (backendRes.status === 404) {
        console.error('[프록시] 404 Not Found - 이미지 파일이 존재하지 않음');
        return res.status(404).json({
          error: '이미지를 찾을 수 없습니다. 파일이 존재하지 않거나 경로가 잘못되었을 수 있습니다.',
          url: encodedUrl,
          suggestion: '이미지 업로드를 다시 시도하거나 백엔드 개발자에게 문의하세요.'
        });
      }
      
      return res.status(backendRes.status).json({
        error: backendRes.status === 404
          ? '이미지를 찾을 수 없습니다'
          : `이미지 요청 실패: ${backendRes.status}`,
        url: encodedUrl,
      })
    }

    res.setHeader('Content-Type', backendRes.headers['content-type'] || 'image/jpeg')
    if (backendRes.headers['content-disposition']) {
      res.setHeader('Content-Disposition', backendRes.headers['content-disposition'])
    }
    if (backendRes.headers['content-length']) {
      res.setHeader('Content-Length', backendRes.headers['content-length'])
    }
    res.setHeader('Cache-Control', 'public, max-age=3600')
    backendRes.data.pipe(res)
  } catch (err: any) {
    console.error('[프록시] 네트워크/기타 오류:', err)
    res.status(err.response?.status || 500).end('이미지 요청 실패')
  }
}
