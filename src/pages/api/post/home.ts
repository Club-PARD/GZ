// src/pages/api/post/home.ts
import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const forwardHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (req.headers.cookie) {
      forwardHeaders['Cookie'] = req.headers.cookie;
    }
    if (req.headers.authorization) {
      forwardHeaders['Authorization'] = req.headers.authorization;
    }

    const backendResponse = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/post/home`,
      {
        headers: forwardHeaders,
        validateStatus: () => true,
      }
    );

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
