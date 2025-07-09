// components/Application.tsx
import React, { useState, useMemo, useEffect } from "react";
import { CgClose, CgMathPlus, CgMathMinus } from "react-icons/cg";
import { PiCheckCircleFill } from "react-icons/pi";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  itemName: string;
  pricePerDay: number;
  pricePerHour: number;
};

export default function Application({
  open,
  onClose,
  itemName,
  pricePerDay,
  pricePerHour,
}: ModalProps) {
  const [step, setStep] = useState<1 | 2>(1);

  useEffect(() => {
    if (open) {
      setStep(1);
    }
  }, [open]);

  const [duration, setDuration] = useState(0);
  const [unit, setUnit] = useState<"일" | "시간">("일");
  const increase = () => setDuration(d => d + 1);
  const decrease = () => setDuration(d => (d > 0 ? d - 1 : 0));

  const unitPrice = useMemo(
    () => (unit === "일" ? pricePerDay : pricePerHour),
    [unit, pricePerDay, pricePerHour]
  );
  const totalPrice = useMemo(() => duration * unitPrice, [duration, unitPrice]);

  const [checkedList, setCheckedList] = useState<boolean[]>([false, false, false, false, false]);
  const allChecked = checkedList.every(v => v);
  const toggleOne = (i: number) =>
    setCheckedList(prev => prev.map((v, idx) => (idx === i ? !v : v)));
  const toggleAll = () => setCheckedList(prev => prev.map(() => !allChecked));

  if (!open) return null;

  return (
    <div className="absolute inset-0 z-50 flex justify-center pt-[128px]">
      {/* 어두운 배경 */}
      <div className="fixed inset-0 bg-black/20" onClick={onClose} />

      {/* 모달 박스 */}
      <div className="relative z-50 w-[780px] h-[618px] bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col">
        {/* 헤더 */}
        <div className="h-[48px] bg-[#6849FE] flex items-center justify-end px-[18px] py-[12px]">
          <CgClose
            onClick={onClose}
            className="w-[24px] h-[24px] text-white cursor-pointer"
          />
        </div>

        <div className="flex-1 overflow-hidden flex flex-col">
          {step === 1 && (
            <div className="px-[100px]">
              {/* 제목 */}
              <h2 className="mt-[44px] mb-[36px] text-center text-[24px] font-medium text-[#232323] leading-[130%]">
                대여 신청서
              </h2>

              {/* 테이블 */}
              <div className="flex-1 text-[#4C4C4E]">
                <table className="w-full border-collapse">
                  <tbody>
                    {/* 대여 물건 */}
                    <tr className="border-t border-[#D8D9DF]">
                      <th className="w-[140px] bg-[#F9F9FA] px-[36px] py-[32px] text-center text-[#ADAEB2] text-[18px] font-medium leading-[130%] tracking-[-0.36px]">
                        대여 물건
                      </th>
                      <td className="pl-[32px] py-[32px] text-[18px] text-[#232323] font-medium leading-[130%] tracking-[-0.36px]">
                        {itemName}
                      </td>
                    </tr>

                    {/* 대여 기간 */}
                    <tr className="border-t border-[#F3F3F5]">
                      <th className="bg-[#F9F9FA] px-[36px] py-[32px] text-center text-[#ADAEB2] text-[18px] font-medium leading-[130%] tracking-[-0.36px]">
                        대여 기간
                      </th>
                      <td className="px-[32px] py-[32px]">
                        <div className="flex items-center space-x-[16px]">
                          <div className="border border-[#F3F3F5] rounded-lg flex items-center justify-center bg-[#F3F3F5] w-[160px] h-[48px]">
                            <CgMathMinus
                              onClick={decrease}
                              className="w-[20px] h-[20px] text-[#ADAEB2] cursor-pointer"
                            />
                            <span className="px-[42px] text-[18px] text-[#232323] font-medium leading-[130%] tracking-[-0.36px]">
                              {duration}
                            </span>
                            <CgMathPlus
                              onClick={increase}
                              className="w-[20px] h-[20px] text-[#ADAEB2] cursor-pointer"
                            />
                          </div>
                          <div className="flex bg-[#F3F3F5] w-[144px] h-[48px] rounded-lg overflow-hidden text-[18px] font-medium leading-[130%] tracking-[-0.36px]">
                            {(["일", "시간"] as const).map((u, i) => (
                              <button
                                key={u}
                                onClick={() => setUnit(u)}
                                className={`
                                  flex-1 px-4 py-2 text-center text-[18px] font-medium leading-[130%] tracking-[-0.36px]
                                  ${unit === u
                                    ? `
                                      border border-[#6A5AE0]
                                      bg-[#EFEAFF] text-[#232323]
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

                    {/* 총 가격 */}
                    <tr className="border-t border-[#F3F3F5]">
                      <th className="bg-[#F9F9FA] px-[36px] py-[32px] text-center text-[#ADAEB2] text-[18px] font-medium leading-[130%] tracking-[-0.36px]">
                        총 가격
                      </th>
                      <td className="pl-[32px] py-[32px] text-[18px] text-[#232323] font-medium leading-[130%] tracking-[-0.36px]">
                        {totalPrice.toLocaleString()}원
                      </td>
                    </tr>
                    <tr className="border-t border-[#D8D9DF]"></tr>
                  </tbody>
                </table>
              </div>

              {/* 동의 버튼 */}
              <div className="pt-[48px] px-[210px] pb-[72px]">
                <button
                  onClick={() => setStep(2)}
                  disabled={duration === 0}
                  className={`w-[208px] h-[53px] rounded-lg text-[16px] font-medium leading-[130%] tracking-[-0.36px]
                    ${duration === 0
                      ? "bg-[#C2C3C9] text-white cursor-not-allowed"
                      : "bg-[#6849FE] text-white"
                    }`}
                >
                  대여 서비스 이용 동의하기
                </button>
              </div>
            </div>
          )}

          {/* 2단계 */}
          {step === 2 && (
            <div className="flex flex-col h-full">
              {/* 고정 헤더 */}
              <div className="px-[60px] pt-[40px]">
                <div className="text-[16px] font-medium text-[#232323] leading-[130%] tracking-[-0.36px]">
                  대여 서비스 이용 동의서
                </div>
                <p className="mt-[8px] mb-[16px] text-[14px] text-[#616264] leading-[160%] tracking-[-0.28px]">
                  본 플랫폼을 통해 물품을 대여하는 모든 사용자는 아래 내용을 충분히 읽고 이해했으며, 이에 전적으로 동의해야 합니다.
                </p>
              </div>

              {/* 스크롤 가능한 약관 목록 */}
              <div className="flex-1 overflow-auto px-[60px] space-y-[24px]">
                {[ 
                  { title: "파손 및 분실 책임", items: [
                      "대여 기간 동안 물품에 발생하는 모든 파손, 분실, 훼손에 대한 책임은 전적으로 사용자에게 있습니다.",
                      "만약 파손이나 분실이 발생할 경우, 해당 물품의 수리 비용 또는 물품가액에 상응하는 금액을 부담해야 합니다.",
                    ]
                  },
                  { title: "반납 지연 및 연체 책임", items: [
                      "약속된 반납 시간을 반드시 지켜야 하며, 지연 시 추가 이용료 또는 페널티가 부과될 수 있습니다.",
                      "반복적인 연체가 발생하면, 향후 대여가 제한될 수 있습니다.",
                    ]
                  },
                  { title: "사진 등록 안내", items: [
                      "물품 대여 전후 사진 촬영 및 등록은 권장 사항입니다.",
                      "사진을 등록하지 않을 경우, 향후 분쟁 발생 시 사용자에게 불리하게 작용할 수 있으며, 손해 발생 여부에 대한 입증 책임은 사용자에게 있습니다.",
                    ]
                  },
                  { title: "사용 조건 및 주의사항 준수", items: [
                      "물품 사용 전 안내된 주의사항과 조건을 반드시 확인하고 준수해야 합니다.",
                      "부주의나 규정 위반으로 인한 문제는 전적으로 사용자 본인의 책임입니다.",
                    ]
                  },
                  { title: "분쟁 및 책임 이행", items: [
                      "사용자 과실로 인한 모든 문제는 본 플랫폼 규정 및 이용 약관에 따라 처리됩니다.",
                      "필요 시 플랫폼은 사용자에게 손해 배상 등 책임 이행을 요구할 수 있습니다.",
                    ]
                  },
                ].map((term, idx) => (
                  <div key={idx}>
                    <div
                      className="flex items-center mb-[8px] cursor-pointer"
                      onClick={() => toggleOne(idx)}
                    >
                      {checkedList[idx] ? (
                        <PiCheckCircleFill size={24} className="text-[#6849FE] w-[24px] h-[24px]" />
                      ) : (
                        <span className="w-[24px] h-[24px] border border-[#ADAEB2] rounded-full" />
                      )}
                      <span className="ml-[8px] text-[14px] font-medium text-[#232323]">
                        {term.title}
                      </span>
                    </div>
                    <div className="border border-[#D8D9DF] rounded-lg p-[12px] text-[14px] text-[#4C4C4E]">
                      <ul className="list-disc pl-[16px] space-y-[4px]">
                        {term.items.map((line, i) => (
                          <li key={i}>{line}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>

              {/* 고정 푸터 */}
              <div className="px-[60px] pb-[40px] mt-[24px]">
                <div
                  className="flex items-center mb-[16px] h-[46px] border border-[#F3F3F5] bg-[#F3F3F5] rounded-lg px-[16px] cursor-pointer"
                  onClick={toggleAll}
                >
                  {allChecked ? (
                    <PiCheckCircleFill size={24} className="text-[#6849FE] w-[24px] h-[24px]" />
                  ) : (
                    <span className="w-[24px] h-[24px] border border-[#ADAEB2] rounded-full" />
                  )}
                  <span className="ml-[8px] text-[14px] font-medium text-[#828286]">
                    전체 내용에 동의합니다.
                  </span>
                </div>
                <button
                  disabled={!allChecked}
                  className={`w-full h-[53px] rounded-lg text-[16px] font-medium leading-[130%] tracking-[-0.36px]
                    ${allChecked ? "bg-[#6849FE] text-white" : "bg-[#C2C3C9] text-white cursor-not-allowed"}`}
                >
                  대여 신청하기
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
