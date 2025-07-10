import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PATCH') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
  try {
    const forwardHeaders: Record<string, string> = {};
    if (req.headers.cookie) forwardHeaders['Cookie'] = req.headers.cookie;
    if (req.headers.authorization) forwardHeaders['Authorization'] = req.headers.authorization;

    const queryString = req.url?.includes('?') ? req.url.split('?')[1] : '';
    const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/borrowed/return${queryString ? `?${queryString}` : ''}`;

    const backendResponse = await axios.patch(backendUrl, null, {
      headers: forwardHeaders,
      validateStatus: () => true,
    });

    const setCookieHeader = backendResponse.headers['set-cookie'];
    if (setCookieHeader) res.setHeader('Set-Cookie', setCookieHeader);

    res.status(backendResponse.status).json(backendResponse.data);
  } catch (error) {
    console.error('Error in /api/borrowed/return:', error);
    res.status(500).json({ status: -1, success: false, message: 'Server error' });
  }
}
