// pages/api/univcert/status.ts
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()
  const { email } = req.body
  try {
    const r = await fetch('https://univcert.com/api/v1/status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        key: process.env.NEXT_PUBLIC_UNIVCERT_API_KEY,
        email
      })
    })
    const json = await r.json()
    if (!json.success) return res.status(400).json(json)
    return res.status(200).json({ success: true, certified_date: json.certified_date })
  } catch (e) {
    console.error(e)
    return res.status(500).json({ success: false, message: '서버 오류' })
  }
}
