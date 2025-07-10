// pages/api/post/delete.ts

import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE') {
    res.setHeader('Allow', 'DELETE')
    return res.status(405).end('Method Not Allowed')
  }

  const { postId, userId } = req.query as { postId?: string, userId?: string }

  if (!postId) {
    return res.status(400).json({ success: false, message: 'postId 쿼리 파라미터가 필요합니다.' })
  }

  const forwardHeaders: Record<string, string> = { 'Content-Type': 'application/json' }
  if (req.headers.cookie) forwardHeaders['Cookie'] = req.headers.cookie
  if (req.headers.authorization) forwardHeaders['Authorization'] = req.headers.authorization

  const params = new URLSearchParams()
  params.append('postId', postId)
  if (userId) params.append('userId', userId)

  const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/post/delete?${params.toString()}`
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
