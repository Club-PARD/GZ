// src/pages/cert/login.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/router';
import Header from '@/components/cert-header';
import { getSendbird } from '@/lib/sendbird';
import { requestFcmToken } from '@/lib/firebase';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!email.trim() || !password) {
      setIsLoading(false);
      return setError('아이디와 비밀번호를 모두 입력해 주세요.');
    }

    const sb = getSendbird();
    if (!sb) {
      setIsLoading(false);
      return setError('Sendbird가 초기화되지 않았습니다. 잠시 후 다시 시도해 주세요.');
    }

    try {
      // TODO: 추후 백엔드와 실제 로그인 로직 연동 필요
      const testUsers = ['user1', 'user2', 'user3'];
      if (!testUsers.includes(email.trim())) {
        setError('테스트용 아이디는 user1, user2, user3만 가능합니다.');
        setIsLoading(false);
        return;
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
      router.push('/home');

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
      <div className="min-h-screen bg-gray-50 flex flex-col items-center pt-16">
        <h1 className="text-3xl font-bold mb-6 text-black">로그인</h1>
        <form
          onSubmit={handleSubmit}
          noValidate
          className="w-full max-w-md bg-[#F5F5F5] p-8 rounded-2xl space-y-6"
        >
          {/* 아이디 */}
          <div>
            <label className="block mb-1 text-gray-700">아이디</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="학교 이메일을 입력해 주세요."
              className="w-full p-3 border border-gray-300 rounded-lg bg-white text-black placeholder-[#B3B3B3]"
            />
          </div>

          {/* 비밀번호 */}
          <div>
            <label className="block mb-1 text-gray-700">비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="비밀번호를 입력해 주세요."
              className="w-full p-3 border border-gray-300 rounded-lg bg-white text-black placeholder-[#B3B3B3]"
            />
            <p className="mt-1 text-sm text-gray-500">
              대/소문자, 특수기호 !&amp;$*5 ~~~
            </p>
          </div>

          {/* 오류 메시지 */}
          {error && <p className="text-red-600">{error}</p>}

          {/* 아이디/비밀번호 찾기 링크 */}
          <div className="flex justify-center space-x-2 text-sm text-gray-500">
            <a href="#" className="hover:underline">아이디 찾기</a>
            <span>|</span>
            <a href="#" className="hover:underline">비밀번호 찾기</a>
          </div>

          {/* 로그인 버튼 */}
          <button
            type="submit"
            className="w-full py-3 bg-black text-white rounded-lg disabled:opacity-50"
            disabled={!email.trim() || !password || isLoading}
          >
            {isLoading ? '로그인 중...' : '로그인'}
          </button>
        </form>
      </div>
    </main>
  );
}
