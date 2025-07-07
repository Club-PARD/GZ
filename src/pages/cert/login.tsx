// src/pages/cert/login.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Header from '@/components/cert-header';
import { getSendbird } from '@/lib/sendbird';
import { requestFcmToken } from '@/lib/firebase';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { FaSquareCheck } from 'react-icons/fa6';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);

  // ★ 페이지 로드 시 저장된 자격증명 불러오기
  useEffect(() => {
    const saved = localStorage.getItem('savedCredentials');
    if (saved) {
      try {
        const { email: e, password: p } = JSON.parse(saved);
        setEmail(e);
        setPassword(p);
        setAgreePrivacy(true);
      } catch {
        localStorage.removeItem('savedCredentials');
      }
    }
  }, []);

  // ★ 체크박스 핸들러: 해제 시 저장된 정보 삭제 및 입력칸 비우기
  const handleRememberToggle = () => {
    if (agreePrivacy) {
      localStorage.removeItem('savedCredentials');
      setEmail('');
      setPassword('');
    }
    setAgreePrivacy(prev => !prev);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!email.trim() || !password) {
      setIsLoading(false);
      return setError('아이디와 비밀번호를 모두 입력해 주세요.');
    }

    try {
      // 테스트용 로그인 로직
      const testUsers = ['user1', 'user2', 'user3'];
      if (!testUsers.includes(email.trim())) {
        setError('테스트용 아이디는 user1, user2, user3만 가능합니다.');
        setIsLoading(false);
        return;
      }

      // Sendbird 연결
      const sb = getSendbird();
      if (!sb) {
        throw new Error('Sendbird가 초기화되지 않았습니다.');
      }
      await sb.connect(email.trim());
      console.log('✅ Sendbird 연결 성공:', sb.currentUser);

      // FCM 토큰 요청 및 Firestore 저장
      try {
        await requestFcmToken(async token => {
          if (token && sb.currentUser) {
            const db = getFirestore();
            await setDoc(doc(db, 'fcm_tokens', sb.currentUser.userId), {
              token,
              updatedAt: new Date(),
            });
            console.log('✅ Firestore에 FCM 토큰 저장 성공');
            sb
              .registerFCMPushTokenForCurrentUser(token)
              .then(() => console.log('Sendbird에 FCM 토큰 등록 성공'))
              .catch(err => console.error('Sendbird FCM 토큰 등록 실패:', err));
          }
        });
      } catch (fcmError) {
        console.warn('FCM 토큰 요청 실패:', fcmError);
      }

      // ★ 로그인 성공 후: 체크 여부에 따라 저장 또는 삭제
      if (agreePrivacy) {
        localStorage.setItem(
          'savedCredentials',
          JSON.stringify({ email: email.trim(), password })
        );
      } else {
        localStorage.removeItem('savedCredentials');
      }

      localStorage.setItem('me', email.trim());
      console.log('✅ 로그인 성공, 메인 페이지로 이동');
      router.replace('/home');

    } catch (err: any) {
      console.error('로그인 에러:', err);
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
              onClick={handleRememberToggle}
            >
              {agreePrivacy ? (
                <FaSquareCheck size={24} className="text-[#6849FE]" />
              ) : (
                <span className="w-[24px] h-[24px] border border-[#ADAEB2] rounded-[4px]" />
              )}
              <span className="ml-[8px] text-[#232323]">로그인 상태 유지하기</span>
            </label>
          </div>

          {/* 오류 메시지 */}
          {error && <p className="text-red-600 mt-[12px]">{error}</p>}

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
