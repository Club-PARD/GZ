// src/components/chat/ChannelItem.tsx
'use client';

import React from 'react';
import type { GroupChannel } from '@sendbird/chat/groupChannel';

interface ChannelItemProps {
  channel: GroupChannel;
  isActive: boolean;
  onClick: () => void;
}

export default function ChannelItem({
  channel,
  isActive,
  onClick,
}: ChannelItemProps) {
  const title =
    channel.name ||
    channel.members
      .map(m => (m.nickname && m.nickname.length > 0 ? m.nickname : m.userId)).join(', ');
  const lastMsg = channel.lastMessage
    ? 'message' in channel.lastMessage
      ? channel.lastMessage.message
      : '[파일]'
    : '대화를 시작해보세요!';

  return (
    <div
      onClick={onClick}
      className={`
        flex items-center px-4 py-3 cursor-pointer transition-colors
        ${isActive ? 'bg-[#F3F0FF]' : 'hover:bg-gray-100'}
      `}
    >
      <img
        src="/chat/chat-profile.svg"
        alt="프로필"
        className="w-10 h-10 rounded-full mr-3 flex-shrink-0"
      />
      <div className="flex-1">
        <div className="font-medium text-gray-800 truncate">{title}</div>
        <div className="text-sm text-gray-500 truncate">{lastMsg}</div>
      </div>
    </div>
  );
}
