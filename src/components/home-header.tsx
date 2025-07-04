// src/components/home-header.tsx
'use client';

import Image from 'next/image';
import Link  from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function HomeHeader() {
  const router  = useRouter();
  const queryMe = router.query.me as string | undefined;
  const [me, setMe] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (queryMe) {
      setMe(queryMe);
    } else {
      // 로그인 후 localStorage에 저장된 me 읽어오기
      const stored = typeof window !== 'undefined' ? localStorage.getItem('me') : null;
      if (stored) setMe(stored);
    }
  }, [queryMe]);

  return (
    <div className="pl-[260px] pr-[272px] bg-white">
      <header className="w-full flex justify-between items-center px-8 py-4">
        <Image src="/images/blogo.svg" alt="로고" width={63} height={20} />
        <div className="flex items-center gap-2">
          {/* 이제 여기서 채팅으로 이동 */}
          <Link
            href={me ? `/channels?me=${encodeURIComponent(me)}` : '/'}
            className="text-black px-6 py-2 rounded-md hover:bg-gray-200 transition-colors"
          >
            내채팅
          </Link>
          {/* 나머지 메뉴 */}
          <Link href="/rentals" className="text-black px-6 py-2 rounded-md hover:bg-gray-200 transition-colors">대여내역</Link>
          <Link href="/items"   className="text-black px-6 py-2 rounded-md hover:bg-gray-200 transition-colors">등록한 물건</Link>
          <Link href={me ? `/profile?me=${encodeURIComponent(me)}` : '/profile'}>
            <Image src="/images/profile.svg" alt="프로필 이미지" width={40} height={40} />
          </Link>
        </div>
      </header>
    </div>
  );
}
