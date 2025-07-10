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
  MdEdit,
  AiFillDelete,
} from "@/components/icons";
import styles from "../../styles/detail.module.css";

// 공통 상세페이지 데이터 타입
interface Post {
  user_id: number;
  nickname: string;
  itemName: string;
  post_id: number;
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
    const [channelUrl, setChannelUrl] = useState<string>("");
    
    const defaultImages = ["/images/camera.jpg"];
    const images = post.imageUrls && post.imageUrls.length > 0 ? post.imageUrls : defaultImages;
    
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
  
    const toggleMenu = () => {
      setIsMenuOpen(!isMenuOpen);
    };

    return (
        <div className="bg-white pt-[80px]">
        <Header />
  
        <main className="max-w-5xl mx-40 my-8 flex gap-8">
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
                      {(post.price_per_hour || 0).toLocaleString()}원
                    </p>
                    <p className="text-lg font-semibold text-[#ADAEB2]">1일</p>
                    <p className="text-lg font-semibold text-[#232323]">
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
  
                <div className="grid grid-cols-[max-content_auto] gap-x-4 gap-y-2">
                  <p className="text-lg font-semibold text-[#ADAEB2]">1시간</p>
                  <p className="text-lg font-semibold text-[#232323]">
                    {(post.price_per_hour || 0).toLocaleString()}원
                  </p>
                  <p className="text-lg font-semibold text-[#ADAEB2]">1일</p>
                  <p className="text-lg font-semibold text-[#232323]">
                    {(post.price_per_day || 0).toLocaleString()}원
                  </p>
                </div>
  
                <div className="border-t border-gray-200 my-4" />
  
                <div className="p-4 h-40 bg-[#F9F9FA] rounded-lg text-sm text-gray-700 overflow-auto">
                  {post.description}
                </div>
  
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
          userId={Number(me)}
          postId={post.post_id}
          itemName={post.description}
          pricePerDay={post.price_per_day || 0}
          pricePerHour={post.price_per_hour || 0}
        />
  
        <Footer />
      </div>
    );
} 