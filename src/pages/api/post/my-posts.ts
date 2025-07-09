// src/pages/api/post/my-posts.ts
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    console.log('내 물건 목록 요청 받음');
    console.log('쿠키:', req.headers.cookie);
    
    const forwardHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // 쿠키가 있으면 그대로 전달
    if (req.headers.cookie) {
      forwardHeaders['Cookie'] = req.headers.cookie;
    }

    const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/post/my-posts`, {
      method: 'GET',
      headers: forwardHeaders,
    });

    const data = await backendResponse.text();
    console.log('백엔드 응답 상태:', backendResponse.status);
    console.log('백엔드 응답 데이터:', data.substring(0, 200));
    
    res.status(backendResponse.status);

    const contentType = backendResponse.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      res.setHeader('Content-Type', 'application/json');
      return res.json(JSON.parse(data));
    } else {
      return res.send(data);
    }
  } catch (err: any) {
    console.error('내 물건 목록 요청 실패:', err);
    return res.status(500).json({
      message: 'Internal server error',
      error: err.message ?? 'Unknown error',
    });
  }
} 