// src/pages/rentals/LentTab.tsx
import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
import { TransactionItem } from "./rentals";
import TransactionTable from "./TransactionTable";
import Pagination from "./Pagination";

const ITEMS_PER_PAGE = 5;
const BLOCK_SIZE = 5;

interface LentTabProps {
  handleReturnConfirm: (id: number) => void;
  reloadTrigger: number;
}

// axios 인스턴스
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

const LentTab: React.FC<LentTabProps> = ({
  handleReturnConfirm,
  reloadTrigger,
}) => {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<TransactionItem[]>([]);

  const fetchLentData = async () => {
    setLoading(true);
    try {
      const storedUserId = localStorage.getItem("userId");
      if (!storedUserId) {
        setItems([]);
        return;
      }
      const res = await api.get("/borrowed/lend", {
        params: { userId: storedUserId },
      });
      if (res.data.success) {
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
        setItems(mapped);
      } else {
        console.error("빌려준 내역 조회 오류:", res.data.message);
        setItems([]);
      }
    } catch (error) {
      console.error("빌려준 내역 데이터 로딩 실패:", error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  // reloadTrigger가 바뀔 때마다 (초기 마운트 포함) 데이터 로드
  useEffect(() => {
    fetchLentData();
  }, [reloadTrigger]);

  // 페이지네이션
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
    <>
      <TransactionTable
        currentItems={currentItems}
        activeTab="lend"
        handleReturnConfirm={handleReturnConfirm}
        loading={loading}
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
    </>
  );
};

export default LentTab;
