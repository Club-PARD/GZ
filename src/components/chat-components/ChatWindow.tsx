// src/components/chat/ChatWindow.tsx
'use client';

import React, { useEffect, useState, useRef } from 'react';
import { initSendbird } from '@/lib/sendbird';
import { GroupChannel, GroupChannelHandler } from '@sendbird/chat/groupChannel';
import type { BaseMessage, UserMessage, FileMessage } from '@sendbird/chat/message';
import MessageList from './MessageList';
import { BiSolidImage } from '@/components/icons'


// 타입 가드 (변경 없음)
function isUserMessage(msg: BaseMessage): msg is UserMessage {
  return (msg as UserMessage).message !== undefined;
}
function isFileMessage(msg: BaseMessage): msg is FileMessage {
  return (msg as FileMessage).url !== undefined;
}

interface ChatWindowProps {
  me: string;
  selectedChannelUrl?: string;
}

export default function ChatWindow({ me, selectedChannelUrl }: ChatWindowProps) {
  const [channel, setChannel] = useState<GroupChannel>();
  const [messages, setMessages] = useState<(UserMessage | FileMessage)[]>([]);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const listRef = useRef<HTMLDivElement>(null);

  // ★ 새로 추가된 ref들
  const textRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // 1) 채널 로드·메시지 페치·핸들러 등록 (기존 그대로)
  useEffect(() => {
    if (!selectedChannelUrl) {
      setChannel(undefined);
      setMessages([]);
      return;
    }
    const sb = initSendbird(process.env.NEXT_PUBLIC_SENDBIRD_APP_ID!);
    const handlerId = `h-${selectedChannelUrl}`;
    let alive = true;

    (async () => {
      const ch = await sb.groupChannel.getChannel(selectedChannelUrl);
      if (!alive) return;
      setChannel(ch);

      // 이전 메시지 로드 & 시간순 정렬
      const q = ch.createPreviousMessageListQuery({ limit: 50 });
      const raw = await q.load();
      const loaded = (raw.filter(
        m => isUserMessage(m) || isFileMessage(m)
      ) as (UserMessage | FileMessage)[])
        .sort((a, b) => a.createdAt - b.createdAt);
      setMessages(loaded);

      // 실시간 핸들러 (내 메시지는 무시)
      const handler = new GroupChannelHandler({
        onMessageReceived: (_ch, msg) => {
          if (
            _ch.url === selectedChannelUrl &&
            (isUserMessage(msg) || isFileMessage(msg)) &&
            msg.sender?.userId !== me
          ) {
            setMessages(prev => [...prev, msg]);
          }
        },
        onTypingStatusUpdated: grp => {
          setTypingUsers(
            grp
              .getTypingUsers()
              .map(u => u.userId)
              .filter(id => id !== me)
          );
        },
      });
      sb.groupChannel.addGroupChannelHandler(handlerId, handler);
      ch.markAsRead().catch(console.error);
    })();

    return () => {
      alive = false;
      sb.groupChannel.removeGroupChannelHandler(handlerId);
    };
  }, [selectedChannelUrl, me]);

  // 2) 자동 스크롤
  useEffect(() => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages, typingUsers]);

  // 3) 메시지 전송 함수 (기존 그대로)
  const sendMessage = (text: string) => {
    if (!channel || !text.trim()) return;
    channel
      .sendUserMessage({ message: text })
      .onSucceeded(msg => {
        if (isUserMessage(msg)) setMessages(prev => [...prev, msg]);
      })
      .onFailed(console.error);
    channel.startTyping();
    setTimeout(() => channel.endTyping(), 2000);
  };

  // 4) 파일 전송 함수 (기존 그대로)
  const sendFile = (file: File) => {
    if (!channel) return;
    channel
      .sendFileMessage({ file, fileName: file.name, mimeType: file.type, thumbnailSizes: [{ maxWidth: 200, maxHeight: 200 }] })
      .onSucceeded(msg => {
        if (isFileMessage(msg)) setMessages(prev => [...prev, msg]);
      })
      .onFailed(console.error);
  };

  // 채널 미선택 플레이스홀더 (기존 그대로)
  if (!selectedChannelUrl) {
    return (
      <div className="flex flex-col h-full bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="h-16 border-b border-gray-200" />
        <div className="flex-1 flex flex-col items-center justify-center">
          <img src="/chat/chat-placeholder.svg" alt="채팅 없음" className="w-24 h-24 mb-4 opacity-70" />
          <div className="text-gray-400 text-lg">내 채팅</div>
        </div>
        <div className="h-16 border-t border-gray-200" />
      </div>
    );
  }

  // 실제 채팅창
  const other = channel?.members.find(m => m.userId !== me)?.userId ?? '상대';
  return (
    <div className="flex flex-col h-full bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      {/* 헤더 */}
      <div className="flex items-center h-14 px-6 border-b border-gray-200 space-x-3">
        <img src="/chat/chat-profile.svg" alt="프로필" className="w-8 h-8 rounded-full" />
        <h2 className="text-lg font-medium text-gray-800">{other}님과의 채팅방</h2>
      </div>

      {/* 메시지 리스트 */}
      <div ref={listRef} className="flex-1 overflow-y-auto px-6 py-4 bg-gray-50 space-y-4">
        <MessageList messages={messages} me={me} />
        {typingUsers.length > 0 && <div className="text-xs text-gray-500">{typingUsers.join(', ')}님이 입력 중...</div>}
      </div>

      {/* ─── 2번 UI: form onSubmit 으로만 전송 ─── */}
      <form
        onSubmit={e => {
          e.preventDefault();
          const txt = textRef.current?.value.trim();
          if (txt) {
            sendMessage(txt);
            textRef.current!.value = '';
          }
        }}
        className="border-t border-gray-200 px-6 py-3 flex items-center"
      >
        {/* 숨김 파일 input */}
        <input
          ref={fileRef}
          type="file"
          accept="*/*"
          className="hidden"
          onChange={() => {
            const f = fileRef.current?.files?.[0];
            if (f) sendFile(f);
            if (fileRef.current) fileRef.current.value = '';
          }}
        />

        {/* 텍스트 input (테두리·배경 없이) */}
        <input
          ref={textRef}
          type="text"
          placeholder="메시지를 입력해 주세요"
          className="flex-1 bg-transparent border-none placeholder-gray-300 text-gray-800 focus:outline-none"
        />

        {/* 첨부 버튼 */}
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="ml-4 p-1"
          aria-label="파일 첨부"
        >
          <BiSolidImage size={25} color="#C2C3C9"/>
        </button>

        {/* 전송 버튼 */}
        <button type="submit" className="ml-4 p-1" aria-label="메시지 전송">
          <img src="/chat/chat-text.svg" alt="전송" className="w-6 h-6 opacity-60 hover:opacity-100" />
        </button>
      </form>
    </div>
  );
}
