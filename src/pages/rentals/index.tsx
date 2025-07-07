// src/pages/rentals/index.tsx
import React, { useState, useMemo, useEffect } from "react";
import Header from "@/components/home-header";
import Footer from "@/components/Footer";

type Tab = "borrow" | "lend" | "request";
interface TransactionItem {
  id: number;
  title: string;
  category: string;
  duration: string;
  price: number;
  status: string;
  imageUrl: string;
}
const lentItems: TransactionItem[] = [
  /* …원하는 데이터 추가… */
];
const requestItems: TransactionItem[] = [
  {
    id: 1,
    title: "1TB USB 빌려드려요",
    category: "전자기기",
    duration: "10시간",
    price: 30000,
    status: "반납 요청",
    imageUrl: "/images/usb.jpg",
  },
  {
    id: 2,
    title: "가방 빌려드려요",
    category: "패션",
    duration: "3일",
    price: 50000,
    status: "반납",
    imageUrl: "/images/bag.jpg",
  },
  {
    id: 3,
    title: "망치 빌려드려요",
    category: "도구",
    duration: "1주일",
    price: 20000,
    status: "반납",
    imageUrl: "/images/hammer.jpg",
  },
  {
    id: 4,
    title: "카메라 빌려드려요",
    category: "전자기기",
    duration: "1일",
    price: 15000,
    status: "반납",
    imageUrl: "/images/camera.jpg",
  },
  {
    id: 5,
    title: "신발 빌려드려요",
    category: "패션",
    duration: "2주일",
    price: 5000,
    status: "거래",
    imageUrl: "/images/shoes.jpg",
  },
  {
    id: 6,
    title: "캠핑용품 세트 빌려드려요",
    category: "여행",
    duration: "1달",
    price: 30000,
    status: "반납",
    imageUrl: "/images/camping.jpg",
  },
];
const borrowedItems: TransactionItem[] = [
  {
    id: 1,
    title: "1TB USB 빌려드려요",
    category: "전자기기",
    duration: "10시간",
    price: 30000,
    status: "반납",
    imageUrl: "/images/usb.jpg",
  },
  {
    id: 2,
    title: "가방 빌려드려요",
    category: "패션",
    duration: "3일",
    price: 50000,
    status: "거래",
    imageUrl: "/images/bag.jpg",
  },
  {
    id: 3,
    title: "망치 빌려드려요",
    category: "도구",
    duration: "1주일",
    price: 20000,
    status: "거래",
    imageUrl: "/images/hammer.jpg",
  },
  {
    id: 4,
    title: "카메라 빌려드려요",
    category: "전자기기",
    duration: "1일",
    price: 15000,
    status: "반납 수락",
    imageUrl: "/images/camera.jpg",
  },
  {
    id: 5,
    title: "신발 빌려드려요",
    category: "패션",
    duration: "2주일",
    price: 5000,
    status: "반납 요청",
    imageUrl: "/images/shoes.jpg",
  },
  {
    id: 6,
    title: "캠핑용품 세트 빌려드려요",
    category: "여행",
    duration: "1달",
    price: 30000,
    status: "반납 수락",
    imageUrl: "/images/camping.jpg",
  },
];

const ITEMS_PER_PAGE = 5;

const RentalsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>("borrow");
  const items =
    activeTab === "borrow"
      ? borrowedItems
      : activeTab === "lend"
      ? lentItems
      : requestItems;

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [totalPages, currentPage]);

  const currentItems = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return items.slice(start, start + ITEMS_PER_PAGE);
  }, [items, currentPage]);

  const pageNumbers = useMemo(
    () => Array.from({ length: totalPages }, (_, i) => i + 1),
    [totalPages]
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="pb-[60px] flex-grow pt-16   ">
        <div className="max-w-[980px] mx-auto  ">
          {/* 타이틀 */}
          <h1
            className="pb-[60px] pt-[60px] text-[#232323]                    
  px-106                       
  [font-family:'Pretendard Variable']
  text-[32px]                        
  leading-[130%]                    
  tracking-[-0.64px] "
          >
            거래 내역
          </h1>

          {/* 탭 */}
          <div className="flex justify-center space-x-5 mb-10">
            <button
              className={`pb-1 ${
                activeTab === "borrow"
                  ? "border-b-2 border-[#232323] text-[#232323] text-center  text-[22px] font-semibold leading-[130%] tracking-[-0.44px] "
                  : "text-[#C2C3C9] text-center  text-[22px] font-semibold leading-[130%] tracking-[-0.44px] "
              }`}
              onClick={() => {
                setActiveTab("borrow");
                setCurrentPage(1);
              }}
            >
              빌린 내역
            </button>
            <button
              className={`pb-1 ${
                activeTab === "lend"
                  ? "border-b-2 border-[#232323] text-[#232323] text-center  text-[22px] font-semibold leading-[130%] tracking-[-0.44px] "
                  : "text-[#C2C3C9] text-center  text-[22px] font-semibold leading-[130%] tracking-[-0.44px] "
              }`}
              onClick={() => {
                setActiveTab("lend");
                setCurrentPage(1);
              }}
            >
              빌려준 내역
            </button>
            <button
              className={`pb-1 ${
                activeTab === "request"
                  ? "border-b-2 border-[#232323] text-[#232323] text-center  text-[22px] font-semibold leading-[130%] tracking-[-0.44px] "
                  : "text-[#C2C3C9] text-center  text-[22px] font-semibold leading-[130%] tracking-[-0.44px] "
              }`}
              onClick={() => {
                setActiveTab("request");
                setCurrentPage(1);
              }}
            >
              대여 요청
            </button>
          </div>

          {/* 그리드 */}
          <div className="overflow-x-auto border-b border-gray-200">
            <div className="overflow-x-auto border-b border-gray-200"></div>
            <div
              className="
              grid w-full
              [grid-template-columns:2fr_0.5fr_0.5fr]
              divide-y divide-x divide-gray-200
              border-x border-gray-200
              text-gray-600 font-medium
              border-t border-gray-200 
            "
            >
              {/* 헤더 */}
              <div className="px-6 py-4">물품 정보</div>
              <div className="px-6 py-4 text-center">대여 기간 및 가격</div>
              <div className="px-6 py-4 text-center">상태</div>

              {/* 아이템들 or 빈 상태 */}
              {currentItems.length > 0 ? (
                currentItems.map((item) => (
                  <React.Fragment key={item.id}>
                    {/* 1) 물품 정보 */}
                    <div className="flex items-center space-x-4 px-6 py-6">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-20 h-20 rounded object-cover"
                      />
                      <div>
                        <div className="flex items-center font-semibold text-[#232323]">
                          {item.title}
                          <span className="ml-2 text-gray-400">&gt;</span>
                        </div>
                        <div className="text-sm text-gray-500">
                          {item.category}
                        </div>
                      </div>
                    </div>

                    {/* 2) 대여 기간 및 가격 */}
                    <div className="flex flex-col justify-center items-center px-6 py-6 text-center">
                      <div className="text-sm text-gray-400 mb-1">
                        {item.duration}
                      </div>
                      <div className="text-lg font-bold">
                        {item.price.toLocaleString()}원
                      </div>
                    </div>

                    {/* 3) 상태 버튼 */}
                    <div className="flex flex-col justify-center items-center space-y-2 px-6 py-6">
                      {activeTab === "borrow" ? (
                        <button
                          className={`flex w-[104px] h-[38px] flex-shrink-0 justify-center items-center gap-[6px] px-[16px] py-[8px] rounded-lg ${
                            item.status === "반납 요청"
                              ? "bg-[var(--Purple-04,#6849FE)]"
                              : "bg-[var(--Gray-05,#C2C3C9)]"
                          }`}
                        >
                          <span className="text-[var(--White,#FFF)] text-center [font-family:'Pretendard Variable'] text-[16px] font-semibold leading-[130%] tracking-[-0.32px]">
                            {item.status === "거래" ? "대여 중" : "반납 완료"}
                          </span>
                        </button>
                      ) : (
                        <>
                          <button className="flex w-[104px] h-[38px] flex-shrink-0 justify-center items-center gap-[6px] px-[16px] py-[8px] rounded-lg bg-[var(--Gray-05,#C2C3C9)]">
                            <div className="text-[var(--White,#FFF)] text-center [font-family:'Pretendard Variable'] text-[16px] font-semibold leading-[130%] tracking-[-0.32px]">
                              신청거절
                            </div>
                          </button>
                          <button className="flex w-[104px] h-[38px] flex-shrink-0 justify-center items-center gap-[6px] px-[16px] py-[8px] rounded-lg bg-[var(--Purple-04,#6849FE)]">
                            <div className="text-[var(--White,#FFF)] text-center [font-family:'Pretendard Variable'] text-[16px] font-semibold leading-[130%] tracking-[-0.32px]">
                              신청수락
                            </div>
                          </button>
                        </>
                      )}
                    </div>
                  </React.Fragment>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-20 col-span-3">
                  <img
                    src="/images/emptyfolder.svg"
                    alt="등록된 물건이 없어요"
                    className="w-30 h-30 flex-shrink-0"
                  />
                  <p className="text-gray-500 mb-6">등록한 물건이 없어요</p>
                </div>
              )}
            </div>
          </div>

          {/* 페이지 네비게이션 */}
          <div className="flex justify-center items-center mt-8 space-x-2 text-sm text-gray-500">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="px-2 disabled:opacity-50"
            >
              &laquo;
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-2 disabled:opacity-50"
            >
              &lt;
            </button>
            {pageNumbers.map((n) => (
              <button
                key={n}
                onClick={() => setCurrentPage(n)}
                className={`px-3 py-1 rounded ${
                  n === currentPage
                    ? "bg-gray-100 text-gray-800"
                    : "hover:text-gray-700"
                }`}
              >
                {n}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-2 disabled:opacity-50"
            >
              &gt;
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="px-2 disabled:opacity-50"
            >
              &raquo;
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RentalsPage;
