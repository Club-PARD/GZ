// src/pages/api/post/update.ts
import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PATCH') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { postId, itemName, pricePerHour, pricePerDay, description } = req.body;

    // 필수 필드 검증
    if (!postId) {
      return res.status(400).json({ 
        success: false,
        message: 'postId is required' 
      });
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

    const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/post/update`;

    const backendResponse = await axios.patch(
      backendUrl,
      {
        postId,
        itemName,
        pricePerHour,
        pricePerDay,
        description,
      },
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
  } catch (err: unknown) {
    const error = err as Error;
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message ?? 'Unknown error',
    });
  }
} 