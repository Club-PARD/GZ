// src/pages/rentals/ApplyTab.tsx
import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import Pagination from "./Pagination";

interface ApplyData {
  postId: number;
  itemName: string;
  firstImageUrl: string;
  unitOfPeroid: "DAY" | "HOUR";
  peroid: number;
  totalPrice: number;
  applyStatus: "WAITING" | "ACCEPTED" | "REJECTED";
}

const ITEMS_PER_PAGE = 5;
const BLOCK_SIZE = 5;

const ApplyTab: React.FC = () => {
  const [items, setItems] = useState<ApplyData[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchApplies = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/apply/myApplies", {
        withCredentials: true,
      });
      if (res.data.success) {
        setItems(res.data.data as ApplyData[]);
      } else {
        console.error("신청 현황 조회 오류:", res.data.message);
        setItems([]);
      }
    } catch (err) {
      console.error("신청 현황 조회 실패:", err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplies();
  }, []);

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

  return (
    <>
      <div className="overflow-x-auto border-b border-gray-200">
        <div className="grid w-full [grid-template-columns:2fr_0.5fr_0.5fr] divide-y divide-x divide-gray-200 border-x border-gray-200 border-t text-gray-600 font-medium">
          {/* ── 헤더 ── */}
          <div className="px-6 py-4">물품 정보</div>
          <div className="px-6 py-4 text-center">대여 기간 및 가격</div>
          <div className="px-6 py-4 text-center">상태</div>

          {/* ── 로딩 스피너 or 데이터 행 ── */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 col-span-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              <p className="text-gray-500 mt-4">데이터를 불러오는 중...</p>
            </div>
          ) : currentItems.length > 0 ? (
            currentItems.map((d) => (
              <React.Fragment key={d.postId}>
                {/* 1) 물품 정보 */}
                <div className="flex items-center space-x-4 px-6 py-6">
                  <img
                    src={d.firstImageUrl}
                    alt={d.itemName}
                    className="w-20 h-20 rounded object-cover"
                  />
                  <div>
                    <div className="flex items-center font-semibold text-[#232323]">
                      {d.itemName}
                      <span className="ml-2 text-gray-400">&gt;</span>
                    </div>
                    <div className="text-sm text-gray-500">대여 신청</div>
                  </div>
                </div>
                {/* 2) 대여 기간 및 가격 */}
                <div className="flex flex-col justify-center items-center px-6 py-6 text-center">
                  <div className="text-sm text-gray-400 mb-1">
                    {d.peroid}
                    {d.unitOfPeroid === "DAY" ? "일" : "시간"}
                  </div>
                  <div className="text-lg font-bold">
                    {d.totalPrice.toLocaleString()}원
                  </div>
                </div>
                {/* 3) 상태 버튼 */}
                <div className="flex flex-col justify-center items-center px-6 py-6 text-center">
                  <button
                    disabled
                    className="flex w-[104px] h-[38px] flex-shrink-0 justify-center items-center gap-[6px] px-[16px] py-[8px] rounded-lg bg-[var(--Gray-05,#C2C3C9)]"
                  >
                    <span className="text-[var(--White,#FFF)] text-center text-[16px] font-semibold leading-[130%] tracking-[-0.32px]">
                      수락대기
                    </span>
                  </button>
                </div>
              </React.Fragment>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 col-span-3">
              <img
                src="/images/emptyfolder.svg"
                alt="신청 내역이 없어요"
                className="w-30 h-30"
              />
              <p className="text-gray-500 mt-4">신청한 내역이 없어요</p>
            </div>
          )}
        </div>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        currentBlockStart={currentBlockStart}
        currentBlockEnd={currentBlockEnd}
        handlePrevBlock={() =>
          setCurrentPage(Math.max(currentBlockStart - BLOCK_SIZE, 1))
        }
        handleNextBlock={() =>
          setCurrentPage(
            Math.min(currentBlockStart + BLOCK_SIZE, totalPages - BLOCK_SIZE + 1)
          )
        }
        setCurrentPage={setCurrentPage}
      />
    </>
  );
};

export default ApplyTab;
