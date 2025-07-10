import React from "react";
import { Tab } from "../../lib/rentals.types";

interface TabNavProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  setCurrentPage: (page: number) => void;
}

const TabNav: React.FC<TabNavProps> = ({ activeTab, setActiveTab, setCurrentPage }) => (
  <div className="flex justify-center space-x-5 mb-10">
    {(["borrow","lend","request"] as Tab[]).map((tab) => {
      const label = tab === "borrow" ? "빌린 내역" : tab === "lend" ? "빌려준 내역" : "대여 요청";
      const isActive = activeTab === tab;
      return (
        <button
          key={tab}
          className={`pb-1 ${
            isActive
              ? "border-b-2 border-[#232323] text-[#232323] text-center  text-[22px] font-semibold leading-[130%] tracking-[-0.44px] "
              : "text-[#C2C3C9] text-center  text-[22px] font-semibold leading-[130%] tracking-[-0.44px] "
          }`}
          onClick={() => {
            setActiveTab(tab);
            setCurrentPage(1);
          }}
        >
          {label}
        </button>
      );
    })}
  </div>
);

export default TabNav;
