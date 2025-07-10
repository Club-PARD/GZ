// src/pages/api/auth/signUp.ts
import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email, university, nickname, password } = req.body;
    
    const backendResponse = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/signUp`, req.body, {
      headers: { 'Content-Type': 'application/json' },
      validateStatus: () => true,
    });

    res.status(backendResponse.status);
    return res.json(backendResponse.data);
  } catch (err: any) {
    return res.status(500).json({
      message: 'Internal server error',
      error: err.message ?? 'Unknown error',
    });
  }
}
