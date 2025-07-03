// src/pages/channels.tsx
'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { initSendbird } from '@/lib/sendbird';
import ChatLayout from '@/components/chat-components/ChatLayout';

export default function ChannelsPage() {
  const router = useRouter();
  const me = router.query.me as string;

  useEffect(() => {
    if (!me) {
      router.push('/');
    } else {
      initSendbird(process.env.NEXT_PUBLIC_SENDBIRD_APP_ID!).connect(me);
    }
  }, [me, router]);

  if (!me) {
    return <div>로딩 중...</div>;
  }

  return <ChatLayout me={me} />;
}
