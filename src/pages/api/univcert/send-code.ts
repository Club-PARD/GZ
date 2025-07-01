// pages/api/univcert/send-code.ts
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ success: boolean; message?: string }>
) {
  if (req.method !== 'POST') return res.status(405).end()
  const { univName, email } = req.body

  // —— 테스트용: 매번 인증 가능하도록 UnivCert 기록 초기화 ——
  await fetch('https://univcert.com/api/v1/clear', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key: process.env.NEXT_PUBLIC_UNIVCERT_API_KEY })
  })

  try {
    const r = await fetch('https://univcert.com/api/v1/certify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        key: process.env.NEXT_PUBLIC_UNIVCERT_API_KEY,
        univName,
        email,
        univ_check: true
      })
    })
    const json = await r.json()
    if (!json.success) return res.status(400).json(json)
    return res.status(200).json({ success: true })
  } catch (e) {
    console.error(e)
    return res.status(500).json({ success: false, message: '서버 오류' })
  }
}
