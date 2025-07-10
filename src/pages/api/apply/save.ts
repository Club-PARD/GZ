// src/pages/api/apply/save.ts
import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // 헤더 설정 (Content-Type, Cookie, Authorization 등)
    const forwardHeaders: Record<string, string> = {};
    if (req.headers['content-type']) {
      forwardHeaders['Content-Type'] = req.headers['content-type'];
    }
    if (req.headers.cookie) {
      forwardHeaders['Cookie'] = req.headers.cookie;
    }
    if (req.headers.authorization) {
      forwardHeaders['Authorization'] = req.headers.authorization;
    }

    // 쿼리스트링 유지
    const queryString = req.url?.includes('?') ? req.url.split('?')[1] : '';
    const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/apply/save${queryString ? `?${queryString}` : ''}`;

    // 백엔드 API 호출
    const backendResponse = await axios.post(backendUrl, req.body, {
      headers: forwardHeaders,
      validateStatus: () => true,
    });

    // Set-Cookie 헤더 전달
    const setCookieHeader = backendResponse.headers['set-cookie'];
    if (setCookieHeader) {
      res.setHeader('Set-Cookie', setCookieHeader);
    }

    // 상태 코드 및 응답 전달
    res.status(backendResponse.status);
    return res.json(backendResponse.data);
    
  } catch (err: any) {
    console.error('Proxy error:', err);
    return res.status(500).json({
      message: 'Internal server error',
      error: err.message ?? 'Unknown error',
    });
  }
}
