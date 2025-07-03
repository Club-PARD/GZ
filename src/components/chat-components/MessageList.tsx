// src/components/chat/MessageList.tsx
'use client';

import React from 'react';
import type { UserMessage, FileMessage } from '@sendbird/chat/message';
import MessageBubble from './MessageBubble';

interface MessageListProps {
  messages: (UserMessage | FileMessage)[];
  me: string;
}

export default function MessageList({ messages, me }: MessageListProps) {
  return (
    <div className="flex flex-col space-y-2">
      {messages.map((msg) => (
        <MessageBubble key={msg.messageId} message={msg} me={me} />
      ))}
    </div>
  );
}
