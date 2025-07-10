// components/Application.tsx
import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
import { CgClose, CgMathPlus, CgMathMinus } from "react-icons/cg";
import { PiCheckCircleFill } from "react-icons/pi";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  userId: number;       // 서버로 보낼 유저 ID
  postId: number;       // 서버로 보낼 포스트 ID
  itemName: string;
  pricePerDay: number;
  pricePerHour: number;
};

export default function Application({
  open,
  onClose,
  userId,
  postId,
  itemName,
  pricePerDay,
  pricePerHour,
}: ModalProps) {
  //— Props 로깅
  console.log("Application props:", {
    open,
    userId,
    postId,
    itemName,
    pricePerDay,
    pricePerHour,
  });

  //— 단계 관리
  const [step, setStep] = useState<1 | 2>(1);
  useEffect(() => {
    console.log("Modal open:", open);
    if (open) setStep(1);
  }, [open]);
  useEffect(() => {
    console.log("Current step:", step);
  }, [step]);

  //— 대여 기간 및 단위
  const [duration, setDuration] = useState(0);
  const [unit, setUnit] = useState<"일" | "시간">("일");
  useEffect(() => console.log("Duration:", duration), [duration]);
  useEffect(() => console.log("Unit:", unit), [unit]);
  const increase = () => setDuration((d) => d + 1);
  const decrease = () => setDuration((d) => (d > 0 ? d - 1 : 0));

  const unitPrice = useMemo(
    () => (unit === "일" ? pricePerDay : pricePerHour),
    [unit, pricePerDay, pricePerHour]
  );
  const totalPrice = useMemo(() => duration * unitPrice, [duration, unitPrice]);

  //— 약관 동의 상태
  const [checkedList, setCheckedList] = useState<boolean[]>(
    [false, false, false, false, false]
  );
  const allChecked = checkedList.every((v) => v);
  useEffect(() => {
    console.log("CheckedList:", checkedList);
    console.log("AllChecked:", allChecked);
  }, [checkedList, allChecked]);
  const toggleOne = (i: number) =>
    setCheckedList((prev) => prev.map((v, idx) => (idx === i ? !v : v)));
  const toggleAll = () =>
    setCheckedList((prev) => prev.map(() => !allChecked));

  //— 제출 핸들러 (axios 버전)
  const handleSubmit = async () => {
    if (!allChecked) return;

    // payload 생성 (unitOfPeriod 키명이 백엔드와 정확히 일치하는지 확인)
    const payload = {
      userId,
      postId,
      unitOfPeroid: unit === "일" ? "DAY" : "HOUR",
      peroid: duration,
      totalPrice,
    };

    // 디버깅용으로 payload 콘솔에 찍어보기
    console.log("Submitting payload ▶", payload);

    try {
      const response = await axios.post(
        "/api/apply/save",           // Next.js 프록시 엔드포인트
        payload,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      console.log("Server response ▶", response.data);
      alert("대여 신청이 완료되었습니다.");
      onClose();
    } catch (err: unknown) {
      console.error("Submit error ▶", err instanceof Error ? err.message : err);
      alert("오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

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

        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Step 1: 신청서 */}
          {step === 1 && (
            <div className="px-[100px] overflow-auto">
              <h2 className="mt-[44px] mb-[36px] text-center text-[24px] font-medium text-[#232323]">
                대여 신청서
              </h2>
              <table className="w-full border-collapse text-[#4C4C4E]">
                <tbody>
                  <tr className="border-t border-[#D8D9DF]">
                    <th className="w-[140px] bg-[#F9F9FA] px-[36px] py-[32px] text-center text-[#ADAEB2] text-[18px] font-medium">
                      대여 물건
                    </th>
                    <td className="pl-[32px] py-[32px] text-[18px] font-medium">
                      {itemName}
                    </td>
                  </tr>
                  <tr className="border-t border-[#F3F3F5]">
                    <th className="bg-[#F9F9FA] px-[36px] py-[32px] text-center text-[#ADAEB2] text-[18px] font-medium">
                      대여 기간
                    </th>
                    <td className="px-[32px] py-[32px]">
                      <div className="flex items-center space-x-[16px]">
                        <div className="border border-[#F3F3F5] rounded-lg flex items-center justify-center bg-[#F3F3F5] w-[160px] h-[48px]">
                          <CgMathMinus
                            onClick={decrease}
                            className="w-[20px] h-[20px] text-[#ADAEB2] cursor-pointer"
                          />
                          <span className="px-[42px] text-[18px] font-medium">
                            {duration}
                          </span>
                          <CgMathPlus
                            onClick={increase}
                            className="w-[20px] h-[20px] text-[#ADAEB2] cursor-pointer"
                          />
                        </div>
                        <div className="flex bg-[#F3F3F5] w-[144px] h-[48px] rounded-lg overflow-hidden text-[18px] font-medium">
                          {(["일", "시간"] as const).map((u, i) => (
                            <button
                              key={u}
                              onClick={() => setUnit(u)}
                              className={`
                                flex-1 px-4 py-2 text-center
                                ${unit === u
                                  ? `border border-[#6A5AE0] bg-[#EFEAFF] text-[#232323] ${i === 0 ? "rounded-l-lg" : "rounded-r-lg"
                                  }`
                                  : "text-gray-400"}
                              `.trim()}
                            >
                              {u}
                            </button>
                          ))}
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr className="border-t border-[#F3F3F5]">
                    <th className="bg-[#F9F9FA] px-[36px] py-[32px] text-center text-[#ADAEB2] text-[18px] font-medium">
                      총 가격
                    </th>
                    <td className="pl-[32px] py-[32px] text-[18px] font-medium">
                      {totalPrice.toLocaleString()}원
                    </td>
                  </tr>
                  <tr className="border-t border-[#D8D9DF]"></tr>
                </tbody>
              </table>
              <div className="pt-[48px] px-[210px] pb-[72px]">
                <button
                  onClick={() => setStep(2)}
                  disabled={duration === 0}
                  className={`w-[208px] h-[53px] rounded-lg text-[16px] font-medium ${duration === 0
                    ? "bg-[#C2C3C9] text-white cursor-not-allowed"
                    : "bg-[#6849FE] text-white"
                    }`}
                >
                  대여 서비스 이용 동의하기
                </button>
              </div>
            </div>
          )}

          {/* Step 2: 약관 동의서 */}
          {step === 2 && (
            <div className="flex flex-col h-full">
              {/* 고정 헤더 */}
              <div className="px-[60px] pt-[40px]">
                <div className="text-[16px] font-medium text-[#232323]">
                  대여 서비스 이용 동의서
                </div>
                <p className="mt-[8px] mb-[16px] text-[14px] text-[#616264]">
                  본 플랫폼을 통해 물품을 대여하는 모든 사용자는 아래 내용을 충분히 읽고 이해했으며, 이에 전적으로 동의해야 합니다.
                </p>
              </div>

              {/* 스크롤 영역 */}
              <div className="flex-1 overflow-auto px-[60px] space-y-[24px]">
                {[
                  {
                    title: "파손 및 분실 책임",
                    items: [
                      "대여 기간 동안 물품에 발생하는 모든 파손, 분실, 훼손에 대한 책임은 전적으로 사용자에게 있습니다.",
                      "만약 파손이나 분실이 발생할 경우, 해당 물품의 수리 비용 또는 물품가액에 상응하는 금액을 부담해야 합니다.",
                    ],
                  },
                  {
                    title: "반납 지연 및 연체 책임",
                    items: [
                      "약속된 반납 시간을 반드시 지켜야 하며, 지연 시 추가 이용료 또는 페널티가 부과될 수 있습니다.",
                      "반복적인 연체가 발생하면, 향후 대여가 제한될 수 있습니다.",
                    ],
                  },
                  {
                    title: "사진 등록 안내",
                    items: [
                      "물품 대여 전후 사진 촬영 및 등록은 권장 사항입니다.",
                      "사진을 등록하지 않을 경우, 향후 분쟁 발생 시 사용자에게 불리하게 작용할 수 있으며, 손해 발생 여부에 대한 입증 책임은 사용자에게 있습니다.",
                    ],
                  },
                  {
                    title: "사용 조건 및 주의사항 준수",
                    items: [
                      "물품 사용 전 안내된 주의사항과 조건을 반드시 확인하고 준수해야 합니다.",
                      "부주의나 규정 위반으로 인한 문제는 전적으로 사용자 본인의 책임입니다.",
                    ],
                  },
                  {
                    title: "분쟁 및 책임 이행",
                    items: [
                      "사용자 과실로 인한 모든 문제는 본 플랫폼 규정 및 이용 약관에 따라 처리됩니다.",
                      "필요 시 플랫폼은 사용자에게 손해 배상 등 책임 이행을 요구할 수 있습니다.",
                    ],
                  },
                ].map((term, idx) => (
                  <div key={idx}>
                    <div
                      className="flex items-center mb-[8px] cursor-pointer"
                      onClick={() => toggleOne(idx)}
                    >
                      {checkedList[idx] ? (
                        <PiCheckCircleFill size={24} className="text-[#6849FE]" />
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
                    <PiCheckCircleFill size={24} className="text-[#6849FE]" />
                  ) : (
                    <span className="w-[24px] h-[24px] border border-[#ADAEB2] rounded-full" />
                  )}
                  <span className="ml-[8px] text-[14px] font-medium text-[#828286]">
                    전체 내용에 동의합니다.
                  </span>
                </div>
                <button
                  onClick={handleSubmit}
                  disabled={!allChecked}
                  className={`w-full h-[53px] rounded-lg text-[16px] font-medium ${allChecked
                    ? "bg-[#6849FE] text-white"
                    : "bg-[#C2C3C9] text-white cursor-not-allowed"
                    }`}
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
