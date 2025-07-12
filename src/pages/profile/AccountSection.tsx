// components/profile/AccountSection.tsx
'use client';
import { PiCheckCircleFill } from "react-icons/pi";

import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Link from 'next/link';

const AccountSection: React.FC = () => {
  const router = useRouter();

  // 탈퇴 동의 체크박스 상태
  const [agreeQuit, setAgreeQuit] = useState(false);
  // 요청 중 로딩 상태
  const [isDeleting, setIsDeleting] = useState(false);

  // 로그아웃 핸들러 (기존)
  const handleLogout = () => {
    localStorage.removeItem('me');
    localStorage.removeItem('authToken');
    localStorage.removeItem('savedCredentials');
    router.replace('/');
  };

  // 회원 탈퇴 핸들러
  const handleQuit = async () => {
    if (!agreeQuit) return;
    setIsDeleting(true);
    try {
      await axios.delete('/api/user/quit', { withCredentials: true });
      // 탈퇴 성공하면 로컬 스토리지 정리 후 리다이렉트
      localStorage.removeItem('me');
      localStorage.removeItem('authToken');
      localStorage.removeItem('savedCredentials');
      router.replace('/');
    } catch (error) {
      console.error('회원 탈퇴 실패:', error);
      // 필요하면 사용자에게 에러 UI 표시
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className=" h-px bg-[#D8D9DF]  " />
      <h1 className="
      text-[var(--Gray-10,#232323)]       
      text-[24px]                       
      font-medium                      
      leading-[130%]                    
      tracking-[-0.48px]                 
      mb-6  pb-4 dark:text-black mt-[20px]">계정관리</h1>\
      <div className=" h-px bg-[#D8D9DF] mt-[-50px] " />

      {/* 로그아웃 */}
      <div className="flex items-center mb-[20px] mt-[20px]">
        <span className="
        text-[var(--Gray-06,#ADAEB2)]   /* color: var(--Gray-06, #ADAEB2) */
    text-[18px]                     /* font-size: 18px */
    font-normal                     /* font-weight: 400 */
    leading-[160%]                  /* line-height: 160% */
    tracking-[-0.36px]              /* letter-spacing: -0.36px */
         dark:text-black pl-[48px] ">로그아웃</span>
        <button
          onClick={handleLogout}
          className="ml-[32px] px-4 py-2 border rounded-lg hover:bg-gray-100 transition dark:text-black "
        >
          로그아웃
        </button>
      </div>

      {/* 회원 탈퇴 안내 */}
      <div className="text-[var(--Gray-06,#ADAEB2)]   /* color: var(--Gray-06, #ADAEB2) */
    text-[18px]                     /* font-size: 18px */
    font-normal                     /* font-weight: 400 */
    leading-[160%]                  /* line-height: 160% */
    tracking-[-0.36px]              /* letter-spacing: -0.36px */
    mt-[64px]
    pb-[12px]
    pl-[48px]">회원 탈퇴</div>
    <div className="pl-[48px]">
      <div className=" mb-[20px] p-8     w-[759px]                    /* 가로 759px */
    h-[250px]                    /* 세로 250px */
    flex-shrink-0                /* 축소 금지 */
    rounded-lg                   /* border-radius: 8px */
    bg-[var(--Gray-02,#F9F9FA)]  /* 기본 배경 */
    dark:bg-[var(--Gray-02,#F9F9FA)] /* 다크 모드에서도 동일 배경 */">
        
        <ul className="list-disc list-inside space-y-1     text-[var(--Gray-09,#4C4C4E)] 
    font-['Pretendard Variable']
    text-[16px]
    font-normal
    leading-[150%]
    tracking-[-0.32px]
     ">
          계정 정보 및 데이터 복구 불가
          <li>탈퇴 후에는 계정 정보, 개인정보, 저장된 데이터 등을 복구할 수 없습니다.</li>
          재가입 제한
          <li>일부 서비스의 경우 탈퇴 후 일정 기간 동안 동일한 계정으로 재가입이 제한될 수 있습니다.</li>
          <br />
          게시물 정리
          <li>탈퇴 전에 게시판 등에 작성한 글, 댓글, 자료 등을 정리하는 것이 좋습니다.</li>
          <li>탈퇴 후에는 게시물이 삭제되지 않을 수 있습니다. </li>
        </ul>
      </div>

    </div>
      

      {/* 동의 체크박스 */}
      <label className="inline-flex items-center pl-[438px] space-x-2 cursor-pointer">
  {/* 1) 기본 체크박스 숨기기 */}
  <input
    type="checkbox"
    checked={agreeQuit}
    onChange={() => setAgreeQuit(prev => !prev)}
    className="sr-only"
  />

  {/* 2) agreeQuit 에 따라 아이콘 또는 빈 원 */}
  {agreeQuit ? (
    <PiCheckCircleFill size={24} className="text-[#6849FE]" />
  ) : (
    <span className="w-[24px] h-[24px] border border-[#ADAEB2] rounded-full" />
  )}

  {/* 3) 라벨 텍스트 */}
  <span className="text-gray-700">
    탈퇴 시 위 안내 사항을 모두 확인하였으며, 동의합니다.
  </span>
</label>

      {/* 버튼 그룹 */}
      <div className="flex gap-4 pl-[419px] pt-[32px]">
        <Link
          href="/home"
          className=" flex
    w-[160px]
    py-4 px-6
    justify-center
    items-center
    gap-1.5
    rounded-lg
    bg-[var(--Gray-08,#616264)]
    dark:bg-[var(--Gray-08,#616264)]"
        >
          홈으로 이동
        </Link>
        <button
          onClick={handleQuit}
          disabled={!agreeQuit || isDeleting}
          className={`    flex
    w-[160px]
    py-4 px-6
    justify-center
    items-center
    gap-1.5
    rounded-[8px]
    bg-[var(--Purple-04,#6849FE)]
    dark:bg-[var(--Purple-04,#6849FE)] ${
            agreeQuit
              ? 'bg-purple-600 hover:bg-purple-700'
              : 'bg-gray-300 cursor-not-allowed'
          }`}
        >
          {isDeleting ? '탈퇴 중...' : '탈퇴하기'}
        </button>
      </div>
    </>
  );
};

export default AccountSection;
