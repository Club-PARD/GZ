// src/pages/rentals/index.tsx
import React, { useState } from "react";
import axios from "axios";
import Header from "@/components/home-header";
import Footer from "@/components/Footer";
import TabNav from "./TabNav";
import BorrowedTab from "./BorrowedTab";
import LentTab from "./LentTab";
import RequestsTab from "./RequestsTab";
import ApplyTab from "./ApplyTab";
import { useRouter } from "next/router";

type Tab = "borrow" | "lend" | "request" | "apply";

const api = axios.create({
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

const RentalsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>("borrow");
  const [reloadTrigger, setReloadTrigger] = useState(0);
  const router = useRouter();

  const handleReturnConfirm = async (id: number) => {
    try {
      const res = await api.patch("/api/borrowed/return", null, {
        params: { borrowedId: id },
      });
      if (!res.data.success) {
        console.error("반납 요청 오류:", res.data.message);
      } else {
        setReloadTrigger((prev) => prev + 1);
        router.push("/items"); // 반납 성공 시 내 물건 페이지로 이동(새로고침)
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
      case "apply":
        return <ApplyTab />;
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
              px-106 text-[32px] leading-[130%] tracking-[-0.64px]
            `}
          >
            거래 내역
          </h1>

          <TabNav
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            setCurrentPage={() => {}}
          />

          {renderActiveTab()}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RentalsPage;
