// src/pages/api/image-proxy.ts
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { url } = req.query;
  if (!url || typeof url !== 'string') {
    return res.status(400).json({ message: 'Image URL is required' });
  }

  // 안전한 URL 검증
  if (!url.startsWith('https://gz-zigu.store/')) {
    return res.status(400).json({ message: 'Invalid image URL' });
  }

  try {
    // 헤더 설정 (인증 정보 포함)
    const forwardHeaders: Record<string, string> = {
      'User-Agent': 'Mozilla/5.0 (compatible; ZiguApp/1.0)',
      'Accept': 'image/*,*/*;q=0.8',
      'Accept-Encoding': 'gzip, deflate, br',
      'Cache-Control': 'max-age=3600',
    };

    if (req.headers.cookie) {
      forwardHeaders['Cookie'] = req.headers.cookie;
    }
    if (req.headers.authorization) {
      forwardHeaders['Authorization'] = req.headers.authorization;
    }

    // 백엔드에서 이미지 가져오기
    const backendResponse = await fetch(url, {
      method: 'GET',
      headers: forwardHeaders,
    });

    if (!backendResponse.ok) {
      return res.status(backendResponse.status).json({ 
        message: `Failed to load image: ${backendResponse.statusText}` 
      });
    }

    // Content-Type 설정
    const contentType = backendResponse.headers.get('content-type');
    if (contentType) {
      res.setHeader('Content-Type', contentType);
    }
    // 캐시 헤더 설정
    res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600');

    // 이미지 데이터 스트리밍
    const imageBuffer = await backendResponse.arrayBuffer();
    res.setHeader('Content-Length', imageBuffer.byteLength);

    return res.send(Buffer.from(imageBuffer));
  } catch (err: any) {
    return res.status(500).json({ 
      message: 'Internal server error',
      error: err.message ?? 'Unknown error',
    });
  }
}
