// pages/cert/register.tsx
import { GetServerSideProps } from 'next'
import { useState } from 'react'
import { useRouter } from 'next/router'
import Header from '@/components/cert-header';
import Link from 'next/link';

// 쿠키 파싱 헬퍼
function parseCookies(cookieHeader?: string): Record<string, string> {
  const list: Record<string, string> = {}
  if (!cookieHeader) return list
  cookieHeader.split(';').forEach(pair => {
    const [rawKey, rawVal] = pair.split('=')
    if (rawKey && rawVal) {
      list[rawKey.trim()] = decodeURIComponent(rawVal.trim())
    }
  })
  return list
}

type Props = {
  email: string
}

export default function Register({ email }: Props) {
  const router = useRouter()
  const [nickname, setNickname] = useState('')
  const [password, setPassword] = useState('')
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [agreePrivacy, setAgreePrivacy] = useState(false)
  const [msg, setMsg] = useState<{ text: string; type: 'error' | 'success' } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMsg(null)
    if (!nickname.trim()) return setMsg({ text: '닉네임을 입력해 주세요.', type: 'error' })
    if (password.length < 8) return setMsg({ text: '비밀번호는 8자 이상이어야 합니다.', type: 'error' })
    if (!agreeTerms || !agreePrivacy)
      return setMsg({ text: '필수 약관에 모두 동의해 주세요.', type: 'error' })

    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, nickname, password })
    })
    if (res.ok) {
      router.push('/register/success')
    } else {
      const json = await res.json()
      setMsg({ text: json.message || '회원가입에 실패했습니다.', type: 'error' })
    }
  }

  return (
    <main>
      <Header/>
      <div className="min-h-screen bg-gray-50 flex flex-col items-center pt-16">
        {/* 제목 */}
        <h1 className="text-3xl font-bold mb-6 text-black">회원가입</h1>

        {/* Step Indicator */}
        <div className="flex justify-center space-x-4 mb-8">
          <div className="flex items-center bg-gray-200 rounded-lg px-4 py-2 space-x-2">
            <span className="w-6 h-6 bg-gray-300 text-gray-500 rounded-lg flex items-center justify-center">1</span>
            <span className="font-medium text-gray-500">학교 이메일 인증</span>
          </div>
          <div className="flex items-center bg-gray-200 rounded-lg px-4 py-2 space-x-2">
            <span className="w-6 h-6 bg-black text-white rounded-lg flex items-center justify-center">2</span>
            <span className="font-medium text-gray-700">회원 정보 입력</span>
          </div>
          <div className="flex items-center bg-gray-200 rounded-lg px-4 py-2 space-x-2">
            <span className="w-6 h-6 bg-gray-300 text-gray-500 rounded-lg flex items-center justify-center">3</span>
            <span className="font-medium text-gray-500">가입 완료</span>
          </div>
        </div>

        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-[#F5F5F5] p-8 rounded-2xl space-y-6"
        >
          {/* 아이디 */}
          <div>
            <label className="block mb-1 text-gray-700">아이디</label>
            <input
              type="email"
              value={email}
              readOnly
              placeholder="학교 이메일 자동 입력"
              className="w-full p-3 border border-gray-300 rounded-lg bg-white text-black placeholder-[#B3B3B3]"
            />
          </div>

          {/* 닉네임 */}
          <div>
            <label className="block mb-1 text-gray-700">닉네임</label>
            <input
              type="text"
              value={nickname}
              onChange={e => setNickname(e.target.value)}
              placeholder="최대 몇 자"
              className="w-full p-3 border border-gray-300 rounded-lg bg-white text-black placeholder-[#B3B3B3]"
            />
          </div>

          {/* 비밀번호 */}
          <div>
            <label className="block mb-1 text-gray-700">비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="비밀번호를 입력해 주세요."
              className="w-full p-3 border border-gray-300 rounded-lg bg-white text-black placeholder-[#B3B3B3]"
            />
            <p className="mt-1 text-sm text-gray-500">
              대/소문자, 특수기호 !&amp;$*5 ~~~
            </p>
          </div>

          {/* 약관 동의 */}
          <div className="space-y-3">
            <div className="flex items-center">
              <input
                id="terms"
                type="checkbox"
                className="mr-2"
                checked={agreeTerms}
                onChange={e => setAgreeTerms(e.target.checked)}
              />
              <label htmlFor="terms" className="text-gray-700">
                [필수] 이용약관에 동의합니다.
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="privacy"
                type="checkbox"
                className="mr-2"
                checked={agreePrivacy}
                onChange={e => setAgreePrivacy(e.target.checked)}
              />
              <label htmlFor="privacy" className="text-gray-700">
                [필수] 개인정보 수집∙이용에 동의합니다.
              </label>
            </div>
          </div>

          {/* 메시지 */}
          {msg && (
            <p className={msg.type === 'error' ? 'text-red-600' : 'text-green-600'}>
              {msg.text}
            </p>
          )}

          {/* 다음 버튼 */}
          <Link href="/cert/success">
          <button
            type="submit"
            className="w-full py-3 bg-gray-300 text-gray-600 rounded-lg disabled:opacity-50"
            disabled={!nickname || password.length < 8 || !agreeTerms || !agreePrivacy}
          >
            다음
          </button>
          </Link>
        </form>
      </div>
    </main>
  )
}

// SSR: httpOnly 쿠키에서 email 꺼내서 props로 넘기기
export const getServerSideProps: GetServerSideProps<Props> = async ({ req }) => {
  const cookies = parseCookies(req.headers.cookie)
  const email = cookies.email || ''

  if (!email) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  return {
    props: { email }
  }
}
