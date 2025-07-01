// pages/api/univcert/code-verify.ts
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ success: boolean; message?: string }>
) {
  if (req.method !== 'POST') return res.status(405).end()
  const { univName, email, code } = req.body

  try {
    const r = await fetch('https://univcert.com/api/v1/certifycode', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        key: process.env.NEXT_PUBLIC_UNIVCERT_API_KEY,
        univName,
        email,
        code: Number(code),
      }),
    })
    const json = await r.json()
    if (!json.success) return res.status(400).json(json)

    // 직접 쿠키 문자열 생성
    const cookieValue = encodeURIComponent(email)
    const maxAge = 15 * 60 // 15분
    const secureFlag = process.env.NODE_ENV === 'production' ? '; Secure' : ''
    res.setHeader('Set-Cookie',
      `email=${cookieValue}; HttpOnly; Path=/; Max-Age=${maxAge}; SameSite=Lax${secureFlag}`
    )

    return res.status(200).json({ success: true })
  } catch (e) {
    console.error(e)
    return res.status(500).json({ success: false, message: '서버 오류' })
  }
}
  