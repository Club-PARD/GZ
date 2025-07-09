// components/Application.tsx
import React, { useState, useMemo } from "react";
import { CgClose, CgMathPlus, CgMathMinus } from "react-icons/cg";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  itemName: string;           // 서버에서 받아온 대여 물건 이름
  pricePerDay: number;        // 서버에서 받아온 1일 가격
  pricePerHour: number;       // 서버에서 받아온 1시간 가격
};

export default function Application({
  open,
  onClose,
  itemName,
  pricePerDay,
  pricePerHour,
}: ModalProps) {
  const [duration, setDuration] = useState(0);
  const [unit, setUnit] = useState<"일" | "시간">("일");

  const increase = () => setDuration(prev => prev + 1);
  const decrease = () => setDuration(prev => (prev > 0 ? prev - 1 : 0));

  // 단위에 따라 가격을 선택
  const unitPrice = useMemo(
    () => (unit === "일" ? pricePerDay : pricePerHour),
    [unit, pricePerDay, pricePerHour]
  );
  const totalPrice = useMemo(
    () => duration * unitPrice,
    [duration, unitPrice]
  );

  if (!open) return null;

  return (
    <div className="absolute inset-0 z-50 flex justify-center pt-[128px]">
      {/* 어두운 배경 */}
      <div className="fixed inset-0 bg-black/20" onClick={onClose} />

      {/* 모달 박스 */}
      <div className="relative z-50 w-[780px] h-[618px] bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col">
        {/* 헤더 */}
        <div className="h-[48px] bg-[#6849FE] flex items-center justify-end px-4">
          <CgClose
            onClick={onClose}
            className="w-6 h-6 text-white cursor-pointer"
          />
        </div>

        <div className="flex flex-col flex-1 px-[100px]">
          {/* 제목 */}
          <h2 className="mt-[44px] mb-[36px] text-center text-[24px] font-medium text-[#232323] leading-[130%]">
            대여 신청서
          </h2>

          {/* 테이블 */}
          <div className="flex-1 text-[#4C4C4E]">
            <table className="w-full border-collapse">
              <tbody>
                {/* 1행: 대여 물건 */}
                <tr className="border-t border-[#D8D9DF] w-[580px]">
                  <th className="w-[140px] bg-[#F9F9FA] px-[36px] py-[32px] text-center text-[#ADAEB2] text-[18px] font-medium leading-[130%] tracking-[-0.36px]">
                    대여 물건
                  </th>
                  <td className="pl-[32px] py-[32px] text-[18px] text-[#232323] font-medium leading-[130%]">
                    {itemName}
                  </td>
                </tr>

                {/* 2행: 대여 기간 */}
                <tr className="border-t border-[#F3F3F5] w-[580px]">
                  <th className="bg-[#F9F9FA] px-[36px] py-[32px] text-center text-[#ADAEB2] text-[18px] font-medium leading-[130%] tracking-[-0.36px]">
                    대여 기간
                  </th>
                  <td className="px-[32px] py-[32px]">
                    <div className="flex items-center space-x-[16px]">
                      <div className="border border-[#F3F3F5] rounded-lg flex items-center justify-center bg-[#F3F3F5]">
                        <CgMathPlus onClick={increase} className="w-10 h-10 text-xl" />
                        <span className="w-10 text-center text-base">{duration}</span>
                        <CgMathMinus onClick={decrease} className="w-10 h-10 text-xl" />
                      </div>
                      <div className="flex bg-[#F3F3F5] w-[144px] h-[48px] rounded-lg overflow-hidden text-[18px] font-medium leading-[130%]">
                        {(["일", "시간"] as const).map((u, i) => (
                          <button
                            key={u}
                            onClick={() => setUnit(u)}
                            className={`
                              flex-1 px-4 py-2 text-center text-sm font-medium
                              ${unit === u
                                ? `
                                  border border-[#6A5AE0]
                                  bg-[#EFEAFF] text-[#6A5AE0]
                                  ${i === 0 ? "rounded-l-lg" : "rounded-r-lg"}
                                `
                                : "text-gray-400"
                              }
                            `.replace(/\s+/g, " ").trim()}
                          >
                            {u}
                          </button>
                        ))}
                      </div>
                    </div>
                  </td>
                </tr>

                {/* 3행: 총 가격 */}
                <tr className="border-t border-[#F3F3F5] w-[580px]">
                  <th className="bg-[#F9F9FA] px-[36px] py-[32px] text-center text-[#ADAEB2] text-[18px] font-medium leading-[130%] tracking-[-0.36px]">
                    총 가격
                  </th>
                  <td className="px-6 py-8 text-base font-medium">
                    {totalPrice.toLocaleString()}원
                  </td>
                </tr>
                <tr className="border-t border-[#D8D9DF]"></tr>
              </tbody>
            </table>
          </div>

          {/* 동의 버튼 */}
          <div className="pt-8 pb-8">
            <button
              disabled={duration === 0}
              className={`w-full h-12 rounded-lg text-base font-medium ${
                duration === 0
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-[#6A5AE0] text-white"
              }`}
            >
              대여 서비스 이용 동의하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
