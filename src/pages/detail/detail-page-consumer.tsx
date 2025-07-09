// pages/detail/detail-page-consumer.tsx
"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/router";
import Header from "@/components/home-header";
import Footer from "@/components/Footer";
import { initSendbird } from "@/lib/sendbird";
import ChatWindow from "@/components/chat-components/ChatWindow";
import Application from "@/components/Term-components/Applicaton";
import {
  FiMoreVertical,
  PiSirenBold,
  GoArrowRight,
  MdEdit,
  AiFillDelete,
} from "@/components/icons";
import styles from "../../styles/detail.module.css";

// API 응답 래퍼 타입
interface ApiResponse<T> {
  status: number;
  success: boolean;
  message: string;
  data: T;
}

// 상세페이지 데이터 타입 (Swagger 반영)
interface PostDetail {
  user_id: number;
  nickname: string; 
  itemName: string;
  post_id: number;
  imageUrls: string[];
  price_per_hour: number;
  price_per_day: number;
  description: string;
  category: string;
}

export default function DetailPageConsumer() {
  const router = useRouter();
  const { postId } = router.query;

  const [me, setMe] = useState<string>("");
  const [post, setPost] = useState<PostDetail | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showApplication, setApplication] = useState(false);
  const [channelUrl, setChannelUrl] = useState<string>("");

  const defaultImages = ["/images/camera.jpg"];

  // 1) 로그인된 사용자 ID 불러오기
  useEffect(() => {
    const stored = localStorage.getItem("me") || "";
    setMe(stored);
  }, []);

  // 2) 상세 데이터 불러오기
  useEffect(() => {
    if (!router.isReady || !postId) return;

    (async function fetchDetail() {
      try {
        const res = await axios.get<ApiResponse<PostDetail>>(
          "/api/post/detail",
          { params: { postId } }
        );
        if (!res.data.success) {
          setImages(defaultImages);
          return;
        }
        const data = res.data.data;
        setPost(data);
        setImages(data.imageUrls.length > 0 ? data.imageUrls : defaultImages);
      } catch {
        setImages(defaultImages);
      }
    })();
  }, [router.isReady, postId]);

  // 3) 채팅 시작 로직
  const startChat = async () => {
    if (!me) {
      alert("로그인된 사용자가 없습니다.");
      return;
    }
    try {
      const sb = initSendbird(process.env.NEXT_PUBLIC_SENDBIRD_APP_ID!);
      await sb.connect(me);
      const ch = await sb.groupChannel.createChannel({
        invitedUserIds: [me, String(post?.user_id)].sort(),
        isDistinct: true,
      });
      setChannelUrl(ch.url);
    } catch {
      alert("채팅 시작 중 오류가 발생했습니다.");
    }
  };

  // 4) 메뉴 토글
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  if (!post) {
    return (
      <div className="flex items-center justify-center h-screen">
        로딩 중...
      </div>
    );
  }

  return (
    <div className="bg-white pt-[80px]">
      <Header />

      <main className="max-w-5xl mx-40 my-8 flex gap-8">
        {/* 좌측: 이미지 리스트 */}
        <section className="w-1/2 space-y-4">
          {images.map((src, idx) => (
            <div key={idx} className={styles.imageContainer}>
              <Image
                src={src}
                alt={`image-${idx + 1}`}
                width={580}
                height={580}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                unoptimized
                onError={(e) => {
                  const img = e.currentTarget as HTMLImageElement;
                  img.src = defaultImages[0];
                }}
              />
            </div>
          ))}

          {/* 채팅 후 정보 패널 */}
          {channelUrl && (
            <div className="space-y-2 bg-white rounded-lg p-4">
              <h2 className="text-xl font-bold text-[#232323]">
                {post.description}
              </h2>
              <p className="text-sm text-[#232323]">대여 가격</p>
              <div className="p-4 rounded-lg">
                <div className="grid grid-cols-[max-content_auto] gap-x-4 gap-y-1">
                  <p className="text-lg font-semibold text-[#ADAEB2]">1시간</p>
                  <p className="text-lg font-semibold text-[#232323]">
                    {post.price_per_hour.toLocaleString()}원
                  </p>
                  <p className="text-lg font-semibold text-[#ADAEB2]">1일</p>
                  <p className="text-lg font-semibold text-[#232323]">
                    {post.price_per_day.toLocaleString()}원
                  </p>
                </div>
                <div className="mt-4 p-4 h-40 rounded-lg text-sm text-gray-700">
                  {post.description}
                </div>
              </div>
            </div>
          )}
        </section>

        {/* 우측: 상품 상세 정보 또는 채팅창 */}
        <section className="w-[560px] space-y-4 p-4 fixed right-20 bottom-70 top-[96px] bg-white rounded-lg shadow">
          {channelUrl ? (
            <div className="relative h-[600px]">
              <ChatWindow me={me} selectedChannelUrl={channelUrl} />
              <div className="absolute top-0 right-0 p-4">
                <button
                  onClick={() => setApplication(true)}
                  className="bg-[#8769FF] text-white px-4 py-2 rounded-lg text-sm"
                >
                  대여 시작하기
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* 프로필 & 닉네임 */}
              <div className="flex items-center space-x-2 mb-4">
                <Image
                  src="/chat/chat-profile.svg"
                  alt="프로필"
                  width={32}
                  height={32}
                  unoptimized
                />
                <span className="font-medium text-[#232323]">
                  {post.nickname}
                </span>
              </div>

              {/* 제목 & 옵션 버튼 */}
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-[#232323]">
                  {post.itemName}
                </h1>
                <div className="relative">
                  <button onClick={toggleMenu} className="p-2 rounded-full hover:bg-gray-100">
                    <FiMoreVertical size={20} />
                  </button>
                  {isMenuOpen && (
                    <ul className="absolute right-0 mt-2 bg-white shadow rounded-lg">
                      {me === String(post.user_id) ? (
                        <>
                          <li className="px-4 py-2 hover:bg-gray-100 flex items-center">
                            <MdEdit className="mr-2" /> 수정하기
                          </li>
                          <li className="px-4 py-2 hover:bg-gray-100 flex items-center">
                            <AiFillDelete className="mr-2" /> 삭제하기
                          </li>
                        </>
                      ) : (
                        <li className="px-4 py-2 hover:bg-gray-100 flex items-center">
                          <PiSirenBold className="mr-2" /> 신고하기
                        </li>
                      )}
                    </ul>
                  )}
                </div>
              </div>

              <div className="border-t border-gray-200 my-4" />

              {/* 가격 정보 */}
              <div className="grid grid-cols-[max-content_auto] gap-x-4 gap-y-2">
                <p className="text-lg font-semibold text-[#ADAEB2]">1시간</p>
                <p className="text-lg font-semibold text-[#232323]">
                  {post.price_per_hour.toLocaleString()}원
                </p>
                <p className="text-lg font-semibold text-[#ADAEB2]">1일</p>
                <p className="text-lg font-semibold text-[#232323]">
                  {post.price_per_day.toLocaleString()}원
                </p>
              </div>

              <div className="border-t border-gray-200 my-4" />

              {/* 설명 */}
              <div className="p-4 h-40 bg-[#F9F9FA] rounded-lg text-sm text-gray-700 overflow-auto">
                {post.description}
              </div>

              {/* 채팅방 입장 버튼 */}
              <button
                onClick={startChat}
                className="w-full mt-4 bg-[#6849FE] text-white py-3 rounded-lg text-sm font-semibold flex items-center justify-center"
              >
                채팅방 입장하기
                <GoArrowRight className="inline-block ml-2" />
              </button>
            </>
          )}
        </section>
      </main>

      <Application
        open={showApplication}
        onClose={() => setApplication(false)}
        userId={Number(me)}           // 로그인된 소비자 ID
        postId={post.post_id}         // 현재 보고 있는 게시물 ID
        itemName={post.description}
        pricePerDay={post.price_per_day}
        pricePerHour={post.price_per_hour}
      />

      <Footer />
    </div>
  );
}
