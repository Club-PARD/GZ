'use client';

import React, { useState } from 'react';
import ChannelList from './ChannelList';
import ChatWindow from './ChatWindow';
import Footer from '@/components/Footer';
import Header from '@/components/home-header';

interface ChatLayoutProps {
  me: string;
}

export default function ChatLayout({ me }: ChatLayoutProps) {
  const [selectedChannelUrl, setSelectedChannelUrl] = useState<string>();

  return (
    <div>
      {/* 헤더 (수정 없음) */}
      <Header />
      <div className="flex flex-col min-h-screen bg-[#F9F9FA]">

        {/* 좌우 레이아웃: 헤더 패딩 재사용 + 위아래 여백 + 고정 높이 */}
        <div className="pl-[260px] pr-[272px] mt-6 mb-6 flex gap-6 h-[600px]">
          {/* 좌측 채널 목록 */}
          <aside className="w-1/3">
            <ChannelList
              me={me}
              selectedChannelUrl={selectedChannelUrl}
              onSelectChannel={setSelectedChannelUrl}
            />
          </aside>
          {/* 우측 채팅창 */}
          <main className="flex-1">
            <ChatWindow
              me={me}
              selectedChannelUrl={selectedChannelUrl}
            />
          </main>
        </div>



      </div>
      {/* 푸터 (수정 없음) */}
      <Footer />
    </div>
  );
}
