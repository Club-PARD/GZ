// src/pages/cert/login.tsx
'use client';
//log
import { useState } from 'react';
import { useRouter } from 'next/router';
import Header from '@/components/cert-header';
import { getSendbird } from '@/lib/sendbird';
import { requestFcmToken } from '@/lib/firebase';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { FaSquareCheck } from "react-icons/fa6";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!email.trim() || !password) {
      setIsLoading(false);
      return setError('아이디와 비밀번호를 모두 입력해 주세요.');
    }

    try {
      // TODO: 추후 백엔드와 실제 로그인 로직 연동 필요
      const testUsers = ['user1', 'user2', 'user3'];
      if (!testUsers.includes(email.trim())) {
        setError('테스트용 아이디는 user1, user2, user3만 가능합니다.');
        setIsLoading(false);
        return;
      }

      const sb = getSendbird();
      if (!sb) {
        setIsLoading(false);
        return setError('Sendbird가 초기화되지 않았습니다. 잠시 후 다시 시도해 주세요.');
      }

      await sb.connect(email.trim());

      console.log('✅ Sendbird 연결 성공:', sb.currentUser);

      // 로그인 성공 후 FCM 토큰을 Firestore에 저장하는 로직
      try {
        await requestFcmToken(async (token) => {
          if (token && sb.currentUser) {
            try {
              // Firestore 인스턴스를 가져옵니다.
              const db = getFirestore();
              // 'fcm_tokens' 컬렉션에 사용자 ID를 문서 ID로 하여 토큰을 저장합니다.
              await setDoc(doc(db, 'fcm_tokens', sb.currentUser.userId), { token: token, updatedAt: new Date() });
              console.log('✅ Firestore에 FCM 토큰 저장 성공');

              // Sendbird에도 토큰을 등록합니다 (선택사항, 하지만 해두는 것이 좋습니다).
              sb.registerFCMPushTokenForCurrentUser(token)
                .then(() => console.log('Sendbird에 FCM 토큰 등록 성공'))
                .catch((err: any) => console.error('Sendbird FCM 토큰 등록 실패:', err));

            } catch (dbError) {
              console.error('Firestore 토큰 저장 실패:', dbError);
            }
          }
        });
      } catch (fcmError) {
        console.warn('FCM 토큰 요청 실패:', fcmError);
        // FCM 실패는 로그인 자체에는 영향을 주지 않음
      }

      localStorage.setItem('me', email.trim());
      console.log('✅ 로그인 성공, 메인 페이지로 이동');
      router.replace('/home');

    } catch (err: any) {
      console.error('Sendbird 연결 실패:', err);
      setError('로그인에 실패했습니다. 아이디를 확인해 주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main>
      <Header />
      <div className="min-h-screen bg-[#F3F3F5] flex flex-col items-center pt-[60px]">
        <h1 className="text-3xl font-bold mb-[28px] text-[#232323]">로그인</h1>
        <form
          onSubmit={handleSubmit}
          noValidate
          className="w-[580px] h-[461px] bg-[#FFFFFF] px-[80px] pt-[80px] pb-[60px] rounded-2xl"
        >
          {/* 아이디 */}
          <div>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="학교 메일"
              className="w-[420px] h-[53px] p-[16px] border border-[#F3F3F5] rounded-lg bg-[#F3F3F5] text-[#232323] placeholder-[#C2C3C9]"
            />
          </div>

          {/* 비밀번호 */}
          <div>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="비밀번호"
              className="w-[420px] h-[53px] p-[16px] border border-[#F3F3F5] rounded-lg bg-[#F3F3F5] text-[#232323] placeholder-[#C2C3C9] mt-[20px]"
            />
            <label
              className="flex items-center mt-[12px] ml-[4px] cursor-pointer"
              onClick={() => setAgreePrivacy(prev => !prev)}
            >
              {agreePrivacy
                ? <FaSquareCheck size={24} className="text-[#6849FE]" />
                : <span className="w-[24px] h-[24px]  border border-[#ADAEB2] rounded-[4px]" />
              }
              <span className="ml-[8px] text-[#232323]">로그인 상태 유지하기</span>
            </label>
          </div>

          {/* 오류 메시지 */}
          {error && <p className="text-red-600">{error}</p>}

          {/* 로그인 버튼 */}
          <button
            type="submit"
            className="w-[420px] h-[53px] p-[16px] bg-[#6849FE] text-white rounded-lg mt-[96px]"
            disabled={!email.trim() || !password || isLoading}
          >
            {isLoading ? '로그인 중...' : '로그인'}
          </button>

          {/* 아이디/비밀번호 찾기 링크 */}
          <div className="flex justify-center space-x-2 text-sm text-[#ADAEB2] mt-[16px]">
            <a href="#" className="hover:underline">아이디 찾기</a>
            <span>|</span>
            <a href="#" className="hover:underline">비밀번호 찾기</a>
            <span>|</span>
            <a href="#" className="hover:underline">회원가입</a>
          </div>


        </form>
      </div>
    </main>
  );
}
