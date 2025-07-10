// src/pages/rentals/BorrowedTab.tsx
import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
import { TransactionItem, BorrowedData } from "../../lib/rentals.types";
import TransactionTable from "./TransactionTable";
import Pagination from "./Pagination";

const ITEMS_PER_PAGE = 5;
const BLOCK_SIZE = 5;

interface BorrowedTabProps {
  handleReturnConfirm: (id: number) => void;
  reloadTrigger: number;
}

const BorrowedTab: React.FC<BorrowedTabProps> = ({
  handleReturnConfirm,
  reloadTrigger,
}) => {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<TransactionItem[]>([]);

  const fetchBorrowedData = async () => {
    console.log("[BorrowedTab] fetchBorrowedData 호출, reloadTrigger:", reloadTrigger);
    setLoading(true);

    try {
      const stored = localStorage.getItem("me");
      console.log("[BorrowedTab] localStorage ‘me’ 값:", stored);
      const userId = stored ? Number(stored) : null;

      if (!userId) {
        console.warn("[BorrowedTab] 유효한 userId가 없습니다. items를 빈 배열로 설정합니다.");
        setItems([]);
        return;
      }

      console.log(`[BorrowedTab] axios GET /api/borrowed/borrow?userId=${userId}`);
      const res = await axios.get("/api/borrowed/borrow", {
        params: { userId },
        withCredentials: true,  // 쿠키 포함
      });
      console.log("[BorrowedTab] 응답 status:", res.status, "data:", res.data);

      if (res.data.success) {
        const mapped: TransactionItem[] = res.data.data.map((d: BorrowedData) => ({
          id: d.borrowedId,
          title: d.itemName,
          category: d.category || "",
          duration: `${d.peroid}${d.unitOfPeroid === "DAY" ? "일" : "시간"}`,
          price: d.totalPrice,
          status:
            d.borrowStatus === "BORROWED"
              ? "거래 중"
              : d.borrowStatus === "RETURNED"
              ? "반납 완료"
              : d.borrowStatus,
          imageUrl: d.firstImageUrl,
        }));
        console.log("[BorrowedTab] 매핑된 items:", mapped);
        setItems(mapped);
      } else {
        console.error("[BorrowedTab] 빌린 내역 조회 오류:", res.data.message);
        setItems([]);
      }
    } catch (err) {
      console.error("[BorrowedTab] fetchBorrowedData 예외 발생:", err);
      setItems([]);
    } finally {
      setLoading(false);
      console.log("[BorrowedTab] loading → false");
    }
  };

  // reloadTrigger가 바뀔 때마다 (초기 마운트 포함) 데이터 로드
  useEffect(() => {
    fetchBorrowedData();
  }, [reloadTrigger]);

  // 페이지네이션
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);

  useEffect(() => {
    if (currentPage > totalPages) {
      console.log(
        `[BorrowedTab] currentPage(${currentPage}) > totalPages(${totalPages}) → 1로 reset`
      );
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const currentItems = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    console.log(
      `[BorrowedTab] currentItems slice: start=${start}, end=${
        start + ITEMS_PER_PAGE
      }`
    );
    return items.slice(start, start + ITEMS_PER_PAGE);
  }, [items, currentPage]);

  const currentBlockStart =
    Math.floor((currentPage - 1) / BLOCK_SIZE) * BLOCK_SIZE + 1;
  const currentBlockEnd = Math.min(
    currentBlockStart + BLOCK_SIZE - 1,
    totalPages
  );

  return (
    <>
      <TransactionTable
        currentItems={currentItems}
        activeTab="borrow"
        handleReturnConfirm={handleReturnConfirm}
        loading={loading}
      />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        currentBlockStart={currentBlockStart}
        currentBlockEnd={currentBlockEnd}
        handlePrevBlock={() => {
          console.log("[BorrowedTab] 이전 블록 이동");
          setCurrentPage(Math.max(currentBlockStart - BLOCK_SIZE, 1));
        }}
        handleNextBlock={() => {
          console.log("[BorrowedTab] 다음 블록 이동");
          setCurrentPage(
            Math.min(
              currentBlockStart + BLOCK_SIZE,
              totalPages - BLOCK_SIZE + 1
            )
          );
        }}
        setCurrentPage={(page) => {
          console.log("[BorrowedTab] 페이지 직접 이동:", page);
          setCurrentPage(page);
        }}
      />
    </>
  );
};

export default BorrowedTab;
