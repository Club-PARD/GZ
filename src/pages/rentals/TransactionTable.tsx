import React from "react";
import { TransactionItem, Tab, RequestItem } from "./rentals";
import TransactionRow from "./TransactionRow";

interface TransactionTableProps {
  currentItems: (TransactionItem | RequestItem)[];
  activeTab: Tab;
  handleReturnConfirm: (id: number) => void;
  loading?: boolean;
}

const TransactionTable: React.FC<TransactionTableProps> = ({
  currentItems,
  activeTab,
  handleReturnConfirm,
  loading = false,
}) => (
  <div className="overflow-x-auto border-b border-gray-200">
    <div className="grid w-full [grid-template-columns:2fr_0.5fr_0.5fr] divide-y divide-x divide-gray-200 border-x border-gray-200 text-gray-600 font-medium border-t border-gray-200">
      <div className="px-6 py-4">물품 정보</div>
      <div className="px-6 py-4 text-center">대여 기간 및 가격</div>
      <div className="px-6 py-4 text-center">상태</div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 col-span-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <p className="text-gray-500 mt-4">데이터를 불러오는 중...</p>
        </div>
      ) : currentItems.length > 0 ? (
        currentItems.map((item, index) => (
          <React.Fragment key={activeTab === "request" ? index : (item as TransactionItem).id}>
            <TransactionRow
              item={item}
              activeTab={activeTab}
              handleReturnConfirm={handleReturnConfirm}
            />
          </React.Fragment>
        ))
      ) : (
        <div className="flex flex-col items-center justify-center py-20 col-span-3">
          <img
            src="/images/emptyfolder.svg"
            alt="등록된 물건이 없어요"
            className="w-30 h-30 flex-shrink-0"
          />
          <p className="text-gray-500 mb-6">등록한 물건이 없어요</p>
        </div>
      )}
    </div>
  </div>
);

export default TransactionTable;
