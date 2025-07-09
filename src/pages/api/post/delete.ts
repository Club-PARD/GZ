// pages/api/post/delete.ts

import type { NextApiRequest, NextApiResponse } from 'next'
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
  const backendResponse = await fetch(backendUrl, {
    method: 'DELETE',
    headers: forwardHeaders,
  })

  const text = await backendResponse.text()
  res.status(backendResponse.status)
  if (backendResponse.headers.get('content-type')?.includes('application/json')) {
    try { return res.json(JSON.parse(text)) }
    catch   { return res.status(500).json({ message: 'Invalid JSON from backend' }) }
  }
  return res.send(text)
}
