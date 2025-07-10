import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE') {
    res.setHeader('Allow', 'DELETE');
    return res.status(405).end('Method Not Allowed');
  }

  const { applyId } = req.query as { applyId?: string };
  if (!applyId) {
    return res.status(400).json({ success: false, message: 'applyId 쿼리 파라미터가 필요합니다.' });
  }

  const forwardHeaders: Record<string, string> = { 'Content-Type': 'application/json' };
  if (req.headers.cookie) forwardHeaders['Cookie'] = req.headers.cookie;
  if (req.headers.authorization) forwardHeaders['Authorization'] = req.headers.authorization;

  const params = new URLSearchParams();
  params.append('applyId', applyId);

  const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/apply/ok?${params.toString()}`;
  try {
    const backendResponse = await axios.delete(backendUrl, {
      headers: forwardHeaders,
      validateStatus: () => true,
    });
    res.status(backendResponse.status);
    if (backendResponse.headers['content-type']?.includes('application/json')) {
      return res.json(backendResponse.data);
    }
    return res.send(backendResponse.data);
  } catch (err: any) {
    return res.status(500).json({ message: 'Internal server error', error: err.message });
  }
} 