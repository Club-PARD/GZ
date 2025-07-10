// src/pages/rentals/BorrowedTab.tsx
import React, { useState, useMemo, useEffect } from "react";
import { TransactionItem } from "./rentals";
import TransactionTable from "./TransactionTable";
import Pagination from "./Pagination";

const ITEMS_PER_PAGE = 5;
const BLOCK_SIZE = 5;

interface BorrowedTabProps {
  handleReturnConfirm: (id: number) => void;
}

const BorrowedTab: React.FC<BorrowedTabProps> = ({ handleReturnConfirm }) => {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<TransactionItem[]>([]); // 빌린 아이템 상태

  // API에서 빌린 아이템 데이터 가져오기
  const fetchBorrowedData = async () => {
    setLoading(true);
    try {
      // TODO: 실제 API 호출로 변경
      // const response = await fetchBorrowedItems();
      // setItems(response.data);
      setItems([]); // 현재는 빈 배열
    } catch (error) {
      console.error("빌린 아이템 데이터 로딩 실패:", error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트 마운트 시 데이터 로딩
  useEffect(() => {
    fetchBorrowedData();
  }, []);

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
        handlePrevBlock={handlePrevBlock}
        handleNextBlock={handleNextBlock}
        setCurrentPage={setCurrentPage}
      />
    </>
  );
};

export default BorrowedTab; 