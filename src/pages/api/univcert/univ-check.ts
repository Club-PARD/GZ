// pages/api/univcert/univ-check.ts
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ success: boolean; message?: string }>
) {
  if (req.method !== 'POST') return res.status(405).end()

  const { univName } = req.body
  try {
    const r = await fetch('https://univcert.com/api/v1/check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ univName })
    })
    const json = await r.json()
    if (json.success) {
      return res.status(200).json({ success: true })
    } else {
      return res.status(400).json({ success: false, message: json.message })
    }
  } catch (e) {
    console.error(e)
    return res.status(500).json({ success: false, message: '서버 오류 발생' })
  }
}
