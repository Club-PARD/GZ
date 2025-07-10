// src/pages/rentals/index.tsx
import React, { useState } from "react";
import Header from "@/components/home-header";
import Footer from "@/components/Footer";
import TabNav from "./TabNav";
import BorrowedTab from "./BorrowedTab";
import LentTab from "./LentTab";
import RequestsTab from "./RequestsTab";
import { Tab } from "./rentals";

const RentalsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>("borrow");
  const [currentPage, setCurrentPage] = useState(1);

  const handleReturnConfirm = (id: number) => {
    // 반납 확인 로직 (현재는 더미)
    console.log("반납 확인:", id);
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case "borrow":
        return <BorrowedTab handleReturnConfirm={handleReturnConfirm} />;
      case "lend":
        return <LentTab handleReturnConfirm={handleReturnConfirm} />;
      case "request":
        return <RequestsTab handleReturnConfirm={handleReturnConfirm} />;
      default:
        return <BorrowedTab handleReturnConfirm={handleReturnConfirm} />;
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
            setActiveTab={setActiveTab}
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
