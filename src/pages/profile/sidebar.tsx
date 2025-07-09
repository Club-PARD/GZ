// components/profile/Sidebar.tsx
import React from 'react';
import TabButton from './TabButton';

type TabKey = 'info' | 'settings' | 'policies' | 'support' | 'account';

interface SidebarProps {
  activeTab: TabKey;
  setActiveTab: (t: TabKey) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => (
  <aside className="w-[280px] h-[435px] flex-shrink-0 bg-[var(--Gray-02,#F9F9FA)]">
    <div className="flex flex-col h-full justify-around">
      <TabButton label="내 정보" active={activeTab === 'info'} onClick={() => setActiveTab('info')} />
      <TabButton label="환경설정" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
      <TabButton label="약관 및 정책" active={activeTab === 'policies'} onClick={() => setActiveTab('policies')} />
      <TabButton label="고객센터" active={activeTab === 'support'} onClick={() => setActiveTab('support')} />
      <TabButton label="계정관리" active={activeTab === 'account'} onClick={() => setActiveTab('account')} />
    </div>
  </aside>
);

export default Sidebar;