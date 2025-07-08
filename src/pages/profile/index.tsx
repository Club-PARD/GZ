// pages/profile.tsx
import React, { useState } from 'react'
import Header from '@/components/home-header'
import Footer from '@/components/Footer'

type TabKey = 
  | 'info'
  | 'settings'
  | 'policies'
  | 'support'
  | 'account'

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<TabKey>('info')

  // 정책(약관) 섹션 상태
  const [expanded, setExpanded] = useState<{ [k in 'terms' | 'privacy']: boolean }>({
    terms: false,
    privacy: false,
  })
  const [agreed, setAgreed] = useState<{ [k in 'terms' | 'privacy']: boolean }>({
    terms: false,
    privacy: false,
  })

  const toggleExpand = (key: 'terms' | 'privacy') =>
    setExpanded((e) => ({ ...e, [key]: !e[key] }))
  const toggleAgree = (key: 'terms' | 'privacy') =>
    setAgreed((a) => ({ ...a, [key]: !a[key] }))

  const [nickname, setNickname] = useState('')
  const [currentPw, setCurrentPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const isValid =
      nickname.trim() !== '' &&
      currentPw.trim() !== '' &&
      newPw.trim() !== '' &&
      confirmPw.trim() !== '' &&
      newPw === confirmPw
  
  return (
    <div className="flex flex-col min-h-screen h-[1080px] bg-white">
      <Header />

      <div className="flex flex-1 justify-center py-8 pt-[120px]">
        <div className="w-[1280px] flex bg-white">

          {/* 사이드바 */}
          <aside className="w-[280px] h-[435px] flex-shrink-0 bg-[var(--Gray-02,#F9F9FA)] ">
            <div className="flex flex-col h-full justify-around ">
              <TabButton
                label="내 정보"
                active={activeTab === 'info'}
                onClick={() => setActiveTab('info')}
              />
              <TabButton
                label="환경설정"
                active={activeTab === 'settings'}
                onClick={() => setActiveTab('settings')}
              />
              <TabButton
                label="약관 및 정책"
                active={activeTab === 'policies'}
                onClick={() => setActiveTab('policies')}
              />
              <TabButton
                label="고객센터"
                active={activeTab === 'support'}
                onClick={() => setActiveTab('support')}
              />
              <TabButton
                label="계정관리"
                active={activeTab === 'account'}
                onClick={() => setActiveTab('account')}
              />
            </div>
          </aside>

          {/* 메인 컨텐츠 */}
          <main className="flex-1 p-10 overflow-y-auto">
            {/* 내 정보 */}
            {activeTab === 'info' && (
              <>
                <div className="w-full border-y border-gray-200 py-[20px] mb-6 border-b pb-[]]">
                  <h1 className="text-[var(--Gray-10,#232323)] text-[24px] font-medium leading-[130%]  text-2xl pr-[40px]">내 프로필</h1>
                </div>
                

                <div className="flex items-center mb-8">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                    {/* 아바타 아이콘 ----수정 필*/}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-8 h-8"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5.121 17.804A9 9 0 1118.88 6.195M9 11a3 3 0 106 0 3 3 0 00-6 0z"
                      />
                    </svg>
                    
                  </div>
                  
                  <div className="ml-6">
                    <p className="text-[var(--Gray-10,#232323)] font-['Pretendard Variable'] text-[20px] font-medium leading-[130%] tracking-[-0.4px]">기존 닉네임</p>
                    <p className="text-[var(--Gray-06,#ADAEB2)] font-['Pretendard Variable'] text-[16px] font-medium leading-[130%] tracking-[-0.32px]">
                      한동대학교 / handong@handong.ac.kr
                    </p>
                  </div>
                </div>
                <div className="w-[890px] border-y border-[#D8D9DF] py-[20px] mb-6 border-b ] ">
                  <h1 className="text-[var(--Gray-10,#232323)] font-['Pretendard Variable'] text-[24px] font-medium leading-[130%] tracking-[-0.48px]">프로필 수정</h1>
                </div>
                  
                <div className="space-y-[40px] pt-[24px]">
                  
                  {/* 닉네임 */}
                  <div className="grid grid-cols-3 items-center gap-4">
                    <label
                      htmlFor="nickname"
                      className="
                        text-[var(--Gray-06,#ADAEB2)]
                        font-['Pretendard Variable']
                        text-[18px] font-normal
                        leading-[160%]
                        tracking-[-0.36px]
                      "
                    >
                      닉네임
                    </label>
                    <input
                      id="nickname"
                      type="text"
                      value={nickname}
                      onChange={e => setNickname(e.target.value)}
                      placeholder="새 닉네임 입력"
                      className="
                        col-span-2            /* 오른쪽 2컬럼 합침 */
                        flex w-[416px] p-4 items-center gap-2 
                        rounded-lg bg-[var(--Gray-03,#F3F3F5)]
                        text-[var(--Gray-06,#ADAEB2)]
                        text-[18px] font-normal
                        leading-[160%]
                        tracking-[-0.36px]
                      "
                    />
                  </div>

                  {/* 현재 비밀번호 */}
                  <div className="grid grid-cols-3 items-center gap-4">
                    <label
                      htmlFor="current-pw"
                      className="
                        text-[var(--Gray-06,#ADAEB2)]
                        font-['Pretendard Variable']
                        text-[18px] font-normal
                        leading-[160%]
                        tracking-[-0.36px]
                      "
                    >
                      현재 비밀번호
                    </label>
                    <input
                      id="current-pw"
                      type="password"
                      placeholder="현재 비밀번호 입력"
                      value={currentPw}
                      onChange={e => setCurrentPw(e.target.value)}
                      className="col-span-2 flex w-[416px] p-4 items-center gap-2 rounded-lg bg-[var(--Gray-03,#F3F3F5)] text-[var(--Gray-06,#ADAEB2)] text-[18px] font-normal leading-[160%] tracking-[-0.36px]"
                    />
                  </div>

                  {/* 새 비밀번호 */}
                  <div className="grid grid-cols-3 items-center gap-4">
                    <label
                      htmlFor="new-pw"
                      className="
                        text-[var(--Gray-06,#ADAEB2)]
                        font-['Pretendard Variable']
                        text-[18px] font-normal
                        leading-[160%]
                        tracking-[-0.36px]
                      "
                    >
                      새 비밀번호
                    </label>
                    <input
                      id="new-pw"
                      type="password"
                      value={newPw}
                      onChange={e => setNewPw(e.target.value)}
                      placeholder="영문, 숫자, 특수문자 조합 8자~16자"
                      className="col-span-2 flex w-[416px] p-4 items-center gap-2 rounded-lg bg-[var(--Gray-03,#F3F3F5)] text-[var(--Gray-06,#ADAEB2)] text-[18px] font-normal leading-[160%] tracking-[-0.36px]"
                    />
                  </div>

                  {/* 새 비밀번호 확인 */}
                  <div className="grid grid-cols-3 items-center gap-4">
                    <label
                      htmlFor="confirm-pw"
                      
                      className="
                        text-[var(--Gray-06,#ADAEB2)]
                        font-['Pretendard Variable']
                        text-[18px] font-normal
                        leading-[160%]
                        tracking-[-0.36px]
                      "
                    >
                      새 비밀번호 확인
                    </label>
                    <input
                      id="confirm-pw"
                      type="password"
                      placeholder="새 비밀번호 확인"
                      value={confirmPw}
                      onChange={e => setConfirmPw(e.target.value)}
                      className="col-span-2 flex w-[416px] p-4 items-center gap-2 rounded-lg bg-[var(--Gray-03,#F3F3F5)] text-[var(--Gray-06,#ADAEB2)] text-[18px] font-normal leading-[160%] tracking-[-0.36px]"
                    />
                  </div>
                </div>

                <div className="flex w-full justify-center space-x-[20px] mt-8  ">
                  <button className="flex w-[160px] py-4 px-6 justify-center items-center gap-1.5 rounded-lg bg-[var(--Gray-08,#616264)] text-[var(--White,#FFF)] text-center font-['Pretendard Variable'] text-[16px] font-semibold leading-[130%] tracking-[-0.32px]">
                    취소
                  </button>
                  <button
                  disabled={!isValid}
                  className={`
                    flex w-[160px] py-4 px-6 justify-center items-center gap-1.5 rounded-lg
                    ${
                      isValid
                        ? 'flex w-[160px] py-4 px-6 justify-center items-center gap-1.5 rounded-lg bg-[var(--Purple-04,#6849FE)] text-[var(--White,#FFF)] text-center text-[16px] font-semibold leading-[130%] tracking-[-0.32px]'
                        : 'bg-[var(--Gray-03,#F3F3F5)] text-[var(--Gray-06,#ADAEB2)]'
                    }
                  `}
                    onClick={() => {/* 등록 로직 */}}
                    
                    
                  >
                    등록하기
                  </button>
                </div>
              </>
            )}

            {/* 환경설정 */}
            {activeTab === 'settings' && (
              <>
                <h1 className="text-2xl font-semibold mb-4 border-b pb-2">
                  환경설정
                </h1>
                <p className="text-gray-500">환경설정 옵션을 이곳에 추가하세요.</p>
              </>
            )}

            {/* 약관 및 정책 */}
            {activeTab === 'policies' && (
              <>
                <h1 className="text-2xl font-semibold mb-6 border-b pb-4">
                  약관 및 정책
                </h1>

                {/* 서비스 이용약관 */}
                <div className="space-y-2">
                  <button
                    onClick={() => toggleExpand('terms')}
                    className="w-full text-left px-4 py-2 bg-gray-100 rounded-md"
                  >
                    서비스 이용약관 {expanded.terms ? '▼' : '▶'}
                  </button>
                  {expanded.terms && (
                    <div className="p-4 border border-gray-200 rounded-md text-sm text-gray-700">
                      {/* 여기에 서비스 이용약관 전문을 붙여넣으세요 */}
                      <p>제1조(목적) …</p>
                      <p>제2조(정의) …</p>
                    </div>
                  )}
                  <label className="inline-flex items-center mt-2">
                    <input
                      type="checkbox"
                      checked={agreed.terms}
                      onChange={() => toggleAgree('terms')}
                      className="form-checkbox h-5 w-5 text-purple-600"
                    />
                    <span className="ml-2 text-gray-700">
                      [필수] 서비스 이용약관에 동의합니다.
                    </span>
                  </label>

                  <hr className="my-6" />

                  {/* 개인정보 수집·이용 */}
                  <button
                    onClick={() => toggleExpand('privacy')}
                    className="w-full text-left px-4 py-2 bg-gray-100 rounded-md"
                  >
                    개인정보 수집·이용 {expanded.privacy ? '▼' : '▶'}
                  </button>
                  {expanded.privacy && (
                    <div className="p-4 border border-gray-200 rounded-md text-sm text-gray-700">
                      {/* 여기에 개인정보 수집·이용 전문을 붙여넣으세요 */}
                      <p>총칙 …</p>
                    </div>
                  )}
                  <label className="inline-flex items-center mt-2">
                    <input
                      type="checkbox"
                      checked={agreed.privacy}
                      onChange={() => toggleAgree('privacy')}
                      className="form-checkbox h-5 w-5 text-purple-600"
                    />
                    <span className="ml-2 text-gray-700">
                      [필수] 개인정보 수집·이용에 동의합니다.
                    </span>
                  </label>
                </div>
              </>
            )}

            {/* 고객센터 */}
            {activeTab === 'support' && (
              <>
                <h1 className="text-2xl font-semibold mb-4 border-b pb-2">
                  고객센터
                </h1>
                <div className="space-y-4 text-gray-700">
                  <p>
                    <span className="font-medium">이메일:</span>{' '}
                    zigu06official@gmail.com
                  </p>
                  <p>
                    <span className="font-medium">근무시간 및 휴무안내:</span>
                    <br />
                    평일 09:00–18:00 (점심 12:00–14:00)
                    <br />
                    휴무: 토/일/공휴일
                  </p>
                </div>
              </>
            )}

            {/* 계정관리 */}
            {activeTab === 'account' && (
              <>
                <h1 className="text-2xl font-semibold mb-6 border-b pb-4">
                  계정관리
                </h1>

                <div className="flex items-center mb-8">
                  <span className="font-medium">로그아웃</span>
                  <button className="ml-4 px-4 py-2 border rounded-lg">
                    로그아웃
                  </button>
                </div>

                <div className="mb-4 p-4 bg-gray-100 rounded-md text-gray-700">
                  <p className="font-medium mb-2">회원 탈퇴 안내</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>탈퇴 후에는 계정 정보, 개인정보, 저장된 데이터를 복구할 수 없습니다.</li>
                    <li>일부 서비스는 탈퇴 후 일정 기간 재가입이 제한될 수 있습니다.</li>
                    <li>탈퇴 전에 게시물, 댓글, 파일 등 데이터를 정리하시기 바랍니다.</li>
                  </ul>
                </div>

                <label className="inline-flex items-center mb-6">
                  <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 text-purple-600"
                  />
                  <span className="ml-2 text-gray-700">
                    탈퇴 시 위 안내 사항을 모두 확인하였으며, 동의합니다.
                  </span>
                </label>

                <div className="flex gap-4">
                  <button className="px-6 py-2 bg-gray-600 text-white rounded-lg">
                    홈으로 이동
                  </button>
                  <button className="px-6 py-2 bg-purple-600 text-white rounded-lg">
                    탈퇴하기
                  </button>
                </div>
              </>
            )}
          </main>
        </div>
      </div>

      <Footer />
    </div>
  )
}

/** 사이드바 탭 버튼 컴포넌트 */
function TabButton({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`
        text-left w-full px-6 py-3 font-medium
        ${
          active
            ? 'bg-[var(--Gray-02,#F9F9FA)] text-[var(--Gray-10,#232323)] text-[18px] font-medium leading-[130%] tracking-[-0.36px]'
            : 'bg-[var(--Gray-02,#F9F9FA)]text-[var(--Gray-06,#ADAEB2)]  text-[18px] font-medium leading-[130%] tracking-[-0.36px]'
        }
      `}
    >
      {label}
    </button>
  )
}

/** 레이블 + 입력 필드 래퍼 */
function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="grid grid-cols-3 items-center gap-4">
      <label className="text-gray-700">{label}</label>
      <div className="col-span-2">{children}</div>
    </div>
  )
}
