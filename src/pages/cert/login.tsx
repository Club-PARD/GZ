// src/pages/cert/login.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Header from '@/components/cert-header';
import { getSendbird } from '@/lib/sendbird';
import { requestFcmToken } from '@/lib/firebase';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { FaSquareCheck } from 'react-icons/fa6';
import axios from 'axios';
import Link from 'next/link';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);

  // 저장된 자격증명 불러오기
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

  // 체크박스 토글
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
      // 1) 백엔드 로그인 요청
      const res = await axios.post('/api/auth/login', {
        studentMail: email.trim(),
        password,
      }, {
        withCredentials: true,
        validateStatus: () => true, // 모든 상태 코드를 성공으로 처리
      });

      // 2) 상태 코드 확인
      if (res.status !== 200) {
        console.log('HTTP 상태 코드:', res.status);
        console.log('오류 데이터:', res.data);
        
        switch (res.status) {
          case 401:
            setError('아이디 또는 비밀번호가 올바르지 않습니다.');
            break;
          case 404:
            setError('존재하지 않는 계정입니다.');
            break;
          case 400:
            setError(res.data?.message || '입력한 정보를 다시 확인해주세요.');
            break;
          case 500:
            setError('서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
            break;
          default:
            setError('로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
        }
        setIsLoading(false);
        return;
      }

      // 3) 로그인 성공 처리
      const json = res.data;
      const userId = String(json.data.userId);
      const nickname = json.data.nickname;
      localStorage.setItem('me', userId);

      if (json.data.token || json.token) {
        localStorage.setItem('authToken', json.data.token || json.token);
      }

      // 4) Sendbird 연결
      const sb = getSendbird();
      if (!sb) throw new Error('Sendbird가 초기화되지 않았습니다.');

      try {
        await sb.disconnect();
      } catch {
        // 무시
      }
      await sb.connect(userId);

      if (nickname) {
        try {
          await sb.updateCurrentUserInfo({ nickname });
        } catch {
          // 무시
        }
      }

      // 5) FCM 토큰 요청 및 Firestore 저장
      try {
        await requestFcmToken(async token => {
          if (token && sb.currentUser) {
            const db = getFirestore();
            await setDoc(doc(db, 'fcm_tokens', sb.currentUser.userId), {
              token,
              updatedAt: new Date(),
            });
            try {
              await sb.registerFCMPushTokenForCurrentUser(token);
            } catch {
              // 무시
            }
          }
        });
      } catch {
        // 무시
      }

      // 6) 자격증명 저장/삭제
      if (agreePrivacy) {
        localStorage.setItem(
          'savedCredentials',
          JSON.stringify({ email: email.trim(), password })
        );
      } else {
        localStorage.removeItem('savedCredentials');
      }

      // 7) 홈으로 이동
      router.replace('/home');
    } catch (error: unknown) {
      console.error('네트워크 오류:', error);
      setError('네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.');
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
          className="w-[580px] bg-[#FFFFFF] px-[80px] pt-[80px] pb-[60px] rounded-2xl"
        >
          {/* 이메일 */}
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
          {error && (
            <div className="w-[420px] mt-[20px] p-[12px] bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* 로그인 버튼 */}
          <button
            type="submit"
            className={`w-[420px] h-[53px] p-[16px] bg-[#6849FE] text-white rounded-lg transition hover:opacity-90 ${error ? 'mt-[20px]' : 'mt-[60px]'}`}
            disabled={!email.trim() || !password || isLoading}
          >
            {isLoading ? '로그인 중...' : '로그인'}
          </button>

          {/* 링크 */}
          <div className="flex justify-center space-x-2 text-sm text-[#ADAEB2] mt-[16px]">
            <Link href="#" className="hover:underline">아이디 찾기</Link>
            <span>|</span>
            <Link href="#" className="hover:underline">비밀번호 찾기</Link>
            <span>|</span>
            <Link href="/cert/cert" className="hover:underline">회원가입</Link>
          </div>
        </form>
      </div>
    </main>
  );
}
