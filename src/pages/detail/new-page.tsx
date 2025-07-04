// pages/detail/new-page.tsx
import React, { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Header from "@/components/home-header";
import Footer from "@/components/Footer";
import { BiSolidImage } from "@/components/icons";
import { AiFillWarning } from "@/components/icons";
import LoadingBalls from "@/components/loading-components/loding-ball";

const categories = [
  "전체",
  "전자기기",
  "건강",
  "취미/여가",
  "뷰티/패션",
  "도서/학업",
  "생활용품",
  "기타",
] as const;

export default function NewPage() {
  const router = useRouter();

  // ── 1) 로딩 상태 ─────────────────────────────────
  const [isLoading, setIsLoading] = useState(false);

  // ── 2) 이미지 업로드 ──────────────────────────────
  const [images, setImages] = useState<File[]>([]);
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const newFiles = Array.from(e.target.files);
    setImages((prev) => [...prev, ...newFiles].slice(0, 5));
    e.target.value = "";
  };

  // ── 3) 폼 상태 ───────────────────────────────────
  const [title, setTitle] = useState("");
  const [hourPrice, setHourPrice] = useState("");
  const [dayPrice, setDayPrice] = useState("");
  const [deposit, setDeposit] = useState("");
  const [selectedCat, setSelectedCat] =
    useState<(typeof categories)[number]>("전체");

  // ── 4) 유효성 검사 ────────────────────────────────
  const isFormValid =
    images.length > 0 &&
    title.trim().length > 0 &&
    deposit.trim().length > 0 &&
    (hourPrice.trim().length > 0 || dayPrice.trim().length > 0) &&
    selectedCat !== "전체";

  // ── 5) 등록 핸들러 ───────────────────────────────
  const handleRegister = () => {
    if (!isFormValid) return;
    setIsLoading(true); // 로딩 시작
    setTimeout(() => {
      router.push("/detail/detail-page-producer");
    }, 3000);
  };

  // ── 6) 로딩 스크린 ───────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <div className="flex space-x-2 mb-4">
          <LoadingBalls />
        </div>
        <p className="text-gray-600">물건을 등록 중이에요</p>
      </div>
    );
  }

  // ── 7) 실제 폼 렌더링 ─────────────────────────────
  return (
    <>
      <Header />

      <main className="max-w-5xl mx-70 my-8 flex gap-12 mb-85">
        {/* 좌측: 이미지 업로드 */}
        <section className="w-1/2 space-y-4">
          <div className="relative bg-[#F3F3F5] rounded-lg h-97 overflow-hidden">
            {images[0] && (
              <Image
                src={URL.createObjectURL(images[0])}
                alt="main-upload"
                fill
                style={{ objectFit: "cover" }}
                className="absolute inset-0 z-0"
              />
            )}
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center">
              <label className="inline-flex items-center bg-[#C2C3C9] rounded-md px-4 py-2 cursor-pointer">
                <BiSolidImage size={24} color="white" />
                <span className="ml-2 text-sm text-white">이미지 추가하기</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="absolute inset-0 w-full h-full opacity-0"
                  onChange={handleImageChange}
                />
              </label>
              <p className="mt-1 text-xs text-gray-500">
                최대 5개까지 선택 가능
              </p>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: 4 }).map((_, idx) => {
              const file = images[idx + 1];
              return (
                <div
                  key={idx}
                  className="bg-[#F3F3F5] w-24 h-24 rounded-lg overflow-hidden relative"
                >
                  {file && (
                    <Image
                      src={URL.createObjectURL(file)}
                      alt={`thumb-${idx + 1}`}
                      fill
                      style={{ objectFit: "cover" }}
                      className="absolute inset-0"
                    />
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-4 p-4 bg-[#F9F9FA] rounded-lg text-sm text-gray-600 space-y-2">
            <p>
              꼼꼼하게 찍힌 사진은 대여 중 생길 수 있는 오해나 분쟁을 예방하고,
              문제가 생겼을 때 상황을 정확히 파악하는 데 큰 도움이 됩니다.
            </p>
            <p>
              반대로, 물건 상태가 잘 보이지 않거나 누락된 부분이 있다면 경우에
              따라 책임이 사용자에게 돌아갈 수 있어요.
            </p>
            <p className="font-semibold">
              물건의 전체 모습, 사용 흔적이나 흠집이 있다면 그 부분도 함께!
              정확하고 안전한 대여를 위해, 사진은 최대한 꼼꼼하게 등록해 주세요
              :)
            </p>
          </div>
        </section>

        {/* 우측: 폼 */}
        <section className="w-1/2 space-y-6">
          {/* 제목 */}
          <div>
            <label className="block font-medium mb-2">
              제목 <span className="text-[#6B46C1]">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="충전기, 공구, 정장 등"
              className="w-full h-13 p-3 bg-[#F3F3F5] rounded-lg placeholder-gray-400 text-sm"
            />
          </div>

          {/* 대여 가격 */}
          <div>
            <label className="block font-medium mb-2">
              대여 가격 <span className="text-[#6B46C1]">*</span>
            </label>
            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  type="number"
                  value={hourPrice}
                  onChange={(e) => setHourPrice(e.target.value)}
                  placeholder="원하는 가격을 입력해 주세요"
                  className="flex-none w-88 p-3 h-13 bg-[#F3F3F5] rounded-lg placeholder-gray-400 text-sm"
                />
                <span className="ml-2 text-sm text-gray-600">원 / 1시간</span>
              </div>
              <div className="flex items-center">
                <input
                  type="number"
                  value={dayPrice}
                  onChange={(e) => setDayPrice(e.target.value)}
                  placeholder="원하는 가격을 입력해 주세요"
                  className="flex-none w-88 p-3 h-13 bg-[#F3F3F5] rounded-lg placeholder-gray-400 text-sm"
                />
                <span className="ml-2 text-sm text-gray-600">원 / 1일</span>
              </div>
            </div>
          </div>

          {/* 보증금 */}
          <div>
            <label className="block font-medium mb-2">
              보증금 <span className="text-[#6B46C1]">*</span>
            </label>
            <div className="flex items-center">
              <input
                type="number"
                value={deposit}
                onChange={(e) => setDeposit(e.target.value)}
                placeholder="원하는 가격을 입력해 주세요"
                className="flex-none w-88 p-3 h-13 bg-[#F3F3F5] rounded-lg placeholder-gray-400 text-sm"
              />
              <span className="ml-2 text-sm text-gray-600">원</span>
            </div>
          </div>

          {/* 카테고리 */}
          <div>
            <label className="block font-medium mb-2">
              카테고리 <span className="text-[#6B46C1]">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => {
                const isActive = cat === selectedCat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCat(cat)}
                    className={`px-4 py-2 rounded-full text-[12px] font-medium ${
                      isActive
                        ? "bg-[#8769FF] text-white"
                        : "bg-[#F3F3F5] text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 설명 */}
          <div>
            <label className="block font-medium mb-2">설명</label>
            <textarea
              placeholder="물건에 대한 자세한 설명…"
              className="w-full p-3 bg-[#F3F3F5] rounded-lg placeholder-gray-400 text-sm h-40 resize-none"
            />
          </div>

          {/* 버튼 그룹 */}
          <div className="flex items-center justify-between mt-4">
            <button
              type="button"
              className="flex items-center px-9 py-2 h-11 min-w-[270px] bg-[#F2E8FF] rounded-lg text-sm text-[#6B46C1]"
            >
              <AiFillWarning size={24} color="#6B46C1" className="mr-1" />
              물건 등록 전 주의사항 살펴보기
            </button>
            <button
              type="button"
              disabled={!isFormValid}
              onClick={handleRegister}
              className={`px-6 py-2 w-32 h-11 rounded-lg text-sm ${
                isFormValid
                  ? "bg-[#8769FF] text-white cursor-pointer"
                  : "bg-[#E5E5E5] text-gray-400 cursor-not-allowed"
              }`}
            >
              등록하기
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
