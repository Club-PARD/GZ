import React from "react";
import { TransactionItem, Tab, RequestItem } from "./rentals";
import axios from "axios";

interface TransactionRowProps {
  item: TransactionItem | RequestItem;
  activeTab: Tab;
  handleReturnConfirm: (id: number) => void;
}

const TransactionRow: React.FC<TransactionRowProps> = ({ item, activeTab, handleReturnConfirm }) => {
  // RequestItem인 경우 첫 번째 신청자 정보를 사용
  const isRequestItem = activeTab === "request" && "applyList" in item;
  
  if (isRequestItem && item.applyList.length === 0) {
    return null; // 신청자가 없으면 렌더링하지 않음
  }

  const requestItem = isRequestItem ? item : null;
  const transactionItem = !isRequestItem ? item as TransactionItem : null;
  
  // RequestItem의 경우 첫 번째 신청자 정보 사용
  const firstApply = requestItem?.applyList[0];
  
  // 표시할 데이터 결정
  const displayData = {
    title: requestItem?.itemName || transactionItem?.title || "",
    imageUrl: firstApply?.firstImageUrl || transactionItem?.imageUrl || "",
    duration: firstApply ? `${firstApply.period}${firstApply.unitOfPeriod === "DAY" ? "일" : "시간"}` : transactionItem?.duration || "",
    price: firstApply?.totalPrice || transactionItem?.price || 0,
    status: transactionItem?.status || "",
    category: transactionItem?.category || "대여 신청",
  };

  // 더미 수락/거절 핸들러
  const handleAccept = async () => {
    if (!isRequestItem || !requestItem) return;
    const firstApply = requestItem.applyList[0];
    const applyId = firstApply?.applyId;
    if (!applyId) return;
    try {
      await axios.delete(`/api/apply/ok?applyId=${applyId}`);
      alert('신청을 수락했습니다.');
      if (typeof window !== 'undefined') window.location.reload();
    } catch (e) {
      alert('신청 수락에 실패했습니다.');
    }
  };

  const handleReject = async () => {
    if (!isRequestItem || !requestItem) return;
    const firstApply = requestItem.applyList[0];
    const applyId = firstApply?.applyId;
    if (!applyId) return;
    try {
      await axios.delete(`/api/apply/no?applyId=${applyId}`);
      alert('신청을 거절했습니다.');
      if (typeof window !== 'undefined') window.location.reload();
    } catch (e) {
      alert('신청 거절에 실패했습니다.');
    }
  };

  return (
    <>
      {/* 1) 물품 정보 */}
      <div className="flex items-center space-x-4 px-6 py-6">
        <img src={displayData.imageUrl} alt={displayData.title} className="w-20 h-20 rounded object-cover" />
        <div>
          <div className="flex items-center font-semibold text-[#232323]">
            {displayData.title}
            <span className="ml-2 text-gray-400">&gt;</span>
          </div>
          <div className="text-sm text-gray-500">{displayData.category}</div>
          {isRequestItem && firstApply && (
            <div className="text-sm text-gray-400">신청자: {firstApply.applierNickname}</div>
          )}
        </div>
      </div>

      {/* 2) 대여 기간 및 가격 */}
      <div className="flex flex-col justify-center items-center px-6 py-6 text-center">
        <div className="text-sm text-gray-400 mb-1">{displayData.duration}</div>
        <div className="text-lg font-bold">{displayData.price.toLocaleString()}원</div>
      </div>

      {/* 3) 상태 버튼 */}
      <div className="flex flex-col justify-center items-center space-y-2 px-6 py-6">
        {activeTab === "borrow" ? (
          <button
            className={`flex w-[104px] h-[38px] flex-shrink-0 justify-center items-center gap-[6px] px-[16px] py-[8px] rounded-lg ${
              displayData.status === "거래 중" ? "bg-[var(--Purple-04,#6849FE)]" : "bg-[var(--Gray-05,#C2C3C9)]"
            }`}
            disabled
          >
            <span className="text-[var(--White,#FFF)] text-center [font-family:'Pretendard Variable'] text-[16px] font-semibold leading-[130%] tracking-[-0.32px]">
              {displayData.status === "거래 중" ? "대여 중" : "대여 완료"}
            </span>
          </button>
        ) : activeTab === "lend" ? (
          <button
            onClick={() => handleReturnConfirm(transactionItem?.id || 0)}
            disabled={displayData.status === "반납 완료"}
            className={`flex w-[104px] h-[38px] flex-shrink-0 justify-center items-center gap-[6px] px-[16px] py-[8px] rounded-lg ${
              displayData.status === "반납 완료" ? "bg-[var(--Gray-05,#C2C3C9)]" : "bg-[var(--Purple-04,#6849FE)]"
            }`}
          >
            <span className="text-[var(--White,#FFF)] text-center [font-family:'Pretendard Variable'] text-[16px] font-semibold leading-[130%] tracking-[-0.32px]">
              {displayData.status === "반납 완료" ? "반납 완료" : "반납 확인"}
            </span>
          </button>
        ) : (
          <>
            <button 
              onClick={handleReject}
              className="flex w-[104px] h-[38px] flex-shrink-0 justify-center items-center gap-[6px] px-[16px] py-[8px] rounded-lg bg-[var(--Gray-05,#C2C3C9)]"
            >
              <div className="text-[var(--White,#FFF)] text-center [font-family:'Pretendard Variable'] text-[16px] font-semibold leading-[130%] tracking-[-0.32px]">
                신청거절
              </div>
            </button>
            <button 
              onClick={handleAccept}
              className="flex w-[104px] h-[38px] flex-shrink-0 justify-center items-center gap-[6px] px-[16px] py-[8px] rounded-lg bg-[var(--Purple-04,#6849FE)]"
            >
              <div className="text-[var(--White,#FFF)] text-center [font-family:'Pretendard Variable'] text-[16px] font-semibold leading-[130%] tracking-[-0.32px]">
                신청수락
              </div>
            </button>
          </>
        )}
      </div>
    </>
  );
};

export default TransactionRow;
