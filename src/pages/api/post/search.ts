// src/pages/api/post/search.ts
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  try {
    const { keyword } = req.query;
    const forwardHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (req.headers.cookie)    forwardHeaders['Cookie'] = req.headers.cookie;
    if (req.headers.authorization) forwardHeaders['Authorization'] = req.headers.authorization;

    const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/post/search`);
    if (keyword) url.searchParams.append('keyword', String(keyword));

    const backendRes = await fetch(url.toString(), {
      method: 'GET',
      headers: forwardHeaders,
    });
    const text = await backendRes.text();
    res.status(backendRes.status);
    const contentType = backendRes.headers.get('content-type') ?? '';
    if (contentType.includes('application/json')) {
      res.setHeader('Content-Type', 'application/json');
      return res.json(JSON.parse(text));
    }
    return res.send(text);
  } catch (err: any) {
    console.error('Search proxy error:', err);
    return res.status(500).json({ message: 'Internal server error', error: err.message });
  }
}
