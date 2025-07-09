// pages/profile.tsx
import React, { useState } from 'react';
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
  const [activeTab, setActiveTab] = useState<TabKey>('info');

  // 정책(약관) 섹션 상태
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

  // 프로필 수정 용 상태
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

  return (
    <div className="flex flex-col min-h-screen h-[1080px] bg-white">
      <Header />
      <div className="flex flex-1 justify-center py-8 pt-[120px]">
        <div className="w-[1280px] flex bg-white">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          <main className="flex-1 p-10 overflow-y-auto">
            {activeTab === 'info' && (
              <InfoSection
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