// pages/cert/login.tsx
import { useState } from 'react'
import { useRouter } from 'next/router'
import Header from '@/components/cert-header';
import Link from 'next/link';

export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!email.trim() || !password) {
      return setError('아이디와 비밀번호를 모두 입력해 주세요.')
    }

    // 로그인 API 호출 생략 → 바로 홈으로 이동
    router.push('/')
  }

  return (
    <main>
      <Header />
      <div className="min-h-screen bg-gray-50 flex flex-col items-center pt-16">
        {/* 제목 */}
        <h1 className="text-3xl font-bold mb-6 text-black">로그인</h1>

        {/* 로그인 폼 */}
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
              onChange={e => setEmail(e.target.value)}
              placeholder="학교 이메일을 입력해 주세요."
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

          {/* 오류 메시지 */}
          {error && <p className="text-red-600">{error}</p>}

          {/* 아이디/비밀번호 찾기 링크 */}
          <div className="flex justify-center space-x-2 text-sm text-gray-500">
            <a href="#" className="hover:underline">아이디 찾기</a>
            <span>|</span>
            <a href="#" className="hover:underline">비밀번호 찾기</a>
          </div>

          {/* 로그인 버튼 */}
          <Link href="/home">
          <button
            type="submit"
            className="w-full py-3 bg-black text-white rounded-lg disabled:opacity-50"
            disabled={!email.trim() || !password}
          >
            로그인
          </button>
          </Link>
        </form>
      </div>
    </main>
  )
}
