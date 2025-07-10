// src/pages/rentals/lent.tsx
import React, { useState, useMemo, useEffect } from "react";
import Header from "@/components/home-header";
import Footer from "@/components/Footer";
import TabNav from "./TabNav";
import TransactionTable from "./TransactionTable";
import Pagination from "./Pagination";
import { TransactionItem, Tab } from "./rentals";

const ITEMS_PER_PAGE = 5;
const BLOCK_SIZE = 5;

const LentPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>("lend");
  const [loading, setLoading] = useState(false);

  const handleReturnConfirm = (id: number) => {
    // 반납 확인 로직 (현재는 더미)
    console.log("반납 확인:", id);
  };

  const items: TransactionItem[] = []; // 빌려준 아이템은 현재 빈 배열

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
            빌려준 내역
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

export default LentPage; 