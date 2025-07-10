// src/pages/api/auth/login.ts
import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;    
    const backendResponse = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, req.body, {
      headers: { 'Content-Type': 'application/json' },
      validateStatus: () => true, // 모든 상태 코드를 성공으로 처리
    });

    res.status(backendResponse.status);

    // 쿠키 헤더 전달 (개발 환경에 맞춰 속성 수정)
    const setCookie = backendResponse.headers['set-cookie'];
    if (setCookie) {
      const modified = Array.isArray(setCookie) 
        ? setCookie.map((cookie: string) => 
            cookie.replace(/; Secure/g, '').replace(/; SameSite=None/g, '; SameSite=Lax')
          )
        : (setCookie as string).replace(/; Secure/g, '').replace(/; SameSite=None/g, '; SameSite=Lax');
      res.setHeader('Set-Cookie', modified);
    }

    return res.json(backendResponse.data);
  } catch (err: any) {
    return res.status(500).json({
      message: 'Internal server error',
      error: err.message ?? 'Unknown error',
    });
  }
}
