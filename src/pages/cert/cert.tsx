// pages/cert/cert.tsx
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Header from '@/components/cert-header'
import ErrorDialog from '@/components/ErrorDialog'
import { univCheck, sendCode, verifyCode } from '@/lib/firebase-functions'

export default function Home() {
  const router = useRouter()
  const [univ, setUniv] = useState('')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [isSchoolVerified, setSchoolVerified] = useState(false)
  const [isCodeSent, setCodeSent] = useState(false)
  const [msg, setMsg] = useState<{ text: string; type: 'error' | 'success' } | null>(null)
  const [errorDialog, setErrorDialog] = useState({ isOpen: false, message: '' })
  const [resendCount, setResendCount] = useState(0)
  const [cooldown, setCooldown] = useState(0)

  useEffect(() => {
    if (cooldown <= 0) return
    const t = setInterval(() => setCooldown((c) => (c > 1 ? c - 1 : 0)), 1000)
    return () => clearInterval(t)
  }, [cooldown])

  const handleSchoolVerify = async () => {
    setMsg(null)
    try {
      const result = await univCheck(univ)
      if (result.success) {
        setSchoolVerified(true)
        setMsg({ text: '학교 인증 완료', type: 'success' })
      } else {
        setErrorDialog({ isOpen: true, message: result.message || '학교 인증 실패' })
      }
    } catch (e) {
      const m = e instanceof Error ? e.message : '학교 인증 중 오류'
      setErrorDialog({ isOpen: true, message: m })
    }
  }

  const handleSendCode = async () => {
    setMsg(null)
    if (!isSchoolVerified) {
      setErrorDialog({ isOpen: true, message: '학교 인증을 먼저 해 주세요.' })
      return
    }
    if (resendCount >= 3) {
      setErrorDialog({ isOpen: true, message: '재발송 최대 횟수(3회) 초과' })
      return
    }
    if (cooldown > 0) {
      setErrorDialog({ isOpen: true, message: `재발송 대기중 ${cooldown}s` })
      return
    }
    try {
      const result = await sendCode(univ, email)
      if (result.success) {
        setCodeSent(true)
        setResendCount((c) => c + 1)
        setCooldown(30)
        setMsg({ text: '인증번호 발송 완료', type: 'success' })
        if (result.code) console.log('인증번호:', result.code)
      } else {
        setErrorDialog({ isOpen: true, message: result.message || '발송 실패' })
      }
    } catch (e) {
      const m = e instanceof Error ? e.message : '인증번호 발송 중 오류'
      setErrorDialog({ isOpen: true, message: m })
    }
  }

  const handleNext = async () => {
    setMsg(null)
    if (!isCodeSent) {
      setMsg({ text: '인증번호를 먼저 발송해 주세요.', type: 'error' })
      return
    }
    try {
      const result = await verifyCode(univ, email, code)
      if (!result.success) {
        setMsg({ text: result.message!, type: 'error' })
        return
      }
      document.cookie = `univ=${encodeURIComponent(univ)}; path=/;`
      document.cookie = `email=${encodeURIComponent(email)}; path=/;`
      router.push('/cert/register')
    } catch (e) {
      const m = e instanceof Error ? e.message : '인증번호 확인 중 오류'
      setErrorDialog({ isOpen: true, message: m })
    }
  }

  const closeErrorDialog = () => {
    setErrorDialog({ isOpen: false, message: '' })
  }

  return (
    <main>
      <Header />
      <ErrorDialog isOpen={errorDialog.isOpen} message={errorDialog.message} onClose={closeErrorDialog} />
      <div className="min-h-screen bg-white flex flex-col items-center pt-[60px]">
        <h1 className="text-[32px] text-center font-bold mb-[28px] text-[#232323]">회원가입</h1>
        <div className="flex justify-center space-x-[60px] mb-8">
          <div className="w-[178px] h-[56px] flex items-center bg-gray-200 rounded-lg px-[20px] py-[16px] space-x-2">
            <span className="w-[24px] h-[24px] bg-[#232323] text-white rounded-lg flex items-center justify-center font-bold">1</span>
            <span className="text-[#232323] font-bold">학교 이메일 인증</span>
          </div>
          <div className="w-[178px] h-[56px] flex items-center bg-gray-200 rounded-lg px-[20px] py-[16px] space-x-2">
            <span className="w-[24px] h-[24px] bg-[#ADAEB2] text-[#F3F3F5] rounded-lg flex items-center justify-center font-bold">2</span>
            <span className="text-[#ADAEB2] font-bold">회원 정보 입력</span>
          </div>
          <div className="w-[178px] h-[56px] flex items-center bg-gray-200 rounded-lg px-[20px] py-[16px] space-x-2">
            <span className="w-[24px] h-[24px] bg-[#ADAEB2] text-[#F3F3F5] rounded-lg flex items-center justify-center font-bold">3</span>
            <span className="font-bold text-[#ADAEB2]">회원가입 완료</span>
          </div>
        </div>
        <div className="w-[654px] h-[555px] bg-[#F3F5F5] px-[84px] py-[60px] rounded-2xl space-y-6">
          <div>
            <label className="block mb-[8px] text-[#232323]">학교</label>
            <div className="flex items-center space-x-5">
              <input
                className="flex-1 w-[337px] h-[53px] p-[16px] border border-white rounded-lg bg-white text-black placeholder-[#C2C3C9]"
                placeholder="학교 이름을 입력해 주세요."
                value={univ}
                onChange={(e) => setUniv(e.target.value)}
                disabled={isSchoolVerified}
              />
              <button
                className="w-[133px] h-[53px] bg-[#C2C3C9] text-white rounded-lg"
                onClick={handleSchoolVerify}
                disabled={isSchoolVerified || !univ.trim()}
              >
                학교 인증
              </button>
            </div>
          </div>
          <div>
            <label className="block mb-1 text-gray-700">학교 이메일</label>
            <div className="flex items-center space-x-5">
              <input
                className="flex-1 p-3 border border-gray-300 rounded-lg bg-white text-black placeholder-[#B3B3B3]"
                placeholder="학교 이메일을 입력해 주세요."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isCodeSent}
              />
              <button
                className="w-32 py-3 bg-black text-white rounded-lg "
                onClick={handleSendCode}
                disabled={!isSchoolVerified || isCodeSent || !email.includes('@')}
              >
                {isCodeSent ? '재발송' : '인증번호 발송'}
              </button>
            </div>
          </div>
          <div>
            <label className="block mb-1 text-gray-700">인증번호</label>
            <div className="flex items-center space-x-5">
              <input
                className="flex-1 p-3 border border-gray-300 rounded-lg bg-white text-black placeholder-[#B3B3B3]"
                placeholder="전송받은 인증번호를 입력해 주세요."
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>
          </div>
          {msg && (
            <p className={msg.type === 'error' ? 'text-red-600' : 'text-green-600'}>
              {msg.text}
            </p>
          )}
          <div className="flex justify-center mt-[60px]">
            <button
              onClick={handleNext}
              disabled={!email || !code}
              className="w-[318px] h-[53px] bg-[#6849FE] text-white rounded-lg disabled:opacity-50 hover:bg-[#5A3FE8] transition-colors duration-200 font-medium"
            >
              다음
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
