import React from "react";
import Image from "next/image";
import Header from "@/components/home-header";
import Footer from "@/components/Footer";
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

// 판매자 뷰
export const ProducerView = ({ post }: { post: Post }) => {
    const categoryMap: Record<string, string> = {
        ELECTRONICS: "전자기기",
        HEALTH: "건강",
        INTEREST: "취미/여가",
        BEAUTYFASION: "뷰티/패션",
        ACADEMIC: "도서/학업",
        ESSENTIALS: "생활용품",
        ETC: "기타",
    };
    const defaultImages = ["/images/camera.jpg"];

    const images =
    post.imageUrls && post.imageUrls.length > 0
      ? post.imageUrls.map((url) => {
          // Data URL인 경우 프록시를 거치지 않고 직접 사용
          if (url.startsWith('data:')) {
            return url;
          }
          // 일반 URL인 경우 프록시 사용
          return `/api/image-proxy?url=${url}`;
        })
      : defaultImages;

    const nickname = post.nickname || "알 수 없음";
    const itemName = post.itemName || "제목 없음";
    const categoryLabel = categoryMap[post.category] || post.category;

    return (
        <div className="bg-white pt-[80px]">
        <Header />
  
        <main className="max-w-5xl mx-40 my-8 flex gap-8">
          <section className="w-1/2 space-y-4">
            {images.map((src, idx) => (
              <div key={idx} className={styles.imageContainer}>
                <Image
                  src={src}
                  alt={`image-${idx}`}
                  width={580}
                  height={580}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  unoptimized
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/images/camera.jpg";
                  }}
                />
              </div>
            ))}
          </section>
  
          <section className="w-[560px] h-[500px] space-y-4 border border-gray-300 rounded-lg p-4 fixed right-40 bottom-16 top-[113px]">
            <div className="flex items-center space-x-1 mb-2">
              <Image
                src="/chat/chat-profile.svg"
                alt="프로필"
                width={32}
                height={32}
                unoptimized
              />
              <span className="font-medium text-[#232323]">{nickname}</span>
            </div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold text-[#232323]">{itemName}</h1>
              <span className="px-2 py-1 bg-[#F2E8FF] text-[#6B46C1] text-xs rounded-full">
                {categoryLabel}
              </span>
            </div>
  
            <div className="border-b border-gray-200" />
  
            <div className="flex gap-4">
              <p className="mt-1 text-lg font-semibold text-[#ADAEB2] w-12">
                1시간
              </p>
              <p className="mt-1 text-lg font-semibold text-[#ADAEB2] w-20 text-right">
                {(post.price_per_hour || 0).toLocaleString()}원
              </p>
            </div>
            <div className="flex gap-4">
              <p className="mt-1 text-lg font-semibold text-[#ADAEB2] w-12">
                1일
              </p>
              <p className="mt-1 text-lg font-semibold text-[#ADAEB2] w-20 text-right">
                {(post.price_per_day || 0).toLocaleString()}원
              </p>
            </div>
  
            <div className="border-b border-gray-200 pt-[36px]" />
  
            <div className="p-4 h-40 bg-[#F9F9FA] rounded-lg text-sm text-gray-700 overflow-auto">
              {post.description || "설명이 없습니다."}
            </div>
          </section>
        </main>
  
        <Footer />
      </div>
    )
} 