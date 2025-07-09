import React from "react";
import { TransactionItem, Tab } from "./rentals";

interface TransactionRowProps {
  item: TransactionItem;
  activeTab: Tab;
  handleReturnConfirm: (id: number) => void;
}

const TransactionRow: React.FC<TransactionRowProps> = ({ item, activeTab, handleReturnConfirm }) => (
  <>
    {/* 1) 물품 정보 */}
    <div className="flex items-center space-x-4 px-6 py-6">
      <img src={item.imageUrl} alt={item.title} className="w-20 h-20 rounded object-cover" />
      <div>
        <div className="flex items-center font-semibold text-[#232323]">
          {item.title}
          <span className="ml-2 text-gray-400">&gt;</span>
        </div>
        <div className="text-sm text-gray-500">{item.category}</div>
      </div>
    </div>

    {/* 2) 대여 기간 및 가격 */}
    <div className="flex flex-col justify-center items-center px-6 py-6 text-center">
      <div className="text-sm text-gray-400 mb-1">{item.duration}</div>
      <div className="text-lg font-bold">{item.price.toLocaleString()}원</div>
    </div>

    {/* 3) 상태 버튼 */}
    <div className="flex flex-col justify-center items-center space-y-2 px-6 py-6">
      {activeTab === "borrow" ? (
        <button
          className={`flex w-[104px] h-[38px] flex-shrink-0 justify-center items-center gap-[6px] px-[16px] py-[8px] rounded-lg ${
            item.status === "거래" ? "bg-[var(--Purple-04,#6849FE)]" : "bg-[var(--Gray-05,#C2C3C9)]"
          }`}
        >
          <span className="text-[var(--White,#FFF)] text-center [font-family:'Pretendard Variable'] text-[16px] font-semibold leading-[130%] tracking-[-0.32px]">
            {item.status === "거래" ? "대여 중" : "반납 완료"}
          </span>
        </button>
      ) : activeTab === "lend" ? (
        <button
          onClick={() => handleReturnConfirm(item.id)}
          disabled={item.status === "반납 완료"}
          className={`flex w-[104px] h-[38px] flex-shrink-0 justify-center items-center gap-[6px] px-[16px] py-[8px] rounded-lg ${
            item.status === "반납 완료" ? "bg-[var(--Gray-05,#C2C3C9)]" : "bg-[var(--Purple-04,#6849FE)]"
          }`}
        >
          <span className="text-[var(--White,#FFF)] text-center [font-family:'Pretendard Variable'] text-[16px] font-semibold leading-[130%] tracking-[-0.32px]">
            {item.status === "반납 완료" ? "반납 완료" : "반납 확인"}
          </span>
        </button>
      ) : (
        <>
          <button className="flex w-[104px] h-[38px] flex-shrink-0 justify-center items-center gap-[6px] px-[16px] py-[8px] rounded-lg bg-[var(--Gray-05,#C2C3C9)]">
            <div className="text-[var(--White,#FFF)] text-center [font-family:'Pretendard Variable'] text-[16px] font-semibold leading-[130%] tracking-[-0.32px]">
              신청거절
            </div>
          </button>
          <button className="flex w-[104px] h-[38px] flex-shrink-0 justify-center items-center gap-[6px] px-[16px] py-[8px] rounded-lg bg-[var(--Purple-04,#6849FE)]">
            <div className="text-[var(--White,#FFF)] text-center [font-family:'Pretendard Variable'] text-[16px] font-semibold leading-[130%] tracking-[-0.32px]">
              신청수락
            </div>
          </button>
        </>
      )}
    </div>
  </>
);

export default TransactionRow;
