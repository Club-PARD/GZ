// src/components/home-header.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { AiFillSetting } from "react-icons/ai";
import { LuLogOut } from "react-icons/lu";
import { MdPolicy } from "react-icons/md";
import { BsHeadset } from "react-icons/bs";
import { MdManageAccounts } from "react-icons/md";
import axios from 'axios';
import { useRef } from 'react';

interface UserInfo {
  nickname: string;
  schoolName: string;
  studentMail: string;
}

export default function HomeHeader() {
  const router = useRouter();
  const queryMe = router.query.me as string | undefined;
  const [me, setMe] = useState<string | undefined>(undefined);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const closeTimeout = useRef<number>(300);
   const handleLogout = () => {
    localStorage.removeItem('me');
    localStorage.removeItem('authToken');
    localStorage.removeItem('savedCredentials');
    router.replace('/');
  };

  // 1) me 가져오기
  useEffect(() => {
    if (queryMe) {
      setMe(queryMe);
    } else {
      const stored =
        typeof window !== "undefined" ? localStorage.getItem("me") : null;
      if (stored) setMe(stored);
    }
  }, [queryMe]);

  // 2) me(id)를 이용해서 사용자 정보 조회
  useEffect(() => {
    if (!me) return;
    const fetchUserInfo = async () => {
      try {
        const res = await axios.get<{ data: UserInfo }>("/api/user/info", {
          params: { userId: Number(me) },
          withCredentials: true,
        });
        setUserInfo(res.data.data);
      } catch (err) {
        console.error("헤더 사용자 정보 조회 에러:", err);
      }
    };
    fetchUserInfo();
  }, [me]);

  useEffect(() => {
    if (queryMe) {
      setMe(queryMe);
    } else {
      // 로그인 후 localStorage에 저장된 me 읽어오기
      const stored =
        typeof window !== "undefined" ? localStorage.getItem("me") : null;
      if (stored) setMe(stored);
    }
  }, [queryMe]);


  
  return (
    <div className="fixed top-0 left-0 right-0 z-50 pl-[260px] pr-[272px] bg-white h-16">
      <header className="w-full flex justify-between items-center px-8 py-4 ">
        <Link href={'/home'}>
          <Image 
            src="/images/blogo.svg" 
            alt="로고" 
            width={94} 
            height={20} 
            style={{width: 'auto', height: 'auto'}} 
            priority
          />
        </Link>
        
        <div className="flex items-center gap-2">
          {/* 이제 여기서 채팅으로 이동 */}
          <Link
            href={me ? `/channels?me=${encodeURIComponent(me)}` : "/"}
            className="text-black px-6 py-2 rounded-md hover:bg-gray-200 transition-colors"
          >
            내채팅
          </Link>
          {/* 나머지 메뉴 */}
          <Link
            href="/rentals"
            className="text-black px-6 py-2 rounded-md hover:bg-gray-200 transition-colors"
          >
            대여내역
          </Link>
          <Link
            href="/items"
            className="text-black px-6 py-2 rounded-md hover:bg-gray-200 transition-colors"
          >
            내물건
          </Link>
          {/*---------------------------- 수정부분----태윤---------------------- */}
          <div
          className="relative inline-block"
          onMouseEnter={() => {
            // 마우스 들어오면 닫기 타이머 취소하고 바로 열기
            window.clearTimeout(closeTimeout.current);
            setMenuOpen(true)}}
          onMouseLeave={() => {
            closeTimeout.current = window.setTimeout(() => {
          setMenuOpen(false);
        }, 300);
            
            }}

          
        >
            <Link
              href={me ? `/profile?me=${encodeURIComponent(me)}` : "/profile"}
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
             <div
   className={`
     absolute top-full right-0 mt-2
    w-[268px] h-[368px] bg-[#fff]
     shadow-[0px_4px_12px_0px_rgba(0,0,0,0.1)]
     z-50
     transition-opacity duration-200
     ${menuOpen
       ? 'opacity-100 pointer-events-auto'
       : 'opacity-0 pointer-events-none'}
   `}
 >
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
                  <div
                    className="
                    text-[#232323]          /* color: #232323; */
                    text-[18px]             /* font-size: 18px; */
                    font-semibold           /* font-weight: 600; */
                    leading-[130%]          /* line-height: 130%; */
                    tracking-[-0.36px]      /* letter-spacing: -0.36px; */
                  "
                  >
                    {userInfo ? userInfo.nickname : "..."}
                  </div>
                  <div
                    className="
                    text-[#A2A3A7]          /* color: #A2A3A7 */
                    text-[16px]             /* font-size: 16px */
                    font-normal             /* font-weight: 400 */
                    leading-[130%]          /* line-height: 130% */
                    tracking-[-0.32px]      /* letter-spacing: -0.32px */
                  "
                  >
                     {userInfo
                      ? `${userInfo.schoolName} `
                      : "..."}
                  </div>

                  <hr className="mx-4 h-[1px] bg-[#F3F3F5] border-none" />
                </div>
                <Link
                  href="/profile"
                  className="
                    ml-auto
                    text-[#8769FF]        /* color: #8769FF */
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
                    href="/profile"
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
                    <span
                      
                      className="
                      text-[#232323]         
                      text-[16px]            
                      font-normal             
                      leading-[130%]         
                      tracking-[-0.32px]     
                    "
                    
                    >
                      환경설정
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/profile"
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
                    <span
                      className="
                      text-[#232323]         
                      text-[16px]            
                      font-normal             
                      leading-[130%]         
                      tracking-[-0.32px]     
                    "
                    >
                      약관 및 정책
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/profile"
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
                    <span
                      className="
                      text-[#232323]         
                      text-[16px]            
                      font-normal             
                      leading-[130%]         
                      tracking-[-0.32px] 
                    "
                    >
                      고객센터
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/profile"
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
                    <span
                      className="
                      text-[#232323]         
                      text-[16px]            
                      font-normal             
                      leading-[130%]         
                      tracking-[-0.32px]
                          
                    "
                    >
                      계정관리
                    </span>
                    
                  </Link>
                </li>
                <li>
                  
                   <button
  onClick={handleLogout}
  className="
    flex items-center 
    w-[232px] py-[10px] px-[16px] gap-[12px]
    bg-white hover:bg-gray-100 rounded
  "
>
  <LuLogOut
    className="
      w-[28px] h-[28px] shrink-0
      text-[#C2C3C9]
    "
  />
  <span
    className="
      text-[#232323]
      text-[16px]
      font-normal
      leading-[130%]
      tracking-[-0.32px]
    "
  >
    로그아웃
  </span>
</button>

                </li>
                
              </ul>
            </div>
          
          </div>
        </div>
      </header>
    </div>
  );
}
