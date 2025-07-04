// pages/detail/detail-page-producer.tsx
import React, { useState } from "react";
import Image from "next/image";
import Header from "@/components/home-header";
import Footer from "@/components/Footer";

export default function DetailPageProducer() {
  // public/images 폴더에 있는 이미지들 (테스트용)
  const images = [
    "/images/usb.jpg",
    "/images/bag.jpg",
    "/images/camera.jpg",
    "/images/camping.jpg",
    "/images/shoes.jpg",
  ];

  const [current, setCurrent] = useState(0);
  const lastIndex = images.length - 1;

  const prevSlide = () => setCurrent(current === 0 ? lastIndex : current - 1);
  const nextSlide = () => setCurrent(current === lastIndex ? 0 : current + 1);

  return (
    <>
      <Header />

      <main className="max-w-5xl mx-70 my-8 flex gap-12 mb-85 ">
        {/* 좌측: 이미지 캐러셀 */}
        <section className="w-1/2 space-y-4">
          <div className="relative bg-[#F3F3F5] rounded-lg h-97 overflow-hidden">
            <Image
              src={images[current]}
              alt={`slide-${current}`}
              fill
              style={{ objectFit: "cover" }}
              className="absolute inset-0"
            />

            {/* 이전/다음 버튼 */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 z-10 transform -translate-y-1/2 bg-white rounded-full p-2 shadow"
            >
              &lt;
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 z-10 transform -translate-y-1/2 bg-white rounded-full p-2 shadow"
            >
              &gt;
            </button>

            {/* 닷츠 네비게이션 */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrent(idx)}
                  className={`w-2 h-2 rounded-full ${
                    idx === current ? "bg-white" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* 썸네일(필요 시 주석 해제 후 경로 수정) */}
          <div className="grid grid-cols-4 gap-2">
            {images.slice(1).map((src, idx) => (
              <div
                key={idx}
                className="bg-[#F3F3F5] w-24 h-24 rounded-lg overflow-hidden relative"
              >
                {/* <Image
                  src={src}
                  alt={`thumb-${idx}`}
                  fill
                  style={{ objectFit: 'cover' }}
                  className="absolute inset-0"
                /> */}
              </div>
            ))}
          </div>
        </section>

        {/* 우측: 상품 상세 정보 */}
        <section className="w-1/2 space-y-6">
          {/* 프로필 */}
          <div className="flex items-center">
            <img
              src="/chat/chat-profile.svg"
              alt="프로필"
              className="w-8 h-8 rounded-full"
            />
            <span className="ml-2 font-medium">user2</span>
          </div>

          {/* 제목 · 카테고리 · 더보기 한 줄 */}
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold">1TB USB 빌려드려요</h1>
            <span className="px-2 py-1 bg-[#F2E8FF] text-[#6B46C1] text-xs rounded-full">
              전자기기
            </span>
            <span className="ml-auto cursor-pointer text-2xl leading-none">
              ⋮
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
          <div className="p-4 h-50 bg-[#F9F9FA] rounded-lg text-sm text-gray-700">
            용량 커서 문제 없어요. 생활 기스 살짝 있는 거 말고는 훼손된 부분
            딱히 없어요. 분실만 조심해주면 좋겠어요!
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
