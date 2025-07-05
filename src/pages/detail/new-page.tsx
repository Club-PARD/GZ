import React, { useState } from "react"
import { useRouter } from "next/router"
import Image from "next/image"
import Header from "@/components/home-header"
import Footer from "@/components/Footer"
import { BiSolidImage } from "@/components/icons"
import { AiFillWarning } from "@/components/icons"
import LoadingBalls from "@/components/loading-components/loding-ball"
import axios from "axios"

const categories = [
  "전체",
  "전자기기",
  "건강",
  "취미/여가",
  "뷰티/패션",
  "도서/학업",
  "생활용품",
  "기타",
] as const

export default function NewPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [images, setImages] = useState<File[]>([])
  const [title, setTitle] = useState("")
  const [hourPrice, setHourPrice] = useState("")
  const [dayPrice, setDayPrice] = useState("")
  const [description, setDescription] = useState("")
  const [selectedCat, setSelectedCat] =
    useState<(typeof categories)[number]>("전체")
  const [showWarningList, setShowWarningList] = useState(false)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    const newFiles = Array.from(e.target.files).slice(0, 5 - images.length)
    setImages((prev) => [...prev, ...newFiles])
    e.target.value = ""
  }

  const isFormValid =
    images.length > 0 &&
    title.trim().length > 0 &&
    (hourPrice.trim().length > 0 || dayPrice.trim().length > 0) &&
    selectedCat !== "전체"

  const handleRegister = async () => {
    if (!isFormValid) return
    setIsLoading(true)

    try {
      const userId = "1"
      const categoryEnumMap: Record<string, string> = {
        전자기기: "ELECTRONICS",
        건강: "HEALTH",
        "취미/여가": "HOBBY",
        "뷰티/패션": "BEAUTY",
        "도서/학업": "STUDY",
        생활용품: "LIFE",
        기타: "ETC",
      }
      const categoryEnum = categoryEnumMap[selectedCat] || selectedCat

      const form = new FormData()
      form.append("userId", userId)
      form.append("isBorrowable", "POSSIBLE")
      form.append("itemName", title)
      form.append("pricePerHour", hourPrice || "0")
      form.append("pricePerDay", dayPrice || "0")
      form.append("category", categoryEnum)
      form.append("description", description)
      form.append(
        "caution",
        "안전한 사용을 위해 사용 전 상태를 확인해주세요"
      )
      images.forEach((file) => form.append("images", file))

      // FormData 내용 로그 출력
      console.log("보내는 데이터:")
      for (let [key, value] of form.entries()) {
        if (value instanceof File) {
          console.log(`${key}: File(${value.name}, ${value.size}bytes)`)
        } else {
          console.log(`${key}: ${value}`)
        }
      }

      const res = await axios.post("/api/post/create", form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      console.log("등록 성공 응답:", res.data)
      const data = res.data
      router.push(`/detail/${data.id}`)
    } catch (err) {
      console.error(err)
      alert("등록 중 오류가 발생했습니다.")
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <div className="flex space-x-2 mb-4">
          <LoadingBalls />
        </div>
        <p className="text-gray-600">물건을 등록 중이에요</p>
      </div>
    )
  }

  return (
    <div className="bg-white">
      <Header />
      <main className="max-w-5xl mx-auto my-8 flex gap-12 mb-85 bg-white px-8">
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
                <span className="ml-2 text-sm text-white">
                  이미지 추가하기
                </span>
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
              const file = images[idx + 1]
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
              )
            })}
          </div>
        </section>

        {/* 우측: 폼 */}
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
                  className="flex-none w-88 p-3 h-13 bg-[#F3F3F5] rounded-lg placeholder-gray-400 text-sm text-[#232323]"
                />
                <span className="ml-2 text-sm text-[#232323]">
                  원 / 1시간
                </span>
              </div>
              <div className="flex items-center">
                <input
                  type="text"
                  value={dayPrice}
                  onChange={(e) => setDayPrice(e.target.value)}
                  placeholder="원하는 가격을 입력해 주세요"
                  className="flex-none w-88 p-3 h-13 bg-[#F3F3F5] rounded-lg placeholder-gray-400 text-sm text-[#232323]"
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
                const isActive = cat === selectedCat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCat(cat)}
                    className={`px-4 py-2 rounded-full text-[12px] font-medium ${
                      isActive
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
            <label className="block font-medium mb-2 text-[#232323]">
              설명
            </label>
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
                className="flex items-center px-9 py-2 h-11 min-w-[270px] bg-[#F2E8FF] rounded-lg text-sm text-[#6B46C1]"
                onMouseEnter={() => setShowWarningList(true)}
                onMouseLeave={() => setShowWarningList(false)}
              >
                <AiFillWarning size={24} color="#6B46C1" className="mr-1" />
                물건 등록 전 주의사항 살펴보기
              </button>
              {showWarningList && (
                <div className="absolute top-full -left-50 mt-2 p-4 bg-[#F9F9FA] rounded-lg text-sm text-[#4C4C4E] shadow-lg z-10 w-[631px]">
                  <ul className="space-y-2 list-disc list-inside">
                    <li>허위 매물이나 과장 광고는 금지됩니다.</li>
                    <li>금지 품목(예: 불법 복제품, 유해 물질 등)은 등록할 수 없습니다.</li>
                    <li>상품 설명과 사진은 실제와 일치해야 하며, 꼼꼼하게 작성해야 합니다.</li>
                    <li>
                      직거래 시 안전한 장소를 선택하고 택배 거래 시에는
                      입금 확인 후 상품을 발송해야 합니다.
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
      </main>

      <Footer />
    </div>
  );
}
