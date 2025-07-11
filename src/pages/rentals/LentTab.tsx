// src/pages/rentals/LentTab.tsx
import React, { useState, useMemo, useEffect, useCallback } from "react";
import axios from "axios";
import { TransactionItem, BorrowedData } from "../../lib/rentals.types";
import TransactionTable from "./TransactionTable";
import Pagination from "./Pagination";

const ITEMS_PER_PAGE = 5;
const BLOCK_SIZE = 5;

interface LentTabProps {
  handleReturnConfirm: (id: number) => void;
  reloadTrigger: number;
}

const LentTab: React.FC<LentTabProps> = ({
  handleReturnConfirm,
  reloadTrigger,
}) => {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<TransactionItem[]>([]);

  const fetchLentData = useCallback(async () => {
    console.log("[LentTab] fetchLentData 호출, reloadTrigger:", reloadTrigger);
    setLoading(true);
    console.log("[LentTab] loading → true");

    try {
      const stored = localStorage.getItem("me");
      console.log("[LentTab] localStorage 'me':", stored);
      const userId = stored ? Number(stored) : null;
      console.log("[LentTab] parsed userId:", userId);

      if (!userId) {
        console.warn("[LentTab] 유효한 userId가 없습니다. items를 빈 배열로 설정합니다.");
        setItems([]);
        return;
      }

      console.log(`[LentTab] axios GET /api/borrowed/lend?userId=${userId}`);
      const res = await axios.get("/api/borrowed/lend", {
        params: { userId },
        withCredentials: true,
      });
      console.log("[LentTab] 응답 status:", res.status, "data:", res.data);

      if (res.data.success) {
        const mapped: TransactionItem[] = res.data.data.map((d: BorrowedData) => ({
          id: d.borrowedId, // 무조건 borrowedId만 사용
          borrowedId: d.borrowedId,
          postId: d.postId, // 상세페이지 이동용
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
        console.log("[LentTab] 매핑된 items:", mapped);
        setItems(mapped);
      } else {
        console.error("[LentTab] 빌려준 내역 조회 오류:", res.data.message);
        setItems([]);
      }
    } catch (err) {
      console.error("[LentTab] fetchLentData 예외 발생:", err);
      setItems([]);
    } finally {
      setLoading(false);
      console.log("[LentTab] loading → false");
    }
  }, [reloadTrigger]);

  // reloadTrigger가 바뀔 때마다 (초기 마운트 포함) 데이터 로드
  useEffect(() => {
    fetchLentData();
  }, [fetchLentData]);

  // 페이지네이션 로직
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);

  useEffect(() => {
    if (currentPage > totalPages) {
      console.log(
        `[LentTab] currentPage(${currentPage}) > totalPages(${totalPages}) → reset to 1`
      );
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  // 데이터가 없어도 최소 1페이지는 표시
  const effectiveTotalPages = Math.max(1, totalPages);

  const currentItems = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    console.log(`[LentTab] currentItems slice: start=${start}, end=${start + ITEMS_PER_PAGE}`);
    return items.slice(start, start + ITEMS_PER_PAGE);
  }, [items, currentPage]);

  const currentBlockStart =
    Math.floor((currentPage - 1) / BLOCK_SIZE) * BLOCK_SIZE + 1;
  const currentBlockEnd = Math.min(
    currentBlockStart + BLOCK_SIZE - 1,
    effectiveTotalPages
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
        totalPages={effectiveTotalPages}
        currentBlockStart={currentBlockStart}
        currentBlockEnd={currentBlockEnd}
        handlePrevBlock={() => {
          console.log("[LentTab] 이전 블록 이동");
          setCurrentPage(Math.max(currentBlockStart - BLOCK_SIZE, 1));
        }}
        handleNextBlock={() => {
          console.log("[LentTab] 다음 블록 이동");
          setCurrentPage(
            Math.min(
              currentBlockStart + BLOCK_SIZE,
              effectiveTotalPages - BLOCK_SIZE + 1
            )
          );
        }}
        setCurrentPage={(page) => {
          console.log("[LentTab] 페이지 직접 이동:", page);
          setCurrentPage(page);
        }}
      />
    </>
  );
};

export default LentTab;
