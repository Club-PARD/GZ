import React, { useState, useEffect } from "react"
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
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem('me');
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  // 강화된 이미지 압축 함수
  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = document.createElement('img');
      
      img.onload = () => {
        // 파일 크기에 따라 다른 압축 전략 적용
        let maxWidth, maxHeight, quality;
        
        if (file.size > 10 * 1024 * 1024) { // 10MB 이상
          maxWidth = 800;
          maxHeight = 800;
          quality = 0.4;
        } else if (file.size > 5 * 1024 * 1024) { // 5MB 이상
          maxWidth = 1200;
          maxHeight = 1200;
          quality = 0.5;
        } else if (file.size > 2 * 1024 * 1024) { // 2MB 이상
          maxWidth = 1600;
          maxHeight = 1600;
          quality = 0.6;
                 } else {
           // 2MB 이하는 가벼운 압축
           maxWidth = 1920;
           maxHeight = 1920;
           quality = 0.8;
         }
        
        let { width, height } = img;
        
        // 비율 유지하면서 크기 조정
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.floor(width * ratio);
          height = Math.floor(height * ratio);
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // 이미지 그리기
        ctx?.drawImage(img, 0, 0, width, height);
        
        // 압축된 이미지로 변환
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              
              // 압축 후에도 너무 크면 더 압축
              if (compressedFile.size > 3 * 1024 * 1024) { // 3MB 이상이면 더 압축
                canvas.toBlob(
                  (secondBlob) => {
                    if (secondBlob) {
                      const finalFile = new File([secondBlob], file.name, {
                        type: 'image/jpeg',
                        lastModified: Date.now(),
                      });
                      resolve(finalFile);
                    } else {
                      resolve(compressedFile);
                    }
                  },
                  'image/jpeg',
                  0.3 // 더 강한 압축
                );
              } else {
                resolve(compressedFile);
              }
            } else {
              resolve(file); // 압축 실패시 원본 반환
            }
          },
          'image/jpeg',
          quality
        );
      };
      
      img.onerror = () => reject(new Error('이미지 로드 실패'));
      img.src = URL.createObjectURL(file);
    });
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    
    const newFiles = Array.from(e.target.files).slice(0, 5 - images.length)
    const maxFileSize = 2 * 1024 * 1024; // 더 엄격하게 2MB로 제한
    const processedFiles: File[] = []
    
    for (const file of newFiles) {
      // 이미지 파일 타입 체크
      if (!file.type.startsWith('image/')) {
        alert(`"${file.name}"은 이미지 파일이 아닙니다.`)
        continue
      }
      
      try {
        console.log(`원본 파일 크기: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
        
        // 모든 파일을 압축 (작은 파일도)
        const processedFile = await compressImage(file);
        
        console.log(`압축 후 파일 크기: ${(processedFile.size / 1024 / 1024).toFixed(2)}MB`);
        
        // 압축 후에도 크면 경고
        if (processedFile.size > maxFileSize) {
          alert(`파일 "${file.name}"이 너무 큽니다. 압축 후에도 2MB를 초과합니다.`)
          continue
        }
        
        processedFiles.push(processedFile)
      } catch (error) {
        console.error('이미지 처리 실패:', error)
        alert(`파일 "${file.name}" 처리 중 오류가 발생했습니다.`)
      }
    }
    
    setImages((prev) => [...prev, ...processedFiles])
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

    if (!userId) {
      alert("로그인이 필요합니다.");
      setIsLoading(false);
      router.push('/cert/login');
      return;
    }

    try {
      const categoryEnumMap: Record<string, string> = {
        전자기기: "ELECTRONICS",
        건강: "HEALTH",
        "취미/여가": "INTEREST",
        "뷰티/패션": "BEAUTYFASION",
        "도서/학업": "ACADEMIC",
        생활용품: "ESSENTIALS",
        기타: "ETC",
      }
      const categoryEnum = categoryEnumMap[selectedCat] || selectedCat

      // multipart/form-data 방식으로 다시 시도
      const form = new FormData()
      form.append("isBorrowable", "POSSIBLE")
      form.append("itemName", title)
      form.append("pricePerHour", String(parseInt(hourPrice) || 0))
      form.append("pricePerDay", String(parseInt(dayPrice) || 0))
      form.append("category", categoryEnum)
      form.append("description", description)
      images.forEach((file) => form.append("images", file))

      // 프록시를 통해 백엔드로 multipart 요청 (userId를 query parameter로)
      const res = await axios.post(`/api/post/create?userId=${userId}`, form, {
        withCredentials: true,
        timeout: 120000, // 2분 timeout
        maxContentLength: 50 * 1024 * 1024, // 50MB
        maxBodyLength: 50 * 1024 * 1024, // 50MB
        headers: {
          // axios가 multipart boundary를 자동 설정하도록 Content-Type 헤더 생략
        }
      })

      // 등록 성공 시 detail-page-producer로 이동
      // 등록된 아이템 정보를 localStorage에 저장 (서버 응답 + 사용자 입력 데이터)
      // 이미지를 Data URL로 변환하여 저장
      const imageUrls = await Promise.all(
        images.map(async (file) => {
          return new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
              resolve(e.target?.result as string);
            };
            reader.readAsDataURL(file);
          });
        })
      );

      const itemDataForStorage = {
        ...res.data, // 서버 응답 (postId 포함)
        userInput: {
          itemName: title,
          description: description,
          price_per_hour: parseInt(hourPrice) || 0,
          price_per_day: parseInt(dayPrice) || 0,
          category: categoryEnum,
          images: images.map(file => ({ name: file.name, size: file.size }))
        },
        imageUrls: imageUrls // Data URL로 변환된 이미지들
      };
      
      localStorage.setItem('registeredItem', JSON.stringify(itemDataForStorage))
      
              // detail-page-producer로 라우팅
        router.push('/detail/detail-page-producer')
    } catch (err: any) {
      let errorMessage = "등록 중 오류가 발생했습니다."
      
      if (err.response) {
        const status = err.response.status;
        const data = err.response.data;
        
        if (status === 413) {
          errorMessage = "파일 크기가 너무 큽니다. 이미지 크기를 줄여서 다시 시도해주세요."
        } else if (status === 400) {
          errorMessage = "잘못된 요청입니다. 입력 정보를 확인해주세요."
        } else if (status === 401) {
          errorMessage = "로그인이 만료되었습니다. 다시 로그인해주세요."
          router.push('/cert/login');
        } else if (status === 500) {
          errorMessage = "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
        } else {
          errorMessage += `\n서버 응답: ${JSON.stringify(data)}`;
        }
      } else if (err.message) {
        errorMessage += `\n오류: ${err.message}`;
      }
      
      alert(errorMessage)
    } finally {
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
    <div className="bg-white pt-16">
      <Header />
      
      <main className="max-w-5xl mx-auto pt-20 flex gap-12 mb-85 bg-white px-8">
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
                최대 5개까지 선택 가능 (자동 압축됨)
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
                const isActive = cat === selectedCat
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
                )
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
  )
}

