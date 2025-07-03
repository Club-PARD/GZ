// src/components/chat/ChannelList.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { initSendbird } from '@/lib/sendbird';
import type { GroupChannel } from '@sendbird/chat/groupChannel';
import ChannelItem from './ChannelItem';

interface ChannelListProps {
  me: string;
  selectedChannelUrl?: string;
  onSelectChannel: (url: string) => void;
}

export default function ChannelList({
  me,
  selectedChannelUrl,
  onSelectChannel,
}: ChannelListProps) {
  const [channels, setChannels] = useState<GroupChannel[]>([]);

  useEffect(() => {
    (async () => {
      const sb = initSendbird(process.env.NEXT_PUBLIC_SENDBIRD_APP_ID!);
      await sb.connect(me);
      const q = sb.groupChannel.createMyGroupChannelListQuery();
      const list = await q.next();
      setChannels(list);
    })();
  }, [me]);

  return (
    <div className="flex flex-col h-full bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      {/* 목록 헤더 */}
      <div className="px-4 py-4 border-b border-[#D8D9DF] text-center font-semibold text-gray-700">
        채팅 목록
      </div>
      {/* 스크롤 가능 영역 */}
      <div className="overflow-y-auto flex-1">
        {channels.map((ch) => (
          <ChannelItem
            key={ch.url}
            channel={ch}
            isActive={ch.url === selectedChannelUrl}
            onClick={() => onSelectChannel(ch.url)}
          />
        ))}
      </div>
    </div>
  );
}
