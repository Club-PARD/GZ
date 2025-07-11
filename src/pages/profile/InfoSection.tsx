// components/profile/InfoSection.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';
interface InfoSectionProps {
  userId: number;
  nickname: string;
  setNickname: (v: string) => void;
  currentPw: string;
  setCurrentPw: (v: string) => void;
  newPw: string;
  setNewPw: (v: string) => void;
  confirmPw: string;
  setConfirmPw: (v: string) => void;
  isValid: boolean;
}

interface UserInfo {
  nickname: string;
  schoolName: string;
  studentMail: string;
}

const InfoSection: React.FC<InfoSectionProps> = ({
  userId,
  nickname,
  setNickname,
  currentPw,
  setCurrentPw,
  newPw,
  setNewPw,
  confirmPw,
  setConfirmPw,
  isValid,
}) => {
  const [serverInfo, setServerInfo] = useState<UserInfo | null>(null);

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const res = await axios.get<{ data: UserInfo }>('/api/user/info', {
          params: { userId },
          withCredentials: true,
        });
        setServerInfo(res.data.data);
      } catch (err) {
        console.error('내 프로필 조회 에러:', err);
      }
    };
    fetchInfo();
  }, [userId]);

  return (
    <>
      {/* 내 정보 */}
      <div className="w-full border-y border-gray-200 py-[20px] mb-6">
        <h1 className="text-[var(--Gray-10,#232323)] text-[24px] font-medium leading-[130%] text-2xl pr-[40px] ml-[48px]">
          내 프로필
        </h1>
      </div>
      <div className="flex items-center mb-8">
                <div className=" rounded-full flex items-center justify-center text-gray-500 ml-[48px]">
          <Image
            src="/images/myprofile.svg"
            alt="프로필 아바타"
            width={100}          // ← 32px 로 키우고
            height={100}
            className="w-[100px] h-[100px] mr-[24px]" // ← Tailwind 로도 8×8 (32px) 고정
            priority
          />
        </div>
        <div className="ml-6">
          <p className="text-[var(--Gray-10,#232323)] text-[20px] font-medium leading-[130%] tracking-[-0.4px]">
            {serverInfo ? serverInfo.nickname : '...'}
          </p>
          <p className="text-[var(--Gray-06,#ADAEB2)] text-[16px] font-medium leading-[130%] tracking-[-0.32px]">
            {serverInfo ? `${serverInfo.schoolName} / ${serverInfo.studentMail}` : '...'}
          </p>
        </div>
      </div>

      {/* 프로필 수정 헤더 */}
      <div className="w-[890px] border-y border-[#D8D9DF] py-[20px] mb-6">
        <h1 className="text-[var(--Gray-10,#232323)] text-[24px] font-medium leading-[130%] tracking-[-0.48px] ml-[48px]">
          프로필 수정
        </h1>
      </div>

      {/* 프로필 수정 폼 */}
      <div className="space-y-[16px] pt-[24px]">
        {/* 닉네임 */}
        <div className="grid grid-cols-3 items-center gap-3 pb-[20px] ml-[48px]">
          <label
            htmlFor="nickname"
            className="text-[var(--Gray-06,#ADAEB2)] text-[18px] font-normal leading-[160%] tracking-[-0.36px] dark:text-[var(--Gray-06,#ADAEB2)]"
          >
            닉네임
          </label>
          <input
            id="nickname"
            type="text"
            value={nickname}
            onChange={e => setNickname(e.target.value)}
            placeholder="새 닉네임 입력"
            className="col-span-2 flex w-[416px] p-4 -ml-[89px] items-center gap-2 rounded-lg bg-[var(--Gray-03,#F3F3F5)] text-[var(--Gray-06,#ADAEB2)] text-[18px] font-normal leading-[160%] tracking-[-0.36px]"
          />
        </div>

        {/* 현재 비밀번호 */}
        <div className="grid grid-cols-3 items-center gap-4 ml-[48px]">
          <label
            htmlFor="current-pw"
            className="text-[var(--Gray-06,#ADAEB2)] text-[18px] font-normal leading-[160%] tracking-[-0.36px] dark:text-[var(--Gray-06,#ADAEB2)]"
          >
            현재 비밀번호
          </label>
          <input
            id="current-pw"
            type="password"
            value={currentPw}
            onChange={e => setCurrentPw(e.target.value)}
            placeholder="현재 비밀번호 입력"
            className="col-span-2 flex w-[416px] p-4 -ml-[89px] items-center gap-2 rounded-lg bg-[var(--Gray-03,#F3F3F5)] text-[var(--Gray-06,#ADAEB2)] text-[18px] font-normal leading-[160%] tracking-[-0.36px]"
          />
        </div>

        {/* 새 비밀번호 */}
        <div className="grid grid-cols-3 items-center gap-4 ml-[48px]">
          <label
            htmlFor="new-pw"
            className="text-[var(--Gray-06,#ADAEB2)] text-[18px] font-normal leading-[160%] tracking-[-0.36px] dark:text-[var(--Gray-06,#ADAEB2)]"
          >
            새 비밀번호
          </label>
          <input
            id="new-pw"
            type="password"
            value={newPw}
            onChange={e => setNewPw(e.target.value)}
            placeholder="영문, 숫자, 특수문자 조합 8자~16자"
            className="col-span-2 flex w-[416px] p-4 -ml-[89px] items-center gap-2 rounded-lg bg-[var(--Gray-03,#F3F3F5)] text-[var(--Gray-06,#ADAEB2)] text-[18px] font-normal leading-[160%] tracking-[-0.36px]"
          />
        </div>

        {/* 새 비밀번호 확인 */}
        <div className="grid grid-cols-3 items-center gap-4 ml-[48px]">
          <label
            htmlFor="confirm-pw"
            className="text-[var(--Gray-06,#ADAEB2)] text-[18px] font-normal leading-[160%] tracking-[-0.36px] dark:text-[var(--Gray-06,#ADAEB2)]"
          >
            새 비밀번호 확인
          </label>
          <input
            id="confirm-pw"
            type="password"
            value={confirmPw}
            onChange={e => setConfirmPw(e.target.value)}
            placeholder="새 비밀번호 확인"
            className="col-span-2 flex w-[416px] p-4 -ml-[89px] items-center gap-2 rounded-lg bg-[var(--Gray-03,#F3F3F5)] text-[var(--Gray-06,#ADAEB2)] text-[18px] font-normal leading-[160%] tracking-[-0.36px]"
          />
        </div>
      </div>

      {/* 액션 버튼 */}
      <div className="flex w-full justify-center space-x-[20px] mt-[40px]">
        <button
          className="flex w-[160px] py-4 px-6 justify-center items-center gap-1.5 rounded-lg bg-[var(--Gray-08,#616264)] text-[var(--White,#FFF)] text-center text-[16px] font-semibold leading-[130%] tracking-[-0.32px]"
        >
          취소
        </button>
        <button
          disabled={!isValid}
          className={`flex w-[160px] py-4 px-6 justify-center items-center gap-1.5 rounded-lg ${
            isValid
              ? 'bg-[var(--Purple-04,#6849FE)] text-[var(--White,#FFF)]'
              : 'bg-[var(--Gray-03,#F3F3F5)] text-[var(--Gray-06,#ADAEB2)]'
          } text-[16px] font-semibold leading-[130%] tracking-[-0.32px]`}
          onClick={() => {
            // 등록 로직
          }}
        >
          등록하기
        </button>
      </div>
    </>
  );
};

export default InfoSection;
