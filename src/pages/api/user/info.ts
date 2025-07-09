// pages/api/user/info.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export const config = {
  api: {
    responseLimit: false,
    externalResolver: true,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // 쿼리스트링 그대로 전달
    const queryString = req.url?.split('?')[1] || '';
    const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/user/info${queryString ? `?${queryString}` : ''}`;

    // 60초 타임아웃
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);

    // 포워드할 헤더 설정
    const forwardHeaders: Record<string, string> = {
      Accept: req.headers['accept'] ?? 'application/json',
    };
    if (req.headers.cookie) {
      forwardHeaders['Cookie'] = req.headers.cookie;
    }
    if (req.headers.authorization) {
      forwardHeaders['Authorization'] = req.headers.authorization;
    }

    const backendRes = await fetch(backendUrl, {
      method: 'GET',
      headers: forwardHeaders,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    // 상태 코드와 Content-Type 그대로 전달
    res.status(backendRes.status);
    const contentType = backendRes.headers.get('content-type') || '';
    res.setHeader('Content-Type', contentType);

    if (contentType.includes('application/json')) {
      const json = await backendRes.json();
      return res.json(json);
    } else {
      const text = await backendRes.text();
      return res.send(text);
    }
  } catch (err: any) {
    console.error('[/api/user/info] error:', err);
    if (err.name === 'AbortError') {
      return res.status(504).json({ message: 'Upstream timeout' });
    }
    return res.status(500).json({ message: err.message || 'Internal server error' });
  }
}
