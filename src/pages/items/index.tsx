// pages/MyPostsPage.tsx
import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/home-header";
import Footer from "@/components/Footer";
import { getMyPosts, deletePosts } from "@/lib/api";
import { AxiosError } from "axios";
import Pagination from "@/pages/rentals/Pagination";
import { FaSquareCheck } from "react-icons/fa6";

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
  isBorrowable: "POSSIBLE" | "IMPOSSIBLE";
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

  // 페이지네이션 블록 관련 상태 추가
  const [currentBlockStart, setCurrentBlockStart] = useState<number>(1);
  const [currentBlockEnd, setCurrentBlockEnd] = useState<number>(5);

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

  // 내 물건 받아오기
  const fetchMyPosts = useCallback(async () => {
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
  }, [me, router]);

  useEffect(() => {
    fetchMyPosts();
  }, [fetchMyPosts]);

  // 체크박스
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
    if (checked) newSelected.add(postId);
    else newSelected.delete(postId);
    setSelectedItems(newSelected);
  };

  // 페이지네이션
  const totalPages = Math.ceil(posts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPosts = posts.slice(startIndex, endIndex);

  // 페이지 블록 관리 함수들
  const handlePrevBlock = () => {
    const newBlockStart = Math.max(1, currentBlockStart - 5);
    const newBlockEnd = newBlockStart + 4;
    setCurrentBlockStart(newBlockStart);
    setCurrentBlockEnd(newBlockEnd);
    setCurrentPage(newBlockStart);
  };

  const handleNextBlock = () => {
    const newBlockStart = currentBlockStart + 5;
    const newBlockEnd = Math.min(totalPages, newBlockStart + 4);
    setCurrentBlockStart(newBlockStart);
    setCurrentBlockEnd(newBlockEnd);
    setCurrentPage(newBlockStart);
  };

  // 페이지 변경 시 블록 업데이트
  useEffect(() => {
    const blockSize = 5;
    const blockNumber = Math.floor((currentPage - 1) / blockSize);
    const newBlockStart = blockNumber * blockSize + 1;
    const newBlockEnd = Math.min(totalPages, newBlockStart + blockSize - 1);
    
    setCurrentBlockStart(newBlockStart);
    setCurrentBlockEnd(newBlockEnd);
  }, [currentPage, totalPages]);

  // 선택 삭제
  const handleDeleteSelected = async () => {
    if (selectedItems.size === 0) {
      alert("삭제할 항목을 선택해주세요.");
      return;
    }
    if (!confirm(`${selectedItems.size}개의 항목을 삭제하시겠습니까?`)) return;

    try {
      const postIdsArray = Array.from(selectedItems);
      const response: ApiResponse<{ deletedCount: number }> =
        await deletePosts(postIdsArray);

      if (response.success) {
        const updatedPosts = posts.filter(
          (post) => !selectedItems.has(post.post_id)
        );
        setPosts(updatedPosts);
        setHasPosts(updatedPosts.length > 0);
        setSelectedItems(new Set());

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
          (err.response?.data as { message?: string })?.message ||
            "삭제 중 오류가 발생했습니다."
        );
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

      <main className="flex-grow flex flex-col items-center pt-[60px] pb-[67px]">
        {/* 페이지 제목 */}
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
          <>
            {/* 테이블: 위/아래 테두리만, 좌우는 없음 */}
            <div className="bg-white border-y border-gray-200 overflow-hidden mt-[60px] w-[980px]">
              {/* 헤더 */}
              <div className="bg-white border-b border-gray-200 px-6 py-3">
                <div className="flex items-center">
                  <label
                    className="flex items-center cursor-pointer mr-4"
                    onClick={() => handleSelectAll(!(currentPosts.length > 0 && currentPosts.every((post) => selectedItems.has(post.post_id))))}
                  >
                    {currentPosts.length > 0 && currentPosts.every((post) => selectedItems.has(post.post_id)) ? (
                      <FaSquareCheck size={24} className="text-[#6849FE]" />
                    ) : (
                      <span className="w-[24px] h-[24px] border border-[#ADAEB2] rounded-[4px]" />
                    )}
                  </label>
                  <div className="flex-1 grid grid-cols-12 gap-4 text-sm font-medium text-gray-900">
                    <div className="col-span-6">물건 정보</div>
                    <div className="col-span-6 flex justify-end pr-[40px]">상태</div>
                  </div>
                </div>
              </div>
              {/* 바디 */}
              <div className="divide-y divide-gray-200">
                {currentPosts.map((post) => (
                  <div
                    key={post.post_id}
                    className="px-6 py-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center">
                      <label
                        className="flex items-center cursor-pointer mr-4"
                        onClick={() => handleSelectItem(post.post_id, !selectedItems.has(post.post_id))}
                      >
                        {selectedItems.has(post.post_id) ? (
                          <FaSquareCheck size={24} className="text-[#6849FE]" />
                        ) : (
                          <span className="w-[24px] h-[24px] border border-[#ADAEB2] rounded-[4px]" />
                        )}
                      </label>
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
                                          : `${
                                              process.env
                                                .NEXT_PUBLIC_API_URL || ""
                                            }${
                                              post.firstImageUrl.startsWith(
                                                "/"
                                              )
                                                ? ""
                                                : "/"
                                            }${post.firstImageUrl}`
                                      }`
                                    : "/images/camera.jpg"
                                }
                                alt={post.itemName}
                                fill
                                style={{ objectFit: "cover" }}
                                className="rounded-lg"
                                unoptimized
                                onError={(e) => {
                                  const target =
                                    e.target as HTMLImageElement;
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
                              <div className="text-xs text-gray-500 mt-1">
                                {post.category}
                              </div>
                              <div className="mt-1 space-y-1">
                                <div className="text-sm text-gray-900">
                                  <span className="font-medium">
                                    {post.price_per_hour.toLocaleString()}
                                    원
                                  </span>
                                  <span className="text-gray-500 ml-1">
                                    / 1시간
                                  </span>
                                </div>
                                <div className="text-sm text-gray-900">
                                  <span className="font-medium">
                                    {post.price_per_day.toLocaleString()}
                                    원
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
                        <div className="col-span-6 flex justify-end pr-[20px]">
                          <span
                            className={`inline-flex px-3 py-1 text-xs font-medium rounded-lg ${
                              post.isBorrowable === "POSSIBLE"
                                ? "bg-[#F0EDFF] text-[#6849FE]"
                                : "bg-gray-200 text-gray-400"
                            }`}
                          >
                            {post.isBorrowable === "POSSIBLE"
                              ? "대여가능"
                              : "대여불가"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* 하단: 선택 버튼 + 페이지네비게이터 */}
            <div className="w-[980px] flex justify-between items-center px-6 py-4 mt-4">
              <div className="flex space-x-2">
                <button className="w-[82px] h-[37px] text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                  선택 취소
                </button>
                <button
                  onClick={handleDeleteSelected}
                  className="w-[82px] h-[37px] text-sm text-white bg-[#6849FE] border border-[#6849FE] rounded-md hover:bg-[#5a3fd8]"
                >
                  선택 삭제
                </button>
              </div>
            </div>
            
            {/* 페이지네이션 */}
            <div className="w-[980px] flex justify-center">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                currentBlockStart={currentBlockStart}
                currentBlockEnd={currentBlockEnd}
                handlePrevBlock={handlePrevBlock}
                handleNextBlock={handleNextBlock}
                setCurrentPage={setCurrentPage}
              />
            </div>
          </>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mt-8 w-[980px]">
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
/* 버셀 베포 */