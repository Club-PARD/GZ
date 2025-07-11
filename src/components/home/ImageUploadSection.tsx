"use client";
import React, { useState } from "react";
import { BiSolidImage } from "@/components/icons";
import LoadingBalls from "@/components/loading-components/loding-ball";
import Image from "next/image";
import { compressImage } from "@/utils/imageCompression";

export type PreviewImage = {
  file: File;
  preview: string;
};

type Props = {
  images: PreviewImage[];
  setImages: React.Dispatch<React.SetStateAction<PreviewImage[]>>;
};

export default function ImageUploadSection({ images, setImages }: Props) {
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const newFiles = Array.from(e.target.files).slice(0, 5 - images.length);
    const processed: PreviewImage[] = [];

    for (const file of newFiles) {
      if (!file.type.startsWith("image/")) {
        alert(`"${file.name}"은 이미지 파일이 아닙니다.`);
        continue;
      }
      try {
        const compressed = await compressImage(file);
        const preview = URL.createObjectURL(compressed);
        processed.push({ file: compressed, preview });
      } catch {
        alert(`"${file.name}" 처리 중 오류가 발생했습니다.`);
      }
    }

    setImages((prev) => [...prev, ...processed]);
    e.target.value = "";
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(images[index].preview);
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <section className="w-1/2 space-y-4">
      <div className="relative bg-[#F3F3F5] rounded-lg h-97 overflow-hidden">
        {images[0] && (
          <>
            <Image
              src={images[0].preview}
              alt="main-upload"
              fill
              style={{ objectFit: "cover" }}
              className="absolute inset-0 z-0"
            />
            <button
              onClick={() => removeImage(0)}
              className="absolute top-2 right-2 bg-gray-300 text-black rounded-full p-1 z-20"
            >
              ✕
            </button>
          </>
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
            최대 5개까지 선택 가능 (자동 압축됨)
          </p>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {Array.from({ length: 4 }).map((_, idx) => {
          const img = images[idx + 1];
          return (
            <div
              key={idx}
              className="relative bg-[#F3F3F5] w-24 h-24 rounded-lg overflow-hidden"
            >
              {img ? (
                <>
                  <img
                    src={img.preview}
                    alt={`thumb-${idx}`}
                    className="absolute inset-0 object-cover w-full h-full"
                  />
                  <button
                    onClick={() => removeImage(idx + 1)}
                    className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full text-xs p-0.5"
                  >
                    ✕
                  </button>
                </>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
