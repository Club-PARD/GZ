// components/profile/AccountSection.tsx
'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

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
      <h1 className="text-2xl font-semibold mb-6 border-b pb-4">계정관리</h1>

      {/* 로그아웃 */}
      <div className="flex items-center mb-8">
        <span className="font-medium">로그아웃</span>
        <button
          onClick={handleLogout}
          className="ml-4 px-4 py-2 border rounded-lg hover:bg-gray-100 transition"
        >
          로그아웃
        </button>
      </div>

      {/* 회원 탈퇴 안내 */}
      <div className="mb-4 p-4 bg-gray-100 rounded-md text-gray-700">
        <p className="font-medium mb-2">회원 탈퇴 안내</p>
        <ul className="list-disc list-inside space-y-1">
          <li>탈퇴 후에는 계정 정보, 개인정보, 저장된 데이터를 복구할 수 없습니다.</li>
          <li>일부 서비스는 탈퇴 후 일정 기간 재가입이 제한될 수 있습니다.</li>
          <li>탈퇴 전에 게시물, 댓글, 파일 등 데이터를 정리하시기 바랍니다.</li>
        </ul>
      </div>

      {/* 동의 체크박스 */}
      <label className="inline-flex items-center mb-6">
        <input
          type="checkbox"
          checked={agreeQuit}
          onChange={() => setAgreeQuit(prev => !prev)}
          className="form-checkbox h-5 w-5 text-purple-600"
        />
        <span className="ml-2 text-gray-700">
          탈퇴 시 위 안내 사항을 모두 확인하였으며, 동의합니다.
        </span>
      </label>

      {/* 버튼 그룹 */}
      <div className="flex gap-4">
        <a
          href="/home"
          className="px-6 py-2 bg-gray-600 text-white rounded-lg inline-block text-center"
        >
          홈으로 이동
        </a>
        <button
          onClick={handleQuit}
          disabled={!agreeQuit || isDeleting}
          className={`px-6 py-2 rounded-lg text-white ${
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
