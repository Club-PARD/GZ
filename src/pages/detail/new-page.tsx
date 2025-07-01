// pages/detail/new-page.tsx
import React, { useState } from 'react'
import Image from 'next/image'
import Header from '@/components/home-header'
import Footer from '@/components/Footer'
import { BiSolidImage } from '@/components/icons'
import { AiFillWarning } from '@/components/icons'

const categories = [
  '전체', '전자기기', '건강', '취미/여가', '뷰티/패션', '도서/학업', '생활용품', '기타'
] as const

const NewPage: React.FC = () => {
  const [images, setImages] = useState<File[]>([])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    const files = Array.from(e.target.files).slice(0, 5)
    setImages(files)
  }

  return (
    <>
      <Header />

      <main className="max-w-5xl mx-70 my-8 flex gap-12 mb-85">
        {/* 좌측: 이미지 업로드 */}
        <section className="w-1/2">
          {/* 메인 업로드 박스 */}
          <div className="bg-[#F3F3F5] rounded-lg h-97 flex flex-col items-center justify-center relative">
            {/* 버튼 */}
            <label className="cursor-pointer inline-flex items-center bg-[#C2C3C9] rounded-md px-4 py-2">
              <BiSolidImage size={24} color="white" />
              <span className="ml-2 text-sm text-white">이미지 추가하기</span>
              <input
                type="file"
                accept="image/*"
                multiple
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleImageChange}
              />
            </label>

            {/* 버튼과는 별도 줄 */}
            <p className="mt-2 text-xs text-gray-500">최대 5개까지 선택 가능</p>
          </div>

          {/* 썸네일 박스 4개 */}
          <div className="mt-4 grid grid-cols-4 gap-2">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={idx}
                className="bg-[#F3F3F5] w-24 h-24 rounded-lg overflow-hidden flex items-center justify-center"
              >
                {images[idx] && (
                  <Image
                    src={URL.createObjectURL(images[idx])}
                    alt={`thumb-${idx}`}
                    width={64}
                    height={64}
                    objectFit="cover"
                  />
                )}
              </div>
            ))}
          </div>

          {/* 설명 영역 */}
          <div className="mt-4 p-4 bg-[#F9F9FA] rounded-lg text-sm text-gray-600 space-y-2">
            <p>
              꼼꼼하게 찍힌 사진은 대여 중 생길 수 있는 오해나 분쟁을 예방하고,
              문제 발생 시 대상을 정확히 파악하는 데 큰 도움이 됩니다.
            </p>
            <p>
              반대로, 물건 상태가 잘 보이지 않거나 누락된 부분이 있다면
              경우에 따라 책임이 사용자에게 돌아갈 수 있어요.
            </p>
            <p className="font-semibold">
              물건의 전체 모습, 사용 흔적이나 흠집이 있다면 그 부분도 함께!
              정확하고 안전한 대여를 위해, 사진은 최대한 꼼꼼하게 등록해 주세요 :)
            </p>
          </div>
        </section>

        {/* 우측: 기존 폼 */}
        <section className="w-1/2 space-y-6">
          {/* 제목 */}
          <div>
            <label className="block font-medium mb-2">
              제목 <span className="text-[#6B46C1]">*</span>
            </label>
            <input
              type="text"
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
                  placeholder="원하는 가격을 입력해 주세요"
                  className="flex-1 p-3 h-13 bg-[#F3F3F5] rounded-lg placeholder-gray-400 text-sm"
                />
                <span className="ml-2 text-sm text-gray-600">원 / 1시간</span>
              </div>
              <div className="flex items-center">
                <input
                  type="number"
                  placeholder="원하는 가격을 입력해 주세요"
                  className="flex-1 p-3 h-13 bg-[#F3F3F5] rounded-lg placeholder-gray-400 text-sm"
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
                placeholder="원하는 가격을 입력해 주세요"
                className="flex-1 p-3 h-13 bg-[#F3F3F5] rounded-lg placeholder-gray-400 text-sm"
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
              {categories.map(cat => (
                <button
                  key={cat}
                  type="button"
                  className="px-3 py-1 w-18 h-8 bg-[#F3F3F5] rounded-full text-[12px] text-gray-600"
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* 설명 */}
          <div>
            <label className="block font-medium mb-2">설명</label>
            <textarea
              placeholder="물건에 대한 자세한 설명, 주의사항 등을 자유롭게 작성해 주세요"
              className="w-full p-3 bg-[#F3F3F5] rounded-lg placeholder-gray-400 text-sm h-40 resize-none"
            />
          </div>

          {/* 주의사항 링크 & 등록 버튼 */}
          <div className="flex items-center justify-between mt-4">
            <button
              type="button"
              className="flex items-center px-9 py-2 h-11 min-w-[270px] bg-[#F2E8FF] rounded-lg text-sm text-[#6B46C1]"
            >
              <span className="mr-1"><AiFillWarning size={24} color="#6B46C1" /></span>물건 등록 전 주의사항 살펴보기
            </button>
            <button
              type="button"
              disabled
              className="px-6 py-2 w-32 h-11 bg-[#E5E5E5] rounded-lg text-sm text-gray-400 cursor-not-allowed"
            >
              등록하기
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}

export default NewPage
