// src/components/chat/MessageBubble.tsx
import React from 'react';
import type { UserMessage, FileMessage } from '@sendbird/chat/message';

interface MessageBubbleProps {
  message: UserMessage | FileMessage;
  me: string;
}

export default function MessageBubble({
  message,
  me,
}: MessageBubbleProps) {
  const isMine = message.sender.userId === me;
  return (
    <div className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-xs p-2 rounded-lg shadow ${
          isMine ? 'bg-[#F3F0FF]' : 'bg-white'
        }`}
      >
        {/* 텍스트 혹은 이미지 구분 렌더링 */}
        {'url' in message ? (
          <img
            src={message.thumbnails?.[0]?.url || message.url}
            alt={message.name}
            className="max-w-full rounded"
          />
        ) : (
          <p className="text-sm text-black">{message.message}</p>
        )}

        <div className="text-xs text-gray-500 text-right mt-1">
          {new Date(message.createdAt).toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}
