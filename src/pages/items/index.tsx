// pages/MyPostsPage.tsx
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/home-header";
import Footer from "@/components/Footer";
import { getMyPosts, deletePosts } from "@/lib/api";
import { AxiosError } from "axios";

// API 응답 래퍼 타입
interface ApiResponse<T> {
  status: number;
  success: boolean;
  message: string;
  data: T;
}

// Post 타입 정의
interface Post {
  post_id: number;
  firstImageUrl?: string | null;
  itemName: string;
  category: string;
  price_per_hour: number;
  price_per_day: number;
}

const MyPostsPage: React.FC = () => {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [hasPosts, setHasPosts] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [me, setMe] = useState<string>("");
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

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

  useEffect(() => {
    const fetchMyPosts = async () => {
      if (!me) {
        setIsLoading(false);
        return;
      }

      try {
        const json: ApiResponse<Post[]> = await getMyPosts();
        if (json.success) {
          setPosts(json.data);
          setHasPosts(json.data.length > 0);
        } else {
          console.error("API 오류:", json.message);
          setPosts([]);
          setHasPosts(false);
        }
      } catch (err: unknown) {
        const error = err as AxiosError;
        if (error.response?.status === 401 || error.response?.status === 403) {
          localStorage.removeItem("me");
          localStorage.removeItem("savedCredentials");
          router.replace("/cert/login");
          return;
        }
        console.error("데이터 가져오기 실패:", error);
        setPosts([]);
        setHasPosts(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyPosts();
  }, [me, router]);

  // 체크박스 관련 함수들
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const currentPageIds = new Set(currentPosts.map((post) => post.post_id));
      setSelectedItems(new Set([...selectedItems, ...currentPageIds]));
    } else {
      const currentPageIds = new Set(currentPosts.map((post) => post.post_id));
      const newSelected = new Set(selectedItems);
      currentPageIds.forEach((id) => newSelected.delete(id));
      setSelectedItems(newSelected);
    }
  };

  const handleSelectItem = (postId: number, checked: boolean) => {
    const newSelected = new Set(selectedItems);
    if (checked) {
      newSelected.add(postId);
    } else {
      newSelected.delete(postId);
    }
    setSelectedItems(newSelected);
  };

  // 페이지네이션 계산
  const totalPages = Math.ceil(posts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPosts = posts.slice(startIndex, endIndex);

  // 선택된 항목들을 삭제하는 함수
  const handleDeleteSelected = async () => {
    if (selectedItems.size === 0) {
      alert("삭제할 항목을 선택해주세요.");
      return;
    }

    if (confirm(`${selectedItems.size}개의 항목을 삭제하시겠습니까?`)) {
      try {
        // 실제 삭제 API 호출
        const postIdsArray = Array.from(selectedItems);
        const response: ApiResponse<{ deletedCount: number }> = await deletePosts(postIdsArray);

        if (response.success) {
          // 성공시 삭제된 항목들을 목록에서 제거
          const updatedPosts = posts.filter(
            (post) => !selectedItems.has(post.post_id)
          );
          setPosts(updatedPosts);
          setHasPosts(updatedPosts.length > 0);
          setSelectedItems(new Set());

          // 현재 페이지에 아이템이 없으면 이전 페이지로 이동
          const newTotalPages = Math.ceil(updatedPosts.length / itemsPerPage);
          if (currentPage > newTotalPages && newTotalPages > 0) {
            setCurrentPage(newTotalPages);
          }

          alert(`${postIdsArray.length}개의 항목이 삭제되었습니다.`);
        } else {
          alert(response.message || "삭제 중 오류가 발생했습니다.");
        }
      } catch (error: unknown) {
        const err = error as AxiosError;
        console.error("삭제 실패 상세:", {
          status: err.response?.status,
          data: err.response?.data,
          message: err.message,
        });

        if (err.response?.status === 401 || err.response?.status === 403) {
          localStorage.removeItem("me");
          localStorage.removeItem("authToken");
          localStorage.removeItem("savedCredentials");
          router.replace("/cert/login");
          return;
        }

        if (err.response?.status === 500) {
          alert("서버에서 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
        } else {
          alert(
            (err.response?.data as { message?: string })?.message || "삭제 중 오류가 발생했습니다."
          );
        }
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">내 물건 목록을 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white pt-[60px]">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8 pb-[67px]">
        <h1
          style={{
            color: "var(--Gray-10, #232323)",
            textAlign: "center",
            fontSize: "32px",
            fontWeight: 600,
            lineHeight: "130%",
            letterSpacing: "-0.64px",
          }}
        >
          내 물건
        </h1>

        {hasPosts ? (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mt-8">
            {/* 테이블 헤더 */}
            <div className="bg-gray-50 border-b border-gray-200 px-6 py-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-[#6849FE] focus:ring-[#6849FE] border-gray-300 rounded mr-4"
                  checked={
                    currentPosts.length > 0 &&
                    currentPosts.every((post) =>
                      selectedItems.has(post.post_id)
                    )
                  }
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
                <div className="flex-1 grid grid-cols-12 gap-4 text-sm font-medium text-gray-900">
                  <div className="col-span-6">물건 정보</div>
                  <div className="col-span-6 text-center">상태</div>
                </div>
              </div>
            </div>

            {/* 테이블 바디 */}
            <div className="divide-y divide-gray-200">
              {currentPosts.map((post) => (
                <div
                  key={post.post_id}
                  className="px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-[#6849FE] focus:ring-[#6849FE] border-gray-300 rounded mr-4"
                      checked={selectedItems.has(post.post_id)}
                      onChange={(e) =>
                        handleSelectItem(post.post_id, e.target.checked)
                      }
                    />
                    <div className="flex-1 grid grid-cols-12 gap-4 items-center">
                      {/* 물건 정보 */}
                      <div className="col-span-6">
                        <div className="flex items-center space-x-4">
                          <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                            <Image
                              src={
                                post.firstImageUrl
                                  ? `/api/image-proxy?url=${
                                      post.firstImageUrl.startsWith("http")
                                        ? post.firstImageUrl
                                        : `https://gz-zigu.store/${post.firstImageUrl}`
                                    }`
                                  : "/images/camera.jpg"
                              }
                              alt={post.itemName}
                              fill
                              style={{ objectFit: "cover" }}
                              className="rounded-lg"
                              unoptimized
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = "/images/camera.jpg";
                              }}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <Link
                              href={`/detail/${post.post_id}`}
                              className="text-sm font-medium text-gray-900 hover:text-[#6849FE] cursor-pointer flex items-center"
                            >
                              {post.itemName}
                              <svg
                                className="w-4 h-4 ml-1 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 5l7 7-7 7"
                                />
                              </svg>
                            </Link>
                            <div className="mt-1 space-y-1">
                              <div className="text-sm text-gray-900">
                                <span className="font-medium">
                                  {post.price_per_hour.toLocaleString()}원
                                </span>
                                <span className="text-gray-500 ml-1">
                                  / 1시간
                                </span>
                              </div>
                              <div className="text-sm text-gray-900">
                                <span className="font-medium">
                                  {post.price_per_day.toLocaleString()}원
                                </span>
                                <span className="text-gray-500 ml-1">
                                  / 1일
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 상태 */}
                      <div className="col-span-6 text-center">
                        <span className="inline-flex px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-[#6849FE]">
                          대여 중
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 하단 버튼들 */}
            <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
              <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                  <button className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    선택 차순
                  </button>
                  <button
                    onClick={handleDeleteSelected}
                    className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    선택 삭제
                  </button>
                </div>

                {/* 페이지네이션 */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                    className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>

                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-3 py-2 text-sm rounded-md ${
                          currentPage === pageNum
                            ? "bg-blue-600 text-white"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    onClick={() =>
                      setCurrentPage(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                    className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 5l7 7-7 7M5 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mt-8">
            <div className="flex flex-col items-center justify-center py-16">
              <Image
                src="/images/emptyfolder.svg"
                alt="등록된 물건이 없어요"
                width={120}
                height={120}
                className="w-30 h-30 flex-shrink-0 mb-4"
              />
              <p className="text-gray-500 mb-6 text-lg">등록한 물건이 없어요</p>
              <Link href="/detail/new-page" passHref>
                <button className="inline-flex items-center justify-center px-6 py-3 gap-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors">
                  + 물건 등록하기
                </button>
              </Link>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default MyPostsPage;
