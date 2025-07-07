// pages/profile.tsx
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Header from '@/components/home-header';
import Footer from '@/components/Footer';
import Image from 'next/image';
import Link from 'next/link';

const tabs = [
  { key: 'info', label: '내 정보' },
  { key: 'settings', label: '환경설정' },
  { key: 'terms', label: '약관 및 정책' },
  { key: 'support', label: '고객센터' },
  { key: 'account', label: '계정관리' },
] as const;

type TabKey = typeof tabs[number]['key'];

export default function ProfilePage() {
  const router = useRouter();
  const { me } = router.query;
  const [activeTab, setActiveTab] = useState<TabKey>('info');

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      {/* MacBook 14"(Pro) 기준 여유 공간 확보: header 높이(72px) 만큼 padding-top, 수평 여백 px-8 */}
      <div className="flex flex-1 max-w-[1280px] mx-auto pt-[72px] px-8">
        {/* 사이드바 */}
        <nav className="w-[232px] flex-shrink-0 flex flex-col space-y-2 pt-6 px-4 bg-white border-r border-gray-200">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`
                flex items-center h-[40px] px-4 rounded-lg text-sm font-medium
                ${activeTab === tab.key
                  ? 'bg-purple-50 text-purple-600'
                  : 'text-gray-500 hover:bg-gray-100'}
              `}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* 메인 콘텐츠 */}
        <main className="flex-1 px-6">
          {activeTab === 'info' && (
            <section>
              <h2 className="text-xl font-semibold mb-6">내 프로필</h2>

              <div className="flex items-center mb-8">
                <div className="w-14 h-14 rounded-full bg-gray-200 flex-shrink-0" />
                <div className="ml-4">
                  <p className="font-medium">기존 닉네임</p>
                  <p className="text-gray-500 text-sm">handong@handong.ac.kr</p>
                </div>
              </div>

              <h3 className="text-lg font-semibold mb-4">프로필 수정</h3>
              <form className="space-y-4 max-w-md">
                <div>
                  <label className="block mb-1 text-sm text-gray-700">닉네임</label>
                  <input
                    type="text"
                    placeholder="새 닉네임 입력"
                    className="w-full bg-gray-100 rounded-xl px-4 py-3 placeholder-gray-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm text-gray-700">현재 비밀번호</label>
                  <input
                    type="password"
                    placeholder="현재 비밀번호 입력"
                    className="w-full bg-gray-100 rounded-xl px-4 py-3 placeholder-gray-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm text-gray-700">새 비밀번호</label>
                  <input
                    type="password"
                    placeholder="영문, 숫자, 특수문자 포함 8자~16자"
                    className="w-full bg-gray-100 rounded-xl px-4 py-3 placeholder-gray-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm text-gray-700">새 비밀번호 확인</label>
                  <input
                    type="password"
                    placeholder="새 비밀번호 확인"
                    className="w-full bg-gray-100 rounded-xl px-4 py-3 placeholder-gray-400 focus:outline-none"
                  />
                </div>

                <div className="flex space-x-4 mt-6">
                  <button
                    type="button"
                    className="flex-1 bg-gray-500 text-white rounded-xl py-3 text-sm font-medium hover:bg-gray-600"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-purple-600 text-white rounded-xl py-3 text-sm font-medium hover:bg-purple-700"
                  >
                    등록하기
                  </button>
                </div>
              </form>
            </section>
          )}

          {/* 환경설정, 약관 및 정책, 고객센터, 계정관리 탭 내용도 동일 방식으로 위치 조정 */}

        </main>
      </div>

      <Footer />
    </div>
  );
}