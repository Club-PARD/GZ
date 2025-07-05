// src/components/home-header.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { AiFillSetting } from 'react-icons/ai';
import { MdPolicy } from "react-icons/md";
import { BsHeadset } from "react-icons/bs";
import { MdManageAccounts } from "react-icons/md";

export default function HomeHeader() {
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
          <Link href="/items" className="text-black px-6 py-2 rounded-md hover:bg-gray-200 transition-colors">등록한 물건</Link>
          {/*---------------------------- 수정부분----태윤---------------------- */}
          <div className="relative inline-block group">
            <Link
              href={me ? `/profile?me=${encodeURIComponent(me)}` : '/profile'}
              className="cursor-pointer"
            >
              <Image
                src="/images/profile.svg"
                alt="프로필 이미지"
                width={40}
                height={40}
              />
            </Link>

            {/* 호버 시 나타날 작은 드롭다운 */}
            <div className="
            
              absolute top-full right-0 mt-2
              w-[268px] h-[308px] bg-[#fff]
              shadow-[0px_4px_12px_0px_rgba(0,0,0,0.1)]
              z-50
              transition-opacity duration-200
              delay-[1000ms] group-hover:delay-0
              opacity-0 pointer-events-none
              group-hover:opacity-100 group-hover:pointer-events-auto
            ">
              {/* 상단 프로필 요약 */}
              <div className="flex items-center p-4 ">
                <Image
                  src="/images/profile.svg"
                  alt="내 아바타"
                  width={60}
                  height={60}
                  className="rounded-full "
                />
                <div className="ml-3">
                  <div className="
                    text-[#232323]          /* color: #232323; */
                    font-[Pretendard]       /* font-family: Pretendard; */
                    text-[18px]             /* font-size: 18px; */
                    font-semibold           /* font-weight: 600; */
                    leading-[130%]          /* line-height: 130%; */
                    tracking-[-0.36px]      /* letter-spacing: -0.36px; */
                  ">
                    닉네임
                  </div>
                  <div className="
                    text-[#A2A3A7]          /* color: #A2A3A7 */
                    font-[Pretendard]       /* font-family: Pretendard */
                    text-[16px]             /* font-size: 16px */
                    font-normal             /* font-weight: 400 */
                    leading-[130%]          /* line-height: 130% */
                    tracking-[-0.32px]      /* letter-spacing: -0.32px */
                  ">
                    학교 메일
                  </div>

                  <hr className="mx-4 h-[1px] bg-[#F3F3F5] border-none" />
                </div>
                <Link
                  href="/profile"
                  className="
                    ml-auto
                    text-[#8769FF]        /* color: #8769FF */
                    font-[Pretendard]     /* font-family: Pretendard */
                    text-[14px]           /* font-size: 14px */
                    font-medium           /* font-weight: 500 */
                    leading-[130%]        /* line-height: 130% */
                    tracking-[-0.28px]    /* letter-spacing: -0.28px */
                    hover:underline       /* hover 시 밑줄 */
                  "
                >
                  프로필 정보
                </Link>
              </div>
              {/* 팝업 라인 */}
              <hr className="mx-5 h-[1px] bg-[#F3F3F5] border-none" />
              {/* 메뉴 리스트 */}
              <ul className="p-2 space-y-1">
                <li>
                  <Link
                    href="/settings"
                    className="
                      flex items-center 
                      w-[232px] py-[10px] px-[16px] gap-[12px] 
                      bg-white hover:bg-gray-100 rounded
                    "
                  >
                    <AiFillSetting
                      className="
                        w-[28px] h-[28px] shrink-0 
                        text-[#C2C3C9]
                      "
                    />
                    <span className="
                      text-[#232323]         
                      font-[Pretendard]      
                      text-[16px]            
                      font-normal             
                      leading-[130%]         
                      tracking-[-0.32px]     
                    ">
                      환경설정
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                      href="/policy"
                      className="flex items-center 
                      w-[232px] py-[10px] px-[16px] gap-[12px] 
                     bg-white hover:bg-gray-100 rounded"
                    >
                    <MdPolicy
                      className="
                        w-[28px] h-[28px] shrink-0 
                        text-[#C2C3C9]
                      "
                    />
                    <span className="
                      text-[#232323]         
                      font-[Pretendard]      
                      text-[16px]            
                      font-normal             
                      leading-[130%]         
                      tracking-[-0.32px]     
                    ">
                      약관 및 정책
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/support"
                    className="flex items-center 
                      w-[232px] py-[10px] px-[16px] gap-[12px] 
                      bg-white hover:bg-gray-100 rounded"
                  >
                    <BsHeadset
                      className="
                        w-[28px] h-[28px] shrink-0 
                        text-[#C2C3C9]
                      "
                    />
                    <span className="
                      text-[#232323]         
                      font-[Pretendard]      
                      text-[16px]            
                      font-normal             
                      leading-[130%]         
                      tracking-[-0.32px] 
                    ">
                      고객센터
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/manage-accounts"
                    className="
                      flex items-center 
                      w-[232px] py-[10px] px-[16px] gap-[12px] 
                      bg-white hover:bg-gray-100 rounded
                    "
                  >
                    <MdManageAccounts
                      className="
                        w-[28px] h-[28px] shrink-0 
                        text-[#C2C3C9]
                      "
                    />
                    <span className="
                      text-[#232323]         
                      font-[Pretendard]      
                      text-[16px]            
                      font-normal             
                      leading-[130%]         
                      tracking-[-0.32px]     
                    ">
                      계정관리
                    </span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}
