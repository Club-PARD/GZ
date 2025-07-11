// src/components/NewPage/FormSection.tsx
"use client";
import React, { useState } from "react";
import { useRouter } from "next/router";
import { AiFillWarning } from "@/components/icons";
import LoadingBalls from "@/components/loading-components/loding-ball";
import axios from "axios";
import { PreviewImage } from "./ImageUploadSection";
import { useUserId } from "@/hooks/useUserId";

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

type Props = {
  images: PreviewImage[];
};

export default function FormSection({ images }: Props) {
  const router = useRouter();
  const userId = useUserId();
  const [title, setTitle] = useState("");
  const [hourPrice, setHourPrice] = useState("");
  const [dayPrice, setDayPrice] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCat, setSelectedCat] =
    useState<(typeof categories)[number]>("전체");
  const [showWarningList, setShowWarningList] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isFormValid =
    images.length > 0 &&
    title.trim() !== "" &&
    (hourPrice.trim() !== "" || dayPrice.trim() !== "") &&
    selectedCat !== "전체";

  const handleRegister = async () => {
    if (!isFormValid) return;
    setIsLoading(true);
    if (!userId) {
      alert("로그인이 필요합니다.");
      setIsLoading(false);
      router.replace("/cert/login");
      return;
    }

    try {
      const map: Record<string, string> = {
        전자기기: "ELECTRONICS",
        건강: "HEALTH",
        "취미/여가": "INTEREST",
        "뷰티/패션": "BEAUTYFASION",
        "도서/학업": "ACADEMIC",
        생활용품: "ESSENTIALS",
        기타: "ETC",
      };
      const categoryEnum = map[selectedCat] || selectedCat;

      const formData = new FormData();
      formData.append("isBorrowable", "POSSIBLE");
      formData.append("itemName", title);
      formData.append("pricePerHour", String(parseInt(hourPrice) || 0));
      formData.append("pricePerDay", String(parseInt(dayPrice) || 0));
      formData.append("category", categoryEnum);
      formData.append("description", description);
      images.forEach((img) => formData.append("images", img.file));

      const res = await axios.post(
        `/api/post/create?userId=${userId}`,
        formData,
        {
          withCredentials: true,
          timeout: 120000,
          maxContentLength: 50 * 1024 * 1024,
          maxBodyLength: 50 * 1024 * 1024,
        }
      );

      // 로컬스토리지에 저장
      const imageUrls = await Promise.all(
        images.map(
          (img) =>
            new Promise<string>((resolve) => {
              const reader = new FileReader();
              reader.onload = (e) => resolve(e.target?.result as string);
              reader.readAsDataURL(img.file);
            })
        )
      );
      const storageData = {
        ...res.data,
        userInput: {
          itemName: title,
          description,
          price_per_hour: parseInt(hourPrice) || 0,
          price_per_day: parseInt(dayPrice) || 0,
          category: categoryEnum,
          images: images.map((i) => ({
            name: i.file.name,
            size: i.file.size,
          })),
        },
        imageUrls,
      };
      localStorage.setItem("registeredItem", JSON.stringify(storageData));
      router.replace("/detail/detail-page-producer");
    } catch (err) {
      console.error(err);
      alert("대여 신청 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <LoadingBalls />
        <p className="text-gray-600 mt-4">물건을 등록 중이에요</p>
      </div>
    );
  }

  return (
    <section className="w-1/2 space-y-6">
      {/* 제목 */}
      <div>
        <label className="block font-medium mb-2 text-[#232323]">
          제목 <span className="text-[#6B46C1]">*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="충전기, 공구, 정장 등"
          className="w-full h-13 p-3 bg-[#F3F3F5] rounded-lg placeholder-gray-400 text-sm text-[#232323]"
        />
      </div>

      {/* 대여 가격 */}
      <div>
        <label className="block font-medium mb-2 text-[#232323]">
          대여 가격 <span className="text-[#6B46C1]">*</span>
        </label>
        <div className="space-y-2">
          <div className="flex items-center">
            <input
              type="text"
              value={hourPrice}
              onChange={(e) => setHourPrice(e.target.value)}
              placeholder="원하는 가격을 입력해 주세요"
              className="w-88 p-3 h-13 bg-[#F3F3F5] rounded-lg placeholder-gray-400 text-sm text-[#232323]"
            />
            <span className="ml-2 text-sm text-[#232323]">원 / 1시간</span>
          </div>
          <div className="flex items-center">
            <input
              type="text"
              value={dayPrice}
              onChange={(e) => setDayPrice(e.target.value)}
              placeholder="원하는 가격을 입력해 주세요"
              className="w-88 p-3 h-13 bg-[#F3F3F5] rounded-lg placeholder-gray-400 text-sm text-[#232323]"
            />
            <span className="ml-2 text-sm text-[#232323]">원 / 1일</span>
          </div>
        </div>
      </div>

      {/* 카테고리 */}
      <div>
        <label className="block font-medium mb-2 text-[#232323]">
          카테고리 <span className="text-[#6B46C1]">*</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => {
            const active = cat === selectedCat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCat(cat)}
                className={`px-4 py-2 rounded-full text-[12px] font-medium ${
                  active
                    ? "bg-[#8769FF] text-white"
                    : "bg-[#F3F3F5] text-[#ADAEB2] hover:bg-gray-200"
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
        <label className="block font-medium mb-2 text-[#232323]">설명</label>
        <div className="relative">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="물건에 대한 자세한 설명…"
            className="w-full p-3 bg-[#F3F3F5] rounded-lg placeholder-gray-400 text-sm h-40 resize-none text-[#232323]"
            maxLength={200}
          />
          <div className="absolute bottom-2 right-2 text-xs text-gray-400">
            {description.length}/200
          </div>
        </div>
      </div>

      {/* 버튼 그룹 */}
      <div className="flex items-center justify-between mt-4">
        <div className="relative">
          <button
            type="button"
            className="flex items-center px-9 py-2 h-11 bg-[#F2E8FF] rounded-lg text-sm text-[#6B46C1]"
            onMouseEnter={() => setShowWarningList(true)}
            onMouseLeave={() => setShowWarningList(false)}
          >
            <AiFillWarning size={24} color="#6B46C1" className="mr-1" />
            물건 등록 전 주의사항 살펴보기
          </button>
          {showWarningList && (
            <div className="absolute top-full mt-2 p-4 bg-[#F9F9FA] rounded-lg text-sm text-[#4C4C4E] shadow-lg z-10 w-[631px]">
              <ul className="space-y-2 list-disc list-inside">
                <li>허위 매물이나 과장 광고는 금지됩니다.</li>
                <li>
                  금지 품목(예: 불법 복제품, 유해 물질 등)은 등록할 수 없습니다.
                </li>
                <li>
                  상품 설명과 사진은 실제와 일치해야 하며, 꼼꼼하게 작성해야
                  합니다.
                </li>
                <li>
                  직거래 시 안전한 장소를 선택하고 택배 거래 시에는 입금 확인 후
                  상품을 발송해야 합니다.
                </li>
              </ul>
            </div>
          )}
        </div>
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
  );
}
