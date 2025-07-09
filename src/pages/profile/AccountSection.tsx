// components/profile/AccountSection.tsx
import React from 'react';

const AccountSection: React.FC = () => (
  <>
    <h1 className="text-2xl font-semibold mb-6 border-b pb-4">계정관리</h1>
    <div className="flex items-center mb-8">
      <span className="font-medium">로그아웃</span>
      <button className="ml-4 px-4 py-2 border rounded-lg">로그아웃</button>
    </div>
    <div className="mb-4 p-4 bg-gray-100 rounded-md text-gray-700">
      <p className="font-medium mb-2">회원 탈퇴 안내</p>
      <ul className="list-disc list-inside space-y-1">
        <li>탈퇴 후에는 계정 정보, 개인정보, 저장된 데이터를 복구할 수 없습니다.</li>
        <li>일부 서비스는 탈퇴 후 일정 기간 재가입이 제한될 수 있습니다.</li>
        <li>탈퇴 전에 게시물, 댓글, 파일 등 데이터를 정리하시기 바랍니다.</li>
      </ul>
    </div>
    <label className="inline-flex items-center mb-6">
      <input type="checkbox" className="form-checkbox h-5 w-5 text-purple-600" />
      <span className="ml-2 text-gray-700">탈퇴 시 위 안내 사항을 모두 확인하였으며, 동의합니다.</span>
    </label>
    <div className="flex gap-4">
      
            <a
        href="/home"
        className="px-6 py-2 bg-gray-600 text-white rounded-lg inline-block text-center"
      >
        홈으로 이동
</a>
      <button className="px-6 py-2 bg-purple-600 text-white rounded-lg">탈퇴하기</button>
    </div>
  </>
);
export default AccountSection;