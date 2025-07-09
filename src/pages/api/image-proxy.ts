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
  
  try {
    const backendRes = await axios.get(encodedUrl, {
      responseType: 'stream',
      timeout: 15000,
      headers: {
        Cookie: req.headers.cookie ?? '',
        'User-Agent': 'Mozilla/5.0 (compatible; ImageProxy/1.0)',
        Accept: 'image/*,*/*;q=0.8',
        Referer: 'https://gz-zigu.store/',
      },
      validateStatus: status => status < 500,
    })

    if (backendRes.status >= 400) {
      console.error(`[프록시] ${backendRes.status} 에러:`, encodedUrl);
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
