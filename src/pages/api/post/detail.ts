// src/pages/api/post/detail.ts
import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { postId, userId } = req.query;
    if (!postId) {
      return res.status(400).json({ message: 'postId is required' });
    }

    const forwardHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (req.headers.cookie) {
      forwardHeaders['Cookie'] = req.headers.cookie;
    }
    if (req.headers.authorization) {
      forwardHeaders['Authorization'] = req.headers.authorization;
    }

    const params = new URLSearchParams();
    params.append('postId', String(postId));
    if (userId) {
      params.append('userId', String(userId));
    }
    const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/post/detail?${params.toString()}`;

    const backendResponse = await axios.get(backendUrl, {
      headers: forwardHeaders,
      validateStatus: () => true,
    });

    const setCookieHeader = backendResponse.headers['set-cookie'];
    if (setCookieHeader) {
      res.setHeader('Set-Cookie', setCookieHeader);
    }

    res.status(backendResponse.status);
    return res.json(backendResponse.data);
  } catch (err: any) {
    return res.status(500).json({
      message: 'Internal server error',
      error: err.message ?? 'Unknown error',
    });
  }
}
