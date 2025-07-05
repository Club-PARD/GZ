 'use client';
  import Image from "next/image";
  import Link from "next/link";
 import { useRouter } from 'next/router';
 import { useEffect, useState } from 'react';

export default function BottomButton() {
  const router = useRouter();
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
    <div className="flex gap-4">
      <Link
        href="/home"
        className="text-[#828286] hover:text-[#8769FF] transition-colors"
      >
        메인
      </Link>
      <Link
        href={me ? `/channels?me=${encodeURIComponent(me)}` : '/'}
        className="text-[#828286] hover:text-[#8769FF] transition-colors"
      >
        내 채팅
      </Link>
      <Link
        href="/rentals"
        className="text-[#828286] hover:text-[#8769FF] transition-colors"
      >
        대여 내역
      </Link>
      <Link
        href="/items"
        className="text-[#828286] hover:text-[#8769FF] transition-colors"
      >
        등록한 물건
      </Link>
      <Link
        href="/profile  "
        className="text-[#828286] hover:text-[#8769FF] transition-colors"
      >
        내 프로필
      </Link>
      <Link
        href="/about"
        className="text-[#828286] hover:text-[#8769FF] transition-colors"
      >
        문의하기
      </Link>
    </div>
  );
}
