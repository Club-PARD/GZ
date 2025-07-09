// src/pages/index.tsx
"use client";

import Header from "@/components/home-header";
import Footer from "@/components/Footer";
import { IoSearchOutline } from "@/components/icons";
import { IoLocationSharp } from "react-icons/io5";
import styles from "./home.module.css";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { getHomeData } from "@/lib/api";

// 여러 경로를 시도하는 이미지 컴포넌트
function ImageWithFallback({
  imagePath,
  alt,
  className,
}: {
  imagePath: string;
  alt: string;
  className: string;
}) {
  const [currentSrc, setCurrentSrc] = useState<string>("");
  const [attemptIndex, setAttemptIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);

  // 시도할 경로들
  const possiblePaths = [
    `https://gz-zigu.store/${imagePath}`,
    `https://gz-zigu.store/files/${imagePath}`,
    `https://gz-zigu.store/uploads/${imagePath}`,
    `https://gz-zigu.store/api/files/${imagePath}`,
  ];

  useEffect(() => {
    if (attemptIndex < possiblePaths.length) {
      setCurrentSrc(possiblePaths[attemptIndex]);
      setIsLoading(true);
      setHasError(false);
    } else {
      setHasError(true);
      setIsLoading(false);
    }
  }, [attemptIndex, imagePath]);

  const handleError = () => {
    console.log(
      `❌ 이미지 로드 실패 (${attemptIndex + 1}/${possiblePaths.length}):`,
      possiblePaths[attemptIndex]
    );
    setAttemptIndex((prev) => prev + 1);
  };

  const handleLoad = () => {
    console.log(`✅ 이미지 로드 성공:`, possiblePaths[attemptIndex]);
    setIsLoading(false);
    setHasError(false);
  };

  if (hasError || attemptIndex >= possiblePaths.length) {
    return (
      <div
        className={`${className} bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300`}
      >
        <div className="text-center">
          <div className="text-gray-400 text-2xl mb-1">📷</div>
          <span className="text-gray-500 text-xs">이미지 로드 실패</span>
        </div>
      </div>
    );
  }

  return (
    <>
      {isLoading && (
        <div
          className={`${className} bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300`}
        >
          <div className="text-center">
            <div className="text-gray-400 text-2xl mb-1">⏳</div>
            <span className="text-gray-500 text-xs">로딩 중...</span>
          </div>
        </div>
      )}
      <img
        src={currentSrc}
        alt={alt}
        className={className}
        style={{ display: isLoading ? "none" : "block" }}
        onLoad={handleLoad}
        onError={handleError}
      />
    </>
  );
}

// API 응답 타입 정의
interface HomeResponse {
  status: number;
  success: boolean;
  message: string;
  data: {
    userId: number;
    schoolName: string;
    posts: HomePost[];
  };
}

interface HomePost {
  post_id: number;
  firstImageUrl?: string | null; // 백엔드에서 오는 실제 필드명
  itemName: string;
  category: string;
  price_per_hour: number;
  price_per_day: number;
}

export default function Home() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [posts, setPosts] = useState<HomePost[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [me, setMe] = useState<string>("");

  const categories = [
    { id: "all", name: "전체" },
    { id: "ELECTRONICS", name: "전자기기" },
    { id: "HEALTH", name: "건강" },
    { id: "INTEREST", name: "취미/여가" },
    { id: "BEAUTYFASION", name: "뷰티/패션" },
    { id: "ACADEMIC", name: "도서/학업" },
    { id: "ESSENTIALS", name: "생활용품" },
    { id: "ETC", name: "기타" },
  ];

  // 로그인 상태 확인
  useEffect(() => {
    const stored =
      typeof window !== "undefined" ? localStorage.getItem("me") : null;
    if (!stored) {
      console.log("로그인되지 않은 사용자, 로그인 페이지로 이동");
      router.replace("/cert/login");
      return;
    }
    setMe(stored);
  }, [router]);

  useEffect(() => {
    const fetchHome = async () => {
      // 로그인된 사용자만 API 호출
      if (!me) {
        setIsLoading(false);
        return;
      }

      try {
        // api.ts의 getHomeData 함수 사용
        console.log("🔄 홈 요청 시작");
        const json: HomeResponse = await getHomeData();
        console.log("✅ 홈 요청 성공:", json);

        if (json.success) {
          // 이미지 URL 정보를 자세히 로그
          console.log("🖼️ 이미지 URL 정보:");
          json.data.posts.forEach((post: any, index: number) => {
            console.log(`포스트 ${index + 1}:`, {
              postId: post.post_id,
              firstImageUrl: post.firstImageUrl,
              itemName: post.itemName,
            });
          });

          setPosts(json.data.posts);
        } else {
          console.error("❌ 홈 API 오류:", json.message);
        }
      } catch (err: any) {
        console.error("❌ 홈 요청 실패:", err.response?.status || err.message);
        console.error("홈 데이터 로드 실패:", err);

        // 401/403 에러인 경우 로그인 페이지로 리다이렉트
        if (err.response?.status === 401 || err.response?.status === 403) {
          console.log("🔄 인증 실패로 인한 로그인 페이지 리다이렉트");
          localStorage.removeItem("me");
          localStorage.removeItem("savedCredentials"); // 저장된 자격증명도 제거
          router.replace("/cert/login");
          return;
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchHome();
  }, [me]);

  // 로딩 중 UI
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">홈 데이터를 불러오는 중...</p>
      </div>
    );
  }

  // 선택된 카테고리에 맞춘 필터링
  const filtered = posts.filter((post) =>
    selectedCategory === "all" ? true : post.category === selectedCategory
  );

  return (
    <main className="min-h-screen w-full flex flex-col relative bg-white pt-16">
      <Header />

      {/* 히어로 섹션 */}
      <div
        className="w-full flex flex-col items-center justify-center h-[351px]"
        style={{
          backgroundImage: "url(/images/main.svg)",
          backgroundSize: "contain",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundColor: "#6849FE",
        }}
      >
        <div className="flex flex-col items-center gap-8">
          <h1 className="text-[36px] font-bold text-white text-center">
            필요할때마다 사지말고, 지구에서 잠깐 빌려요
          </h1>
          <div className="w-[780px] h-[68px] relative">
            <input
              className="w-full h-full bg-[#F3F3F5] pl-14 pr-6 text-lg rounded-full border text-black
               border-gray-300 focus:outline-none focus:border-[#8769FF] focus:ring-1 focus:ring-[#8769FF]"
              type="text"
              placeholder="지금 어떤 물건을 구매하고 있나요?"
            />
            <div className="absolute left-5 top-1/2 -translate-y-1/2 tetx-black">
              <IoSearchOutline size={24} color="#A2A3A7" />
            </div>
          </div>
        </div>
      </div>

      {/* 목록 헤더 */}
      <div className="flex flex-col items-center gap-8 pt-[20px]">
        <div className="flex items-center gap-2 mt-[50px] pl-[210px] self-start">
          <IoLocationSharp size={24} color="black" />
          <div className="text-[22px] font-bold text-black">
            한동대학교 학생들이 주고받은 물건들
          </div>
        </div>

        {/* 카테고리 필터 */}
        <div className="flex gap-2 pl-[210px] self-start">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full transition-colors ${
                selectedCategory === cat.id
                  ? "bg-[#8769FF] text-white"
                  : "bg-[#F3F3F5] text-[#A2A3A7] hover:bg-[#E5E5E5]"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* 아이템 그리드 */}
        <div className="grid grid-cols-5 gap-6 px-[150px]">
          {filtered.map((post) => (
            <Link
              key={post.post_id}
              href={`/detail/detail-page-consumer?postId=${post.post_id}`}
              className={styles.itemCard}
            >
              <div className={styles.imageContainer}>
                {post.firstImageUrl ? (
                  <ImageWithFallback
                    imagePath={post.firstImageUrl}
                    alt={post.itemName}
                    className={styles.image}
                  />
                ) : (
                  <div
                    className={`${styles.image} bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300`}
                  >
                    <div className="text-center">
                      <div className="text-gray-400 text-2xl mb-1">📷</div>
                      <span className="text-gray-500 text-xs">이미지 없음</span>
                    </div>
                  </div>
                )}
              </div>
              <h3 className={styles.itemTitle}>{post.itemName}</h3>
              <div className={styles.priceContainer}>
                <span className={styles.price}>{post.price_per_hour}원</span>
                <span className="text-[#A2A3A7]">/1시간</span>
              </div>
              <div className={styles.priceContainer}>
                <span className={styles.price}>{post.price_per_day}원</span>
                <span className="text-[#A2A3A7]">/1일</span>
              </div>
              <div className="flex flex-row gap-2">
                {/* 대여중 태그는 API에 따로 없으므로 임의로 숨김 or 표시 로직 추가 */}
                {/* <span className={styles.rentalTag}>대여중</span> */}
                <span className={styles.categoryTag}>
                  {categories.find((c) => c.id === post.category)?.name ||
                    post.category}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <Footer />

      <Link
        href="/detail/new-page"
        className="fixed bottom-8 right-8 bg-[#8769FF] text-white px-6 py-4 rounded-lg flex items-center gap-2 hover:bg-[#7559EF] transition-colors shadow-lg"
      >
        <span className="text-2xl">+</span>
        <span className="text-[18px] font-bold">물건 등록하기</span>
      </Link>
    </main>
  );
}
