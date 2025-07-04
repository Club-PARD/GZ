// pages/detail/detail-page-consumer.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Header from '@/components/home-header';
import Footer from '@/components/Footer';
import { BsArrowLeftCircleFill, BsArrowRightCircleFill } from 'react-icons/bs';

import { initSendbird } from '@/lib/sendbird';
import ChatWindow from '@/components/chat-components/ChatWindow';

export default function DetailPageConsumer() {
  const router = useRouter();
  const [me, setMe] = useState<string>('');
  useEffect(() => {
    // 로그인 후 localStorage 에 저장된 내 ID 읽기
    const stored = localStorage.getItem('me') || '';
    setMe(stored);
  }, []);

  // 하드코딩된 물건 주인 ID
  const ownerId = 'user2';

  // 이미지 슬라이더 상태
  const images = [
    '/images/usb.jpg',
    '/images/bag.jpg',
    '/images/camera.jpg',
    '/images/camping.jpg',
    '/images/shoes.jpg',
  ];
  const [current, setCurrent] = useState(0);
  const lastIndex = images.length - 1;
  const prevSlide = () => setCurrent(v => (v === 0 ? lastIndex : v - 1));
  const nextSlide = () => setCurrent(v => (v === lastIndex ? 0 : v + 1));

  // 채팅 채널 URL 상태
  const [channelUrl, setChannelUrl] = useState<string>('');

  // 채팅 시작 로직
  const startChat = async () => {
    if (!me) {
      alert('로그인된 사용자가 없습니다.');
      return;
    }
    const sb = initSendbird(process.env.NEXT_PUBLIC_SENDBIRD_APP_ID!);
    await sb.connect(me);
    const ch = await sb.groupChannel.createChannel({
      invitedUserIds: [me, ownerId].sort(),
      isDistinct: true,
    });
    setChannelUrl(ch.url);
  };

  return (
    <>
      <Header />

      <main className="max-w-5xl mx-70 my-8 flex gap-12 mb-85 pb-32 ">
        {/* 좌측: 이미지 캐러셀 + 그 아래 영역 */}
        <section className="w-1/2 space-y-4">
          <div className="relative bg-[#F3F3F5] rounded-lg h-97 overflow-hidden">
            <Image
              src={images[current]}
              alt={`slide-${current}`}
              fill
              style={{ objectFit: 'cover' }}
              className="absolute inset-0"
            />

            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 z-10 transform -translate-y-1/2 rounded-full p-1 shadow"
            >
              <BsArrowLeftCircleFill color="white" size={24} />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 z-10 transform -translate-y-1/2 rounded-full p-1 shadow"
            >
              <BsArrowRightCircleFill color="white" size={24} />
            </button>

            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrent(idx)}
                  className={`w-2 h-2 rounded-full ${
                    idx === current ? 'bg-white' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* 채팅 전: 썸네일 4개 / 채팅 후: 정보 패널 */}
          {channelUrl ? (
            <div className="space-y-2 bg-white rounded-lg">
              <h2 className="text-xl font-bold">1TB USB 빌려드려요</h2>
              <p className="text-sm text-gray-500">대여 가격</p>
              <div className="p-4 bg-[#F9F9FA] rounded-lg">
                <p className="mt-1 text-lg font-semibold">3,000원 / 1시간</p>
                <p className="mt-1 text-lg font-semibold">10,000원 / 1일</p>
              </div>
              <div className="flex items-center justify-between bg-[#F3F0FF] p-4 rounded-lg">
                <span className="text-lg font-medium">보증금 10,000원</span>
                <button
                  onClick={startChat}
                  className="px-4 py-2 bg-[#8769FF] text-white rounded-lg text-sm"
                >
                  대여 시작하기
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-2">
              {images.slice(1).map((_, idx) => (
                <div
                  key={idx}
                  className="bg-[#F3F3F5] w-24 h-24 rounded-lg overflow-hidden"
                />
              ))}
            </div>
          )}
        </section>

        {/* 우측: 상품 상세 정보 또는 채팅창 */}
        <section className="w-1/2 space-y-4">
          {channelUrl ? (
            <div className="flex flex-col h-[600px]">
              <ChatWindow me={me} selectedChannelUrl={channelUrl} />
            </div>
          ) : (
            <>
              {/* 프로필 */}
              <div className="flex items-center space-x-1 mb-2">
                <img
                  src="/chat/chat-profile.svg"
                  alt="프로필"
                  className="w-8 h-8 rounded-full"
                />
                <span className="font-medium">{ownerId}</span>
              </div>

              {/* 제목·카테고리 */}
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-bold">1TB USB 빌려드려요</h1>
                <span className="px-2 py-1 bg-[#F2E8FF] text-[#6B46C1] text-xs rounded-full">
                  전자기기
                </span>
              </div>

              {/* 대여 가격 */}
              <div>
                <p className="text-sm text-gray-500">대여 가격</p>
                <p className="mt-1 text-lg font-semibold">3,000원 / 1시간</p>
                <p className="mt-1 text-lg font-semibold">10,000원 / 1일</p>
              </div>

              {/* 보증금 */}
              <div>
                <p className="text-sm text-gray-500">보증금</p>
                <p className="mt-1 text-lg font-semibold">10,000원</p>
              </div>

              {/* 설명 */}
              <div className="p-4 h-40 bg-[#F9F9FA] rounded-lg text-sm text-gray-700">
                용량 커서 문제 없어요. 생활 기스 살짝 있는 거 말고는 훼손된
                부분 딱히 없어요. 분실만 조심해주면 좋겠어요!
              </div>

              {/* 안내 문구 */}
              <p className="text-xs text-gray-500 text-center">
                물건의 주인과 대화를 시작합니다
              </p>

              {/* 채팅 시작 버튼 */}
              <button
                onClick={startChat}
                className="w-full flex items-center justify-center px-6 py-3 bg-[#8769FF] text-white rounded-lg text-sm"
              >
                채팅방 입장하기 <span className="ml-2">→</span>
              </button>
            </>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}
