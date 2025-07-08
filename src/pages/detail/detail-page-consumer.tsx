// pages/detail/detail-page-consumer.tsx
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import Header from "@/components/home-header";
import Footer from "@/components/Footer";
import { BsArrowLeftCircleFill, BsArrowRightCircleFill } from "react-icons/bs";
import styles from "../../styles/detail.module.css";
import { initSendbird } from "@/lib/sendbird";
import ChatWindow from "@/components/chat-components/ChatWindow";
import {
  FiMoreVertical,
  PiSirenBold,
  GoArrowRight,
  MdEdit,
  AiFillDelete,
} from "@/components/icons";

export default function DetailPageConsumer() {
  const router = useRouter();
  const [me, setMe] = useState<string>("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // 로그인 후 localStorage에 저장된 내 ID 읽기
    const stored = localStorage.getItem("me") || "";
    setMe(stored);
  }, []);

  const ownerId = "owner_id"; // 임시로 하드코딩

  // 이미지 슬라이더 데이터
  const images = [
    "/images/usb.jpg",
    "/images/bag.jpg",
    "/images/camera.jpg",
    "/images/camping.jpg",
    "/images/shoes.jpg",
  ];

  // 채팅 채널 URL 상태
  const [channelUrl, setChannelUrl] = useState<string>("");

  // 채팅 시작 로직
  const startChat = async () => {
    if (!me) {
      alert("로그인된 사용자가 없습니다.");
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
        {/* 좌측: 이미지 리스트 */}
        <section className="w-1/2 space-y-4">
          {/* 첫 번째 이미지 */}
          <div className={styles.imageContainer}>
            <Image
              src={images[0]}
              alt="첫 번째 이미지"
              width={500}
              height={320}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>

          {/* 채팅 후 정보 패널 */}
          {channelUrl && (
            <div className="space-y-2 bg-white rounded-lg p-4">
              <h2 className="text-xl font-bold text-[#232323]">
                1TB USB 빌려드려요
              </h2>
              <p className="text-sm text-[#232323]">대여 가격</p>
              <div className="p-4 rounded-lg">
                <div className="grid grid-cols-[max-content_auto] gap-x-4 gap-y-1">
                  <p className="text-lg font-semibold text-[#ADAEB2]">1시간</p>
                  <p className="text-lg font-semibold text-[#232323]">
                    {Number(3000).toLocaleString()}원
                  </p>
                  <p className="text-lg font-semibold text-[#ADAEB2]">1일</p>
                  <p className="text-lg font-semibold text-[#232323]">
                    {Number(10000).toLocaleString()}원
                  </p>
                </div>
                <div className="mt-4 p-4 h-40 rounded-lg text-sm text-gray-700">
                  용량 커서 문제 없어요. 생활 기스 살짝 있는 거 말고는 훼손된
                  부분 딱히 없어요. 분실만 조심해주면 좋겠어요!
                </div>
              </div>
            </div>
          )}

          {/* 나머지 이미지들 */}
          {images.slice(1).map((src, idx) => (
            <div key={idx} className={styles.imageContainer}>
              <Image
                src={src}
                alt={`image-${idx + 2}`}
                width={580}
                height={580}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          ))}
        </section>

        {/* 우측: 상품 상세 정보 또는 채팅창 */}
        <section className="w-150 space-y-4 rounded-lg p-4 fixed right-20 bottom-70 top-[96px]">
          {channelUrl ? (
            <div className="relative h-[600px]">
              {/* ChatWindow가 배경 레이어를 채움 */}
              <div className="absolute inset-0">
                <ChatWindow me={me} selectedChannelUrl={channelUrl} />
              </div>

              {/* 버튼을 ChatWindow 헤더 오른쪽에 오버레이 */}
              <div className="absolute top-0 right-0 z-10 flex h-14 items-center pr-6">
                <button
                  onClick={() => {
                    // TODO: 대여 시작하기 로직
                    alert("대여 시작하기");
                  }}
                  className="px-4 py-2 bg-[#8769FF] text-white rounded-lg text-sm"
                >
                  대여 시작하기
                </button>
              </div>
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

              {/* 제목·카테고리 & 미트볼 버튼 */}
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-[#232323]">
                  1TB USB 빌려드려요
                </h1>
                <div className="relative">
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="p-2 rounded-full hover:bg-gray-100"
                  >
                    <FiMoreVertical size={20} color="#232323" />
                  </button>
                  {isMenuOpen && (
                    <div className="absolute right-0 mt-2 w-[127px] bg-white rounded-lg z-10">
                      <ul className="py-1">
                        {me === ownerId ? (
                          <>
                            <li>
                              <a
                                href="#"
                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                onClick={(e) => {
                                  e.preventDefault();
                                  console.log("수정하기 클릭");
                                  setIsMenuOpen(false);
                                }}
                              >
                                수정하기
                                <MdEdit className="ml-auto w-[24px] h-[24px] text-[#C2C3C9]" />
                              </a>
                            </li>
                            <li>
                              <a
                                href="#"
                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                onClick={(e) => {
                                  e.preventDefault();
                                  console.log("삭제하기 클릭");
                                  setIsMenuOpen(false);
                                }}
                              >
                                삭제하기
                                <AiFillDelete className="ml-auto w-[24px] h-[24px] text-[#C2C3C9]" />
                              </a>
                            </li>
                          </>
                        ) : (
                          <li>
                            <a
                              href="#"
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={(e) => {
                                e.preventDefault();
                                console.log("신고하기 클릭");
                                setIsMenuOpen(false);
                              }}
                            >
                              신고하기
                              <PiSirenBold className="ml-auto w-[24px] h-[24px]" />
                            </a>
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              <div className="border-b border-gray-200"></div>

              {/* 대여 가격 */}
              <div className="grid grid-cols-[max-content_auto] gap-x-4 gap-y-2 mt-1">
                <p className="text-lg font-semibold text-[#ADAEB2]">1시간</p>
                <p className="text-lg font-semibold text-[#232323]">
                  {Number(3000).toLocaleString()}원
                </p>
                <p className="text-lg font-semibold text-[#ADAEB2]">1일</p>
                <p className="text-lg font-semibold text-[#232323]">
                  {Number(10000).toLocaleString()}원
                </p>
              </div>

              <div className="border-b border-gray-200 pt-[36px]"></div>

              {/* 설명 */}
              <div className="p-4 h-40 rounded-lg text-sm text-gray-700">
                용량 커서 문제 없어요. 생활 기스 살짝 있는 거 말고는 훼손된 부분
                딱히 없어요. 분실만 조심해주면 좋겠어요!
              </div>

              {/* 채팅 시작 버튼 */}
              <div className="flex justify-center">
                <button
                  onClick={startChat}
                  className="w-[460px] h-[50px] px-6 py-3 bg-[#6849FE] text-white rounded-lg text-sm font-semibold flex items-center justify-center"
                >
                  <span className="mr-2">채팅방 입장하기</span>
                  <GoArrowRight className="w-[24px] h-[24px]" />
                </button>
              </div>
            </>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
