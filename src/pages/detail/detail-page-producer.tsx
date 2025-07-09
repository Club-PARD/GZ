// pages/detail/detail-page-producer.tsx
'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';
import Header from '@/components/home-header';
import Footer from '@/components/Footer';
import LoadingBalls from '@/components/loading-components/loding-ball';
import styles from '../../styles/detail.module.css';

// 1. API 응답 래퍼 타입
interface ApiResponse<T> {
  status: number;
  success: boolean;
  message: string;
  data: T;
}

// 2. registeredItem 데이터 타입 (Swagger 응답에 맞춤)
interface RegisteredItem {
  user_id: number;
  post_id: number;
  imageUrls: string[];
  price_per_hour: number;
  price_per_day: number;
  description: string;
  category: string;
}

export default function DetailPageProducer() {
  const [registeredItem, setRegisteredItem] = useState<RegisteredItem | null>(null);
  const [loading, setLoading]                   = useState<boolean>(true);

  // 카테고리 한글 매핑
  const categoryMap: Record<string, string> = {
    ELECTRONICS:  '전자기기',
    HEALTH:       '건강',
    INTEREST:     '취미/여가',
    BEAUTYFASION: '뷰티/패션',
    ACADEMIC:     '도서/학업',
    ESSENTIALS:   '생활용품',
    ETC:          '기타',
  };

  // 기본 이미지
  const defaultImages = ['/images/camera.jpg'];

  useEffect(() => {
    const fetchPostData = async () => {
      setLoading(true);

      // 1) 로컬스토리지에서 postId 불러오기
      const raw = localStorage.getItem('registeredItem');
      if (!raw) {
        console.error('로컬스토리지에 registeredItem이 없습니다.');
        setLoading(false);
        return;
      }

      let parsed: any;
      try {
        parsed = JSON.parse(raw);
      } catch (e) {
        console.error('registeredItem 파싱 에러:', e);
        setLoading(false);
        return;
      }

      const postId = parsed.data?.postId;
      if (!postId) {
        console.error('postId를 찾을 수 없습니다.');
        setLoading(false);
        return;
      }

      const userIdRaw = localStorage.getItem('me');
      const userId    = userIdRaw ? parseInt(userIdRaw, 10) : undefined;

      try {
        console.log('🔄 상세 정보 요청:', { postId, userId });
        const res = await axios.get<ApiResponse<RegisteredItem>>(
          '/api/post/detail',
          { params: { postId, userId }, withCredentials: true }
        );

        if (res.data.success) {
          console.log('⚙️ imageUrls from API:', res.data.data.imageUrls);
          setRegisteredItem(res.data.data);
        } else {
          console.error('API 오류:', res.data.message);
        }
      } catch (err: any) {
        console.error('아이템 데이터 처리 중 에러 발생:', err);
        if (err.response) {
          console.error('에러 상태:', err.response.status);
          console.error('에러 데이터:', err.response.data);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPostData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <LoadingBalls />
        <p className="text-gray-600 mt-4">상품 정보를 불러오는 중입니다...</p>
      </div>
    );
  }

  if (!registeredItem) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">상품 정보를 불러올 수 없습니다.</p>
      </div>
    );
  }

  // 렌더링용 데이터 가공
  const images = (registeredItem.imageUrls && registeredItem.imageUrls.length > 0)
  ? registeredItem.imageUrls.map((src, index) => {
      console.log(`🔄 이미지 ${index + 1} 변환 시작:`, src);
      
      // 서버에서 받은 URL을 그대로 사용 (경로 변환 제거)
      let absoluteUrl = src;
      
      // 이미 절대 URL인 경우 그대로 사용
      if (src.startsWith('http')) {
        absoluteUrl = src;
        console.log(`🌐 절대 URL 그대로 사용: ${absoluteUrl}`);
      } else {
        // 상대 URL인 경우에만 gz-zigu.store 도메인 추가
        absoluteUrl = `https://gz-zigu.store${src.startsWith('/') ? src : `/${src}`}`;
        console.log(`🌐 상대 URL을 절대 URL로 변환: ${src} → ${absoluteUrl}`);
      }

      console.log(`🌐 최종 절대 URL: ${absoluteUrl}`);

      // 프록시 호출용으로 인코딩
      const proxyUrl = `/api/image-proxy?url=${encodeURIComponent(absoluteUrl)}`;
      console.log(`🔗 프록시 URL: ${proxyUrl}`);
      
      // 임시 테스트: 프록시 없이 직접 URL 사용
      // return absoluteUrl;  // 이 줄을 주석 해제하면 프록시 없이 직접 접근
      
      return proxyUrl;
    })
  : defaultImages;

  // imageUrls가 string[]이므로 첫 번째 이미지만 사용해서 post 정보 추출 불가
  // writerNickname, itemName 등은 registeredItem에서 직접 추출
  const writerNickname = '알 수 없음'; // post 정보가 없으므로 임시값
  const itemName       = registeredItem.description || '제목 없음';
  const categoryLabel  = categoryMap[registeredItem.category] || registeredItem.category;

  return (
    <div className="bg-white pt-[80px]">
      <Header />

      <main className="max-w-5xl mx-40 my-8 flex gap-8">
        {/* 왼쪽: 이미지 세로 나열 */}
        <section className="w-1/2 space-y-4">
          {images.map((src, idx) => (
            <div key={idx} className={styles.imageContainer}>
              <Image
                src={src}
                alt={`image-${idx}`}
                width={580}
                height={580}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                unoptimized
                onError={(e) => {
                  console.log(`❌ 이미지 로드 실패: ${src}`);
                  // 기본 이미지로 대체
                  const target = e.target as HTMLImageElement;
                  target.src = '/images/camera.jpg';
                  
                  // 이미지 로드 실패 시 사용자에게 알림
                  console.log('💡 이미지 로드 실패: 백엔드 인증 설정 문제로 추정됩니다.');
                  console.log('💡 해결 방안: 백엔드에서 이미지 접근 권한 설정 또는 별도 API 제공 필요');
                }}
              />
            </div>
          ))}
        </section>

        {/* 오른쪽: 상품 상세 */}
        <section
          className="w-[560px] h-[500px] space-y-4 border border-gray-300 rounded-lg p-4 fixed right-40 bottom-16 top-[113px]"
        >
          <div className="flex items-center space-x-1 mb-2">
            <Image
              src="/chat/chat-profile.svg"
              alt="프로필"
              width={32}
              height={32}
              unoptimized
            />
            <span className="font-medium text-[#232323]">{writerNickname}</span>
          </div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-[#232323]">{itemName}</h1>
            <span className="px-2 py-1 bg-[#F2E8FF] text-[#6B46C1] text-xs rounded-full">
              {categoryLabel}
            </span>
          </div>

          <div className="border-b border-gray-200" />

          <div className="flex gap-4">
            <p className="mt-1 text-lg font-semibold text-[#ADAEB2] w-12">1시간</p>
            <p className="mt-1 text-lg font-semibold text-[#ADAEB2] w-20 text-right">
              {registeredItem.price_per_hour}원
            </p>
          </div>
          <div className="flex gap-4">
            <p className="mt-1 text-lg font-semibold text-[#ADAEB2] w-12">1일</p>
            <p className="mt-1 text-lg font-semibold text-[#ADAEB2] w-20 text-right">
              {registeredItem.price_per_day}원
            </p>
          </div>

          <div className="border-b border-gray-200 pt-[36px]" />

          <div className="p-4 h-40 bg-[#F9F9FA] rounded-lg text-sm text-gray-700 overflow-auto">
            {registeredItem.description || '설명이 없습니다.'}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
