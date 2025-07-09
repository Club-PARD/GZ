// src/pages/api/apply/save.ts
import { NextApiRequest, NextApiResponse } from 'next';

// Next.js 기본 body parser 비활성화 (raw body 처리를 위해)
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // raw body 읽기
    const chunks: Buffer[] = [];
    req.on('data', (chunk: Buffer) => {
      chunks.push(chunk);
    });
    await new Promise<void>(resolve => req.on('end', resolve));
    const body = Buffer.concat(chunks);

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
    const backendResponse = await fetch(backendUrl, {
      method: 'POST',
      headers: forwardHeaders,
      body,
    });

    // Set-Cookie 헤더 전달
    const setCookieHeader = backendResponse.headers.get('set-cookie');
    if (setCookieHeader) {
      res.setHeader('Set-Cookie', setCookieHeader);
    }

    // 상태 코드 및 바디 타입에 따라 응답
    res.status(backendResponse.status);
    const data = await backendResponse.text();
    const contentType = backendResponse.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      res.setHeader('Content-Type', 'application/json');
      try {
        return res.json(JSON.parse(data));
      } catch {
        return res.status(500).json({ message: 'Invalid JSON response from backend' });
      }
    } else {
      return res.send(data);
    }
  } catch (err: any) {
    console.error('Proxy error:', err);
    return res.status(500).json({
      message: 'Internal server error',
      error: err.message ?? 'Unknown error',
    });
  }
}
