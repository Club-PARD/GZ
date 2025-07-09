// src/pages/api/auth/login.ts
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;
    console.log('로그인 요청 받음:', { email, password: '***' });
    
    const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });

    const data = await backendResponse.text();
    res.status(backendResponse.status);

    const contentType = backendResponse.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      res.setHeader('Content-Type', 'application/json');

      // 쿠키 헤더 전달 (개발 환경에 맞춰 속성 수정)
      const setCookie = backendResponse.headers.get('set-cookie');
      if (setCookie) {
        const modified = setCookie
          .replace(/; Secure/g, '')
          .replace(/; SameSite=None/g, '; SameSite=Lax');
        res.setHeader('Set-Cookie', modified);
      }

      return res.json(JSON.parse(data));
    } else {
      return res.send(data);
    }
  } catch (err: any) {
    return res.status(500).json({
      message: 'Internal server error',
      error: err.message ?? 'Unknown error',
    });
  }
}
