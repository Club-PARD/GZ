// src/pages/rentals/RequestsTab.tsx
import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
import { RequestItem } from "./rentals.types";
import TransactionTable from "./TransactionTable";
import Pagination from "./Pagination";

const ITEMS_PER_PAGE = 5;
const BLOCK_SIZE = 5;

interface RequestsTabProps {
  handleReturnConfirm: (id: number) => void;
}

const RequestsTab: React.FC<RequestsTabProps> = ({ handleReturnConfirm }) => {
  const [requestItemsState, setRequestItemsState] = useState<RequestItem[]>([]);
  const [loading, setLoading] = useState(false);

  // API에서 대여요청 데이터 가져오기
  const fetchRequestData = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/apply/all", { withCredentials: true });
      setRequestItemsState(response.data.data);
    } catch (error) {
      console.error("대여요청 데이터 로딩 실패:", error);
      // 에러 시 빈 배열로 설정
      setRequestItemsState([]);
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트 마운트 시 데이터 로딩
  useEffect(() => {
    fetchRequestData();
  }, []);

  // 페이지네이션 상태 및 계산
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil((requestItemsState?.length || 0) / ITEMS_PER_PAGE);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [totalPages]);

  const currentItems = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return (requestItemsState || []).slice(start, start + ITEMS_PER_PAGE);
  }, [requestItemsState, currentPage]);

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
        activeTab="request"
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

export default RequestsTab; 