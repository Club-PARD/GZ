// src/pages/rentals/requests.tsx
import React, { useState, useMemo, useEffect } from "react";
import Header from "@/components/home-header";
import Footer from "@/components/Footer";
import TabNav from "./TabNav";
import TransactionTable from "./TransactionTable";
import Pagination from "./Pagination";
import {
  Tab,
  RequestItem,
  fetchApplyHistory,
} from "./rentals";

const ITEMS_PER_PAGE = 5;
const BLOCK_SIZE = 5;

const RequestsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>("request");
  const [requestItemsState, setRequestItemsState] = useState<RequestItem[]>([]);
  const [loading, setLoading] = useState(false);

  // API에서 대여요청 데이터 가져오기
  const fetchRequestData = async () => {
    setLoading(true);
    try {
      const response = await fetchApplyHistory();
      setRequestItemsState(response.data);
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

  const handleReturnConfirm = (id: number) => {
    // 반납 확인 로직 (현재는 더미)
    console.log("반납 확인:", id);
  };

  // 페이지네이션 상태 및 계산
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(requestItemsState.length / ITEMS_PER_PAGE);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [totalPages]);

  const currentItems = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return requestItemsState.slice(start, start + ITEMS_PER_PAGE);
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
            대여요청
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
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RequestsPage; 