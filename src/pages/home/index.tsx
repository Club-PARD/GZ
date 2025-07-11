// src/pages/home/index.tsx
"use client";

import Header from "@/components/home-header";
import Footer from "@/components/Footer";
import { IoSearchOutline } from "@/components/icons";
import { IoLocationSharp } from "react-icons/io5";
import styles from "./home.module.css";
import { useState, useEffect, ChangeEvent, KeyboardEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { getHomeData, getSearchData } from "@/lib/api";
import Image from "next/image";
import { usePreventBackNavigation } from "@/lib/hooks/usePreventBackNavigation";

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
  isBorrowable: "POSSIBLE" | "IMPOSSIBLE";
  firstImageUrl?: string | null;
  itemName: string;
  category: string;
  price_per_hour: number;
  price_per_day: number;
}

export default function Home() {
  const router = useRouter();

  // 뒤로 가기 방지 - replace 메서드만 사용
  usePreventBackNavigation({
    enabled: true
  });

  // 전체 게시물 원본 저장용
  const [allPosts, setAllPosts] = useState<HomePost[]>([]);
  const [posts, setPosts] = useState<HomePost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [me, setMe] = useState<string>("");
  const [keyword, setKeyword] = useState<string>(""); // 검색어 상태
  const [schoolName, setSchoolName] = useState<string>(""); // 학교명 상태

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
      router.replace("/cert/login");
      return;
    }
    setMe(stored);
  }, [router]);

  // 초기 홈 데이터 로드
  useEffect(() => {
    const fetchHome = async () => {
      if (!me) {
        setIsLoading(false);
        return;
      }
      try {
        const json: HomeResponse = await getHomeData();
        if (json.success) {
          setAllPosts(json.data.posts);
          setPosts(json.data.posts);
          setSchoolName(json.data.schoolName);
        }
      } catch (err: unknown) {
        const error = err as Error;
        console.error('홈 데이터 로드 중 오류:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHome();
  }, [me, router]);

  // 검색어 입력 핸들러
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };

  // Enter 키 누르면 검색 or 리셋
  const handleKeyDown = async (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;

    // 검색어가 비어 있으면 전체 게시물로 복원
    if (!keyword.trim()) {
      setPosts(allPosts);
      setSelectedCategory("all");
      return;
    }

    // 키워드 검색 API 호출
    try {
      const json = await getSearchData(keyword);
      if (json.success) {
        // 검색 결과에 isBorrowable 필드가 없는 경우 기본값 설정
        const postsWithBorrowable = json.data.map((post: any) => ({
          ...post,
          isBorrowable: post.isBorrowable || "POSSIBLE" as const
        }));
        setPosts(postsWithBorrowable);
        setSelectedCategory("all"); // 검색 후 전체 카테고리로 초기화
      }
    } catch (err) {
      console.error("검색 실패:", err);
    }
  };

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
    <main className="min-h-screen w-full flex flex-col relative bg-white pt-[70px]">
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
            필요할 때마다 사지말고, 지구에서 잠깐 빌려요!
          </h1>
          <div className="w-[780px] h-[68px] mb-6 relative">
            <input
              className="w-full h-full bg-white pl-14 pr-6 text-lg rounded-full border text-black border-gray-300 focus:outline-none focus:border-[#8769FF] focus:ring-1 focus:ring-[#8769FF]"
              type="text"
              placeholder="지금 어떤 물건을 구매하고 있나요?"
              value={keyword}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
            />
            <div className="absolute left-5 top-1/2 -translate-y-1/2 tetx-black">
              <IoSearchOutline size={24} color="#A2A3A7" />
            </div>
          </div>
        </div>
      </div>

      {/* 목록 헤더 */}
      <div className="flex flex-col items-center gap-7 pt-[20px]">
        <div className="flex items-center gap-2 mt-[60px] pl-[210px] self-start">
          <IoLocationSharp size={24} color="black" />
          <div className="text-[22px] font-bold text-black">
            {schoolName} 학생들이 주고받은 물건들
          </div>
        </div>

        {/* 카테고리 필터 */}
        <div className="flex gap-2 pl-[210px] self-start">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full transition-colors ${selectedCategory === cat.id
                  ? "bg-[#6849FE] text-white"
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
              href={`/detail/${post.post_id}`}
              className={styles.itemCard}
            >
              <div className={styles.imageContainer}>
                {post.firstImageUrl ? (
                  <Image
                    src={`/api/image-proxy?url=${encodeURIComponent(
                      post.firstImageUrl
                    )}`}
                    alt={post.itemName}
                    width={280}
                    height={280}
                    className={styles.image}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    unoptimized
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/images/camera.jpg";
                    }}
                  />
                ) : (
                  <div
                    className={`${styles.image
                      } bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300`}
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
                <span className={styles.price}>{post.price_per_hour.toLocaleString()}원</span>
                <span className="text-[#A2A3A7]">/1시간</span>
              </div>
              <div className={styles.priceContainer}>
                <span className={styles.price}>{post.price_per_day.toLocaleString()}원</span>
                <span className="text-[#A2A3A7]">/1일</span>
              </div>
              <div className="flex flex-row gap-2">
                <span className={styles.categoryTag}>
                  {categories.find((c) => c.id === post.category)?.name ||
                    post.category}
                </span>
                <span className="inline-block mt-2 px-1 py-0.5 bg-[#F0EDFF] text-[#6849FE] text-xs rounded w-fit whitespace-nowrap">
                  {post.isBorrowable === "POSSIBLE" ? "대여가능" : "대여불가"}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div className="w-full h-[100px]"></div>

      <Footer />

      <Link
        href="/detail/new-page"
        className="fixed bottom-13 right-18 bg-[#6849FE] text-white pt-4 pr-6 pb-4 pl-4 rounded-lg flex items-center gap-2 hover:bg-[#7559EF] transition-colors shadow-lg w-[162px] h-[55px] z-40"
      >
        <span className="text-2xl">+</span>
        <span className="text-[18px] font-bold">물건 등록하기</span>
      </Link>
    </main>
  );
}
