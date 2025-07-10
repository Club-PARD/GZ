// src/pages/rentals/index.tsx
import React, { useState } from "react";
import axios from "axios";
import Header from "@/components/home-header";
import Footer from "@/components/Footer";
import TabNav from "./TabNav";
import BorrowedTab from "./BorrowedTab";
import LentTab from "./LentTab";
import RequestsTab from "./RequestsTab";
import { Tab } from "./rentals";

// axios 인스턴스
const api = axios.create({
  withCredentials: true,                     // 쿠키 포함
  headers: { "Content-Type": "application/json" },
});

const RentalsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>("borrow");
  const [currentPage, setCurrentPage] = useState(1);
  // 탭 간 연동용 리로드 트리거
  const [reloadTrigger, setReloadTrigger] = useState(0);

  const handleReturnConfirm = async (id: number) => {
    try {
      const res = await api.patch("/api/borrowed/return", null, {
        params: { borrowedId: id },
      });
      if (!res.data.success) {
        console.error("반납 요청 오류:", res.data.message);
      } else {
        // PATCH 성공 시 모든 탭을 다시 불러오기
        setReloadTrigger((prev) => prev + 1);
      }
    } catch (err) {
      console.error("반납 요청 실패:", err);
    }
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case "borrow":
        return (
          <BorrowedTab
            handleReturnConfirm={handleReturnConfirm}
            reloadTrigger={reloadTrigger}
          />
        );
      case "lend":
        return (
          <LentTab
            handleReturnConfirm={handleReturnConfirm}
            reloadTrigger={reloadTrigger}
          />
        );
      case "request":
        return <RequestsTab handleReturnConfirm={handleReturnConfirm} />;
      default:
        return (
          <BorrowedTab
            handleReturnConfirm={handleReturnConfirm}
            reloadTrigger={reloadTrigger}
          />
        );
    }
  };

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
            setActiveTab={(tab) => {
              setActiveTab(tab);
              setCurrentPage(1);
            }}
            setCurrentPage={setCurrentPage}
          />

          {renderActiveTab()}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RentalsPage;
