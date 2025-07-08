// components/profile/InfoSection.tsx
import React from 'react';

interface InfoSectionProps {
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

const InfoSection: React.FC<InfoSectionProps> = ({ nickname, setNickname, currentPw, setCurrentPw, newPw, setNewPw, confirmPw, setConfirmPw, isValid }) => (
  <>
    {/* 내 정보 */}
    <div className="w-full border-y border-gray-200 py-[20px] mb-6 border-b pb-[]]">
      <h1 className="text-[var(--Gray-10,#232323)] text-[24px] font-medium leading-[130%]  text-2xl pr-[40px]">내 프로필</h1>
    </div>
    <div className="flex items-center mb-8">
      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
        {/* 아바타 아이콘 */}
        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A9 9 0 1118.88 6.195M9 11a3 3 0 106 0 3 3 0 00-6 0z" />
        </svg>
      </div>
      <div className="ml-6">
        <p className="text-[var(--Gray-10,#232323)] font-['Pretendard Variable'] text-[20px] font-medium leading-[130%] tracking-[-0.4px]">기존 닉네임</p>
        <p className="text-[var(--Gray-06,#ADAEB2)] font-['Pretendard Variable'] text-[16px] font-medium leading-[130%] tracking-[-0.32px]">
          한동대학교 / handong@handong.ac.kr
        </p>
      </div>
    </div>
    <div className="w-[890px] border-y border-[#D8D9DF] py-[20px] mb-6 border-b ] ">
      <h1 className="text-[var(--Gray-10,#232323)] font-['Pretendard Variable'] text-[24px] font-medium leading-[130%] tracking-[-0.48px]">프로필 수정</h1>
    </div>
    <div className="space-y-[16px] pt-[24px]">
      {/* 닉네임 */}
      <div className="grid grid-cols-3 items-center gap-3 pb-[20px]">
        <label htmlFor="nickname" className="text-[var(--Gray-06,#ADAEB2)] font-['Pretendard Variable'] text-[18px] font-normal leading-[160%] tracking-[-0.36px]">닉네임</label>
        <input
          id="nickname"
          type="text"
          value={nickname}
          onChange={e => setNickname(e.target.value)}
          placeholder="새 닉네임 입력"
          className="col-span-2 flex w-[416px] p-4 -ml-[89px] items-center gap-2 rounded-lg bg-[var(--Gray-03,#F3F3F5)] text-[var(--Gray-06,#ADAEB2)] text-[18px] font-normal leading-[160%] tracking-[-0.36px] "
        />
      </div>
      {/* 현재 비밀번호 */}
      <div className="grid grid-cols-3 items-center gap-4 ">
        <label htmlFor="current-pw" className="text-[var(--Gray-06,#ADAEB2)] font-['Pretendard Variable'] text-[18px] font-normal leading-[160%] tracking-[-0.36px]">현재 비밀번호</label>
        <input
          id="current-pw"
          type="password"
          placeholder="현재 비밀번호 입력"
          value={currentPw}
          onChange={e => setCurrentPw(e.target.value)}
          className="col-span-2 flex w-[416px] p-4 -ml-[89px] items-center gap-2 rounded-lg bg-[var(--Gray-03,#F3F3F5)] text-[var(--Gray-06,#ADAEB2)] text-[18px] font-normal leading-[160%] tracking-[-0.36px]"
        />
      </div>
      {/* 새 비밀번호 */}
      <div className="grid grid-cols-3 items-center gap-4 ">
        <label htmlFor="new-pw" className="text-[var(--Gray-06,#ADAEB2)] font-['Pretendard Variable'] text-[18px] font-normal leading-[160%] tracking-[-0.36px]">새 비밀번호</label>
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
      <div className="grid grid-cols-3 items-center gap-4">
        <label htmlFor="confirm-pw" className="text-[var(--Gray-06,#ADAEB2)] font-['Pretendard Variable'] text-[18px] font-normal leading-[160%] tracking-[-0.36px]">새 비밀번호 확인</label>
        <input
          id="confirm-pw"
          type="password"
          placeholder="새 비밀번호 확인"
          value={confirmPw}
          onChange={e => setConfirmPw(e.target.value)}
          className="col-span-2 flex w-[416px] p-4 -ml-[89px] items-center gap-2 rounded-lg bg-[var(--Gray-03,#F3F3F5)] text-[var(--Gray-06,#ADAEB2)] text-[18px] font-normal leading-[160%] tracking-[-0.36px]"
        />
      </div>
    </div>
    <div className="flex w-full justify-center space-x-[20px] mt-8">
      <button className="flex w-[160px] py-4 px-6 justify-center items-center gap-1.5 rounded-lg bg-[var(--Gray-08,#616264)] text-[var(--White,#FFF)] text-center font-['Pretendard Variable'] text-[16px] font-semibold leading-[130%] tracking-[-0.32px]">
        취소
      </button>
      <button
        disabled={!isValid}
        className={`flex w-[160px] py-4 px-6 justify-center items-center gap-1.5 rounded-lg ${
          isValid
            ? 'bg-[var(--Purple-04,#6849FE)] text-[var(--White,#FFF)]'
            : 'bg-[var(--Gray-03,#F3F3F5)] text-[var(--Gray-06,#ADAEB2)]'
        } text-[16px] font-semibold leading-[130%] tracking-[-0.32px]`}
        onClick={() => {/* 등록 로직 */}}
      >
        등록하기
      </button>
    </div>
  </>
);

export default InfoSection;