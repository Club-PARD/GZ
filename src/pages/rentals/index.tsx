// src/pages/rentals/index.tsx
import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
import Header from "@/components/home-header";
import Footer from "@/components/Footer";
import TabNav from "./TabNav";
import TransactionTable from "./TransactionTable";
import Pagination from "./Pagination";
import { TransactionItem, Tab } from "./rentals";

// axios 인스턴스 통합
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // 예: "https://api.example.com"
  withCredentials: true,                     // 쿠키 포함
  headers: {
    "Content-Type": "application/json",
  },
});

const ITEMS_PER_PAGE = 5;
const BLOCK_SIZE = 5;

const RentalsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>("borrow");
  const [borrowedItems, setBorrowedItems] = useState<TransactionItem[]>([]);
  const [loanedItems, setLoanedItems]     = useState<TransactionItem[]>([]);
  const [requestItems, setRequestItems]   = useState<TransactionItem[]>([]);

  // 반납 확인 핸들러
  const handleReturnConfirm = (id: number) => {
    api
      .patch("/borrowed/return", null, { params: { borrowedId: id } })
      .then((res) => {
        if (!res.data.success) {
          console.error("반납 요청 오류:", res.data.message);
          return;
        }
        // 서버 성공 응답 받으면 로컬 상태 업데이트
        setLoanedItems((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, status: "반납 완료" } : item
          )
        );
        setBorrowedItems((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, status: "반납 완료" } : item
          )
        );
      })
      .catch((err) => console.error("반납 요청 실패:", err));
  };

  // 탭 전환 시 해당 API 호출
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (!storedUserId) return;

    if (activeTab === "borrow") {
      // 내가 빌린 내역 조회
      api
        .get("/borrowed/borrow", { params: { userId: storedUserId } })
        .then((res) => {
          if (!res.data.success) {
            console.error("빌린 내역 API 오류:", res.data.message);
            return;
          }
          const mapped: TransactionItem[] = res.data.data.map((d: any) => ({
            id: d.borrowedId,
            title: d.itemName,
            category: d.category || "",
            duration: `${d.peroid}${
              d.unitOfPeroid === "DAY" ? "일" : "시간"
            }`,
            price: d.totalPrice,
            status:
              d.borrowStatus === "BORROWED"
                ? "거래 중"
                : d.borrowStatus === "RETURNED"
                ? "반납 완료"
                : d.borrowStatus,
            imageUrl: d.firstImageUrl,
          }));
          setBorrowedItems(mapped);
        })
        .catch((err) => console.error("빌린 내역 조회 실패:", err));
    } else if (activeTab === "lend") {
      // 내가 빌려준 내역 조회
      api
        .get("/borrowed/lend", { params: { userId: storedUserId } })
        .then((res) => {
          if (!res.data.success) {
            console.error("빌려준 내역 API 오류:", res.data.message);
            return;
          }
          const mapped: TransactionItem[] = res.data.data.map((d: any) => ({
            id: d.borrowedId,
            title: d.itemName,
            category: d.category || "",
            duration: `${d.peroid}${
              d.unitOfPeroid === "DAY" ? "일" : "시간"
            }`,
            price: d.totalPrice,
            status:
              d.borrowStatus === "BORROWED"
                ? "거래 중"
                : d.borrowStatus === "RETURNED"
                ? "반납 완료"
                : d.borrowStatus,
            imageUrl: d.firstImageUrl,
          }));
          setLoanedItems(mapped);
        })
        .catch((err) => console.error("빌려준 내역 조회 실패:", err));
    }

    // TODO: activeTab === "request" → /borrowed/request
  }, [activeTab]);

  // 현재 탭에 맞는 아이템 배열 선택
  const items =
    activeTab === "borrow"
      ? borrowedItems
      : activeTab === "lend"
      ? loanedItems
      : requestItems;

  // 페이지네이션 상태 및 계산
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [totalPages]);

  const currentItems = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return items.slice(start, start + ITEMS_PER_PAGE);
  }, [items, currentPage]);

  const currentBlockStart =
    Math.floor((currentPage - 1) / BLOCK_SIZE) * BLOCK_SIZE + 1;
  const currentBlockEnd = Math.min(
    currentBlockStart + BLOCK_SIZE - 1,
    totalPages
  );

  const handlePrevBlock = () =>
    setCurrentPage(Math.max(currentBlockStart - BLOCK_SIZE, 1));
  const handleNextBlock = () =>
    setCurrentPage(
      Math.min(currentBlockStart + BLOCK_SIZE, totalPages - BLOCK_SIZE + 1)
    );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="pb-[60px] flex-grow pt-16">
        <div className="max-w-[980px] mx-auto">
          <h1
            className={`
              pb-[60px] pt-[60px] text-[#232323]
              px-106 [font-family:'Pretendard Variable']
              text-[32px] leading-[130%] tracking-[-0.64px]
            `}
          >
            거래 내역
          </h1>

          <TabNav
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            setCurrentPage={setCurrentPage}
          />

          <TransactionTable
            currentItems={currentItems}
            activeTab={activeTab}
            handleReturnConfirm={handleReturnConfirm}
          />

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
      </main>
      <Footer />
    </div>
  );
};

export default RentalsPage;
