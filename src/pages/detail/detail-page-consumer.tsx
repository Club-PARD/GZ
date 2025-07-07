// pages/detail/detail-page-consumer.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Header from '@/components/home-header';
import Footer from '@/components/Footer';
import { BsArrowLeftCircleFill, BsArrowRightCircleFill } from 'react-icons/bs';
import styles from "../home/home.module.css";
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
    <div className="bg-white pt-[80px]">
      <Header />

      <main className="max-w-5xl mx-40 my-8 flex gap-8 ">
        {/* 좌측: 이미지 세로 나열 + 그 아래 영역 */}
        <section className="w-1/2 space-y-4">
          {/* 첫 번째 이미지 */}
          <div className="bg-[#F3F3F5] rounded-lg h-80 w-full">
            <Image
              src={images[0]}
              alt="첫 번째 이미지"
              width={500}
              height={320}
              style={{ 
                width: '100%',
                height: '100%',
                objectFit: "cover"
              }}
            />
          </div>

          {/* 채팅 전: 빈 공간 / 채팅 후: 정보 패널 */}
          {channelUrl && (
            <div className="space-y-2 bg-white rounded-lg border border-gray-200 p-4">
              <h2 className="text-xl font-bold text-[#232323]">1TB USB 빌려드려요</h2>
              <p className="text-sm text-[#232323]">대여 가격</p>
              <div className="p-4 rounded-lg">
                <p className="mt-1 text-lg font-semibold text-[#ADAEB2] mr-2">1시간 <span className="text-[#232323]">3000원</span></p>
                <p className="mt-1 text-lg font-semibold text-[#ADAEB2] mr-2">1일 <span className="text-[#232323]">10,000원</span></p>
                <div className="p-4 h-40 bg-[#F9F9FA] rounded-lg text-sm text-gray-700">
                용량 커서 문제 없어요. 생활 기스 살짝 있는 거 말고는 훼손된
                부분 딱히 없어요. 분실만 조심해주면 좋겠어요!
              </div>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg">
                <button
                  onClick={startChat}
                  className="px-4 py-2 bg-[#8769FF] text-white rounded-lg text-sm"
                >
                  대여 시작하기
                </button>
              </div>
            </div>
          )}

          {/* 나머지 이미지들 */}
          {images.slice(1).map((src: string, idx: number) => (
            <div key={idx} className="bg-[#F3F3F5] rounded-lg h-80 w-full">
              <Image
                src={src}
                alt={`image-${idx + 2}`}
                width={500}
                height={320}
                style={{ 
                  width: '100%',
                  height: '100%',
                  objectFit: "cover"
                }}
              />
            </div>
          ))}
        </section>

        {/* 우측: 상품 상세 정보 또는 채팅창 */}
        <section className="w-150 space-y-4 border border-gray-300 rounded-lg p-4 fixed right-40">
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
                <span className="font-medium text-[#232323]">{ownerId}</span>
              </div>

              {/* 제목·카테고리 */}
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-bold text-[#232323]">1TB USB 빌려드려요</h1>
               
              </div>
              <div className=" border-b border-gray-200">
              </div>

              {/* 대여 가격 */}
              <div className="flex gap-4">
                <p className="mt-1 text-lg font-semibold text-[#ADAEB2]">1시간</p> {/*Db값으로 변경 */}
                <p className="mt-1 text-lg font-semibold text-[#ADAEB2]">3000</p> {/*Db값으로 변경 */}
              </div>
              <div className="flex gap-4">
                <p className="mt-1 text-lg font-semibold text-[#ADAEB2]">1알</p>  {/*Db값으로 변경 */}
                <p className="mt-1 text-lg font-semibold text-[#ADAEB2]">10000</p> {/*Db값으로 변경 */}
              </div>

              <div className=" border-b border-gray-200 pt-[36px]">
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
    </div>
  );
}
