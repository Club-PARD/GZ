// pages/api/user/quit.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export const config = {
  api: {
    responseLimit: false,
    externalResolver: true,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/user/quit`;
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

    const backendRes = await axios.delete(backendUrl, {
      headers: forwardHeaders,
      timeout: 60000,
      validateStatus: () => true,
    });

    // 상태 코드 · Content-Type 그대로 전달
    res.status(backendRes.status);
    const contentType = backendRes.headers['content-type'] || '';
    res.setHeader('Content-Type', contentType);

    return res.json(backendRes.data);
  } catch (err: any) {
    console.error('[/api/user/quit] error:', err);
    if (err.name === 'AbortError') {
      return res.status(504).json({ message: 'Upstream timeout' });
    }
    return res.status(500).json({ message: err.message || 'Internal server error' });
  }
}
