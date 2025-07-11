// src/components/ConsumerView.tsx
import React, { useState } from "react";
import Image from "next/image";
import Header from "@/components/home-header";
import Footer from "@/components/Footer";
import { initSendbird } from "@/lib/sendbird";
import ChatWindow from "@/components/chat-components/ChatWindow";
import Application from "@/components/Term-components/Applicaton";
import {
  FiMoreVertical,
  PiSirenBold,
  GoArrowRight,
} from "@/components/icons";
import styles from "../../styles/detail.module.css";

// 공통 상세페이지 데이터 타입
interface Post {
  user_id: number;
  nickname: string;
  itemName: string;
  post_id: number;
  isBorrowable: "POSSIBLE" | "IMPOSSIBLE";
  imageUrls?: string[];
  price_per_hour?: number;
  price_per_day?: number;
  description: string;
  category: string;
}

// 소비자 뷰
export const ConsumerView = ({ post, me }: { post: Post; me: string }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showApplication, setApplication] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [channelUrl, setChannelUrl] = useState<string>("");

  const defaultImages = ["/images/camera.jpg"];
  const images =
    post.imageUrls && post.imageUrls.length > 0 ? post.imageUrls : defaultImages;

  const categories = [
    { id: "ELECTRONICS", name: "전자기기" },
    { id: "HEALTH", name: "건강" },
    { id: "INTEREST", name: "취미/여가" },
    { id: "BEAUTYFASION", name: "뷰티/패션" },
    { id: "ACADEMIC", name: "도서/학업" },
    { id: "ESSENTIALS", name: "생활용품" },
    { id: "ETC", name: "기타" },
  ];

  const startChat = async () => {
    if (!me) {
      alert("로그인된 사용자가 없습니다.");
      return;
    }
    try {
      const sb = initSendbird(process.env.NEXT_PUBLIC_SENDBIRD_APP_ID!);
      await sb.connect(me);
      const ch = await sb.groupChannel.createChannel({
        invitedUserIds: [me, String(post.user_id)].sort(),
        isDistinct: true,
      });
      setChannelUrl(ch.url);
    } catch {
      alert("채팅 시작 중 오류가 발생했습니다.");
    }
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  const handleReport = () => {
    setShowReportModal(true);
    setIsMenuOpen(false);
  };

  const submitReport = () => {
    alert("신고가 접수되었습니다. 검토 후 조치하겠습니다.");
    setShowReportModal(false);
  };

  return (
    <div className="bg-white pt-[80px]">
      <Header />

      <main className="max-w mx-40 my-8 flex gap-8">
        {/* 좌측 이미지 & 요약 */}
        <section className="w-1/2 space-y-4 mr-[64px]">
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

          {channelUrl && (
            <div className="space-y-2 bg-white rounded-lg p-4">
              <h2 className="text-xl font-bold text-[#232323]">
                {post.description}
              </h2>
              <p className="text-sm text-[#232323]">대여 가격</p>
              <div className="p-4 rounded-lg">
                <div className="grid grid-cols-[max-content_auto] gap-x-4 gap-y-1">
                  <p className="text-lg font-semibold text-[#ADAEB2]">1시간</p>
                  <p className="text-lg font-semibold text-[#232323] whitespace-nowrap">
                    {(post.price_per_hour || 0).toLocaleString()}원
                  </p>
                  <p className="text-lg font-semibold text-[#ADAEB2]">1일</p>
                  <p className="text-lg font-semibold text-[#232323] whitespace-nowrap">
                    {(post.price_per_day || 0).toLocaleString()}원
                  </p>
                </div>
                <div className="mt-4 p-4 h-40 rounded-lg text-sm text-gray-700">
                  {post.description}
                </div>
              </div>
            </div>
          )}
        </section>

        {/* 우측 채팅/상세 섹션: 높이 고정 제거, top/bottom 제약 */}
        <section
          className="
            w-[560px]
            fixed
            right-40
            top-[113px]
            bottom-[250px]
            overflow-y-auto
          "
        >
          {channelUrl ? (
            <div className="relative h-full w-full">
              <ChatWindow me={me} selectedChannelUrl={channelUrl} />
              <div className="absolute bottom-4 right-4">
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
              {/* 프로필 & 아이템명 */}
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

              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-[#232323]">
                  {post.itemName}
                </h1>
                <div className="relative">
                  <button
                    onClick={toggleMenu}
                    className="p-2 rounded-full hover:bg-gray-100"
                  >
                    <FiMoreVertical size={20} color="#374151" />
                  </button>
                  {isMenuOpen && (
                    <ul className="absolute right-0 mt-2 bg-white shadow rounded-lg z-10">
                      <li
                        className="px-4 py-2 hover:bg-gray-100 flex items-center cursor-pointer whitespace-nowrap text-black"
                        onClick={handleReport}
                      >
                        <PiSirenBold className="mr-2 text-[#6849FE]" /> 
                        신고하기
                      </li>
                    </ul>
                  )}
                </div>
              </div>

              <div className="border-t border-gray-200 my-4" />

              {/* 가격 정보 */}
              <div className="grid grid-cols-[max-content_auto] gap-x-4 gap-y-2">
                <p className="text-lg font-semibold text-[#ADAEB2]">1시간</p>
                <p className="text-lg font-semibold text-[#232323] whitespace-nowrap">
                  {(post.price_per_hour || 0).toLocaleString()}원
                </p>
                <p className="text-lg font-semibold text-[#ADAEB2]">1일</p>
                <p className="text-lg font-semibold text-[#232323] whitespace-nowrap">
                  {(post.price_per_day || 0).toLocaleString()}원
                </p>
              </div>

              <div className="border-t border-gray-200 my-4" />

              {/* 설명 */}
              <div className="p-4 h-40 bg-[#F9F9FA] rounded-lg text-sm text-gray-700 overflow-auto">
                {post.description}
              </div>

              <div className="border-t border-gray-200 my-4" />

              {/* 카테고리 & 대여가능 여부 */}
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-[#ADAEB2]">카테고리</p>
                <span className="inline-block px-2 py-1 bg-[#F3F3F5] text-[#828286] text-xs rounded">
                  {categories.find((c) => c.id === post.category)?.name ||
                    post.category}
                </span>
                <span className="inline-block px-2 py-1 bg-[#F0EDFF] text-[#6849FE] text-xs rounded">
                  {post.isBorrowable === "POSSIBLE"
                    ? "대여가능"
                    : "대여불가"}
                </span>
              </div>

              <button
                onClick={startChat}
                className="w-full mt-4 bg-[#6849FE] text-white py-3 rounded-lg text-sm font-semibold flex items-center justify-center"
              >
                채팅 시작하기 <GoArrowRight className="inline-block ml-2" />
              </button>
            </>
          )}
        </section>
      </main>

      {/* 신고하기 모달 */}
      {showReportModal && (
        <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50 text-black">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-4">게시물 신고</h2>
            <div className="space-y-3 mb-6">
              <label className="flex items-center">
                <input type="radio" name="report" className="mr-2 accent-[#6849FE]" />
                <span className="text-sm text-black">스팸/광고</span>
              </label>
              <label className="flex items-center">
                <input type="radio" name="report" className="mr-2 accent-[#6849FE]" />
                <span className="text-sm text-black">부적절한 내용</span>
              </label>
              <label className="flex items-center">
                <input type="radio" name="report" className="mr-2 accent-[#6849FE]" />
                <span className="text-sm text-black">사기/허위매물</span>
              </label>
              <label className="flex items-center">
                <input type="radio" name="report" className="mr-2 accent-[#6849FE]" />
                <span className="text-sm text-black">기타</span>
              </label>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowReportModal(false)}
                className="flex-1 py-2 px-4 bg-gray-200 text-gray-800 rounded-lg"
              >
                취소
              </button>
              <button
                onClick={submitReport}
                className="flex-1 py-2 px-4 bg-[#6849FE] text-white rounded-lg"
              >
                신고하기
              </button>
            </div>
          </div>
        </div>
      )}

      <Application
        open={showApplication}
        onClose={() => setApplication(false)}
        userId={Number(me)}
        postId={post.post_id}
        itemName={post.itemName}
        pricePerDay={post.price_per_day || 0}
        pricePerHour={post.price_per_hour || 0}
      />

      <Footer />
    </div>
  );
};
