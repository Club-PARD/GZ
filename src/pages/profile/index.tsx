// src/pages/profile/index.tsx
'use client';  // ← 클라이언트 컴포넌트로 지정
import React, { useState, useEffect } from 'react';
import Header from '@/components/home-header';
import Footer from '@/components/Footer';
import Sidebar from './sidebar';
import InfoSection from './InfoSection';
import SettingsSection from './SettingsSection';
import PoliciesSection from './PoliciesSection';
import SupportSection from './SupportSection';
import AccountSection from './AccountSection';

type TabKey = 'info' | 'settings' | 'policies' | 'support' | 'account';

export default function ProfilePage() {
  // 탭 상태
  const [activeTab, setActiveTab] = useState<TabKey>('info');

  // userId 상태 추가
  const [userId, setUserId] = useState<number | null>(null);

  // 프로필 수정용 상태
  const [nickname, setNickname] = useState('');
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const isValid =
    nickname.trim() !== '' &&
    currentPw.trim() !== '' &&
    newPw.trim() !== '' &&
    confirmPw.trim() !== '' &&
    newPw === confirmPw;

  // 약관/개인정보 동의 상태
  const [expanded, setExpanded] = useState<{ terms: boolean; privacy: boolean }>({
    terms: false,
    privacy: false,
  });
  const [agreed, setAgreed] = useState<{ terms: boolean; privacy: boolean }>({
    terms: false,
    privacy: false,
  });
  const toggleExpand = (key: 'terms' | 'privacy') =>
    setExpanded(e => ({ ...e, [key]: !e[key] }));
  const toggleAgree = (key: 'terms' | 'privacy') =>
    setAgreed(a => ({ ...a, [key]: !a[key] }));

  // 마운트 시 localStorage에서 userId 가져오기
  useEffect(() => {
    const me = localStorage.getItem('me');
    if (me) {
      setUserId(Number(me));
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen h-[1928px] bg-white">
      <Header />
      <div className="flex flex-1 justify-center py-8 pt-[120px] ">
        <div className="w-[1280px] flex bg-white">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          <main className="flex-1 ml-[20px] overflow-y-auto">
            {activeTab === 'info' && userId !== null && (
              <InfoSection
                userId={userId}
                nickname={nickname}
                setNickname={setNickname}
                currentPw={currentPw}
                setCurrentPw={setCurrentPw}
                newPw={newPw}
                setNewPw={setNewPw}
                confirmPw={confirmPw}
                setConfirmPw={setConfirmPw}
                isValid={isValid}
              />
            )}
            {activeTab === 'settings' && <SettingsSection />}
            {activeTab === 'policies' && (
              <PoliciesSection
                expanded={expanded}
                agreed={agreed}
                toggleExpand={toggleExpand}
                toggleAgree={toggleAgree}
              />
            )}
            {activeTab === 'support' && <SupportSection />}
            {activeTab === 'account' && <AccountSection />}
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
}
