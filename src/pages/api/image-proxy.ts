// pages/api/image-proxy.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { url } = req.query;
  
  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'URL is required' });
  }

  const apiHost = process.env.NEXT_PUBLIC_API_URL?.replace('https://', '').replace('http://', '');
  if (!url.includes(apiHost || 'gz-zigu.store')) {
    return res.status(403).end('허용되지 않은 도메인')
  }  
  try {
    const backendRes = await axios.get(url, {
      responseType: 'stream',
      timeout: 15000,
      headers: {
        Cookie: req.headers.cookie ?? '',
        'User-Agent': 'Mozilla/5.0 (compatible; ImageProxy/1.0)',
        Accept: 'image/*,*/*;q=0.8',
      },
      validateStatus: status => status < 500,
    })

    if (backendRes.status >= 400) {
      console.error(`[프록시] ${backendRes.status} 에러:`, url);
      return res.status(backendRes.status).json({
        error: '이미지를 찾을 수 없습니다',
        url: url,
      })
    }

    res.setHeader('Content-Type', backendRes.headers['content-type'] || 'image/jpeg')
    res.setHeader('Cache-Control', 'public, max-age=3600')
    backendRes.data.pipe(res)
  } catch (err: any) {
    console.error('[프록시] 에러:', err.message)
    res.status(500).end('이미지 요청 실패')
  }
}
