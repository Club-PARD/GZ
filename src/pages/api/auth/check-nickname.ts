// src/pages/api/auth/check-nickname.ts
import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const backendResponse = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/check-nickname`, req.body, {
      headers: { 'Content-Type': 'application/json' },
      validateStatus: (status: number) => true,
    });

    res.status(backendResponse.status);
    return res.json(backendResponse.data);
  } catch (err: unknown) {
    const error = err as Error;
    return res.status(500).json({
      message: 'Internal server error',
      error: error.message ?? 'Unknown error',
    });
  }
}
