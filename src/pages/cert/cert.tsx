// pages/cert/cert.tsx
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Header from "@/components/cert-header";
import ErrorDialog from "@/components/ErrorDialog";
import { univCheck, sendCode, verifyCode } from "@/lib/firebase-functions";

export default function Home() {
  const router = useRouter();
  const [schoolName, setUniv] = useState("");
  const [studentMail, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [isSchoolVerified, setSchoolVerified] = useState(false);
  const [isCodeSent, setCodeSent] = useState(false);
  const [isSchoolVerifying, setIsSchoolVerifying] = useState(false);
  const [msg, setMsg] = useState<{
    text: string;
    type: "error" | "success";
  } | null>(null);
  const [errorDialog, setErrorDialog] = useState({
    isOpen: false,
    message: "",
  });
  const [resendCount, setResendCount] = useState(0);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown((c) => (c > 1 ? c - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  const handleSchoolVerify = async () => {
    setMsg(null);
    setIsSchoolVerifying(true);
    try {
      const result = await univCheck(schoolName);
      if (result.success) {
        setSchoolVerified(true);
        setMsg({ text: "학교 인증 완료", type: "success" });
      } else {
        setErrorDialog({
          isOpen: true,
          message: result.message || "학교 인증 실패",
        });
      }
    } catch (e) {
      const m = e instanceof Error ? e.message : "학교 인증 중 오류";
      setErrorDialog({ isOpen: true, message: m });
    } finally {
      setIsSchoolVerifying(false);
    }
  };

  const handleSendCode = async () => {
    setMsg(null);
    if (!isSchoolVerified) {
      setErrorDialog({ isOpen: true, message: "학교 인증을 먼저 해 주세요." });
      return;
    }
    if (resendCount >= 3) {
      setErrorDialog({ isOpen: true, message: "재발송 최대 횟수(3회) 초과" });
      return;
    }
    if (cooldown > 0) {
      setErrorDialog({ isOpen: true, message: `재발송 대기중 ${cooldown}s` });
      return;
    }
    try {
      const result = await sendCode(schoolName, studentMail);
      if (result.success) {
        setCodeSent(true);
        setResendCount((c) => c + 1);
        setCooldown(30);
        setMsg({ text: "인증번호 발송 완료", type: "success" });
        // 인증번호 확인
      } else {
        setErrorDialog({
          isOpen: true,
          message: result.message || "발송 실패",
        });
      }
    } catch (e) {
      const m = e instanceof Error ? e.message : "인증번호 발송 중 오류";
      setErrorDialog({ isOpen: true, message: m });
    }
  };

  const handleNext = async () => {
    setMsg(null);
    if (!isCodeSent) {
      setMsg({ text: "인증번호를 먼저 발송해 주세요.", type: "error" });
      return;
    }
    try {
      const result = await verifyCode(schoolName, studentMail, code);
      if (!result.success) {
        setMsg({ text: result.message!, type: "error" });
        return;
      }
      document.cookie = `schoolName=${encodeURIComponent(schoolName)}; path=/;`;
      document.cookie = `studentMail=${encodeURIComponent(studentMail)}; path=/;`;
      router.replace("/cert/register");
    } catch (e) {
      const m = e instanceof Error ? e.message : "인증번호 확인 중 오류";
      setErrorDialog({ isOpen: true, message: m });
    }
  };

  const closeErrorDialog = () => {
    setErrorDialog({ isOpen: false, message: "" });
  };

  return (
    <main>
      <Header />
      <ErrorDialog
        isOpen={errorDialog.isOpen}
        message={errorDialog.message}
        onClose={closeErrorDialog}
      />
      <div className="min-h-screen bg-[#F3F3F5] flex flex-col items-center p-[68px]">
        <h1 className="text-[32px] text-center font-bold mb-[28px] text-[#232323]">
          회원가입
        </h1>
        <div className="flex justify-center space-x-[20px] mb-[20px]">
          <div className="w-[180px] h-[56px] flex items-center bg-white rounded-lg px-[20px] py-[16px] space-x-2">
            <span className="w-[24px] h-[24px] bg-[#232323] text-white rounded-lg flex items-center justify-center font-bold">
              1
            </span>
            <span className="text-[#232323] font-bold">학교 이메일 인증</span>
          </div>
          <div className="w-[180px] h-[56px] flex items-center bg-white rounded-lg px-[20px] py-[16px] space-x-2">
            <span className="w-[24px] h-[24px] bg-[#ADAEB2] text-[#F3F3F5] rounded-lg flex items-center justify-center font-bold">
              2
            </span>
            <span className="text-[#ADAEB2] font-bold">회원 정보 입력</span>
          </div>
          <div className="w-[180px] h-[56px] flex items-center bg-white rounded-lg px-[20px] py-[16px] space-x-2">
            <span className="w-[24px] h-[24px] bg-[#ADAEB2] text-[#F3F3F5] rounded-lg flex items-center justify-center font-bold">
              3
            </span>
            <span className="font-bold text-[#ADAEB2]">회원가입 완료</span>
          </div>
        </div>
        <div className="w-[580px] h-[515px] bg-[#FFFFFF] px-[60px] pt-[52px] pb-[60px] rounded-2xl space-y-8 mb-[193px]">
          <div>
            <label className="block mb-[8px] text-[#232323]">학교</label>
            <div className="flex items-center space-x-[8px]">
              <input
                className="flex-1 w-[337px] h-[53px] p-[16px] border border-white rounded-lg bg-[#F3F3F5] text-black placeholder-[#C2C3C9]"
                placeholder="재학 중인 학교명을 입력해 주세요"
                value={schoolName}
                onChange={(e) => setUniv(e.target.value)}
                disabled={isSchoolVerified}
              />
              <button
                className={`w-[133px] h-[53px] text-white rounded-lg transition hover:opacity-90 ${
                  schoolName.trim() ? "bg-[#4C4C4E]" : "bg-[#C2C3C9]"
                }`}
                onClick={handleSchoolVerify}
                disabled={isSchoolVerified || !schoolName.trim() || isSchoolVerifying}
              >
                {isSchoolVerifying ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  </div>
                ) : (
                  "학교 확인하기"
                )}
              </button>
            </div>
          </div>
          <div>
            <label className="block mb-[8px] text-[#232323]">학교 메일</label>
            <div className="flex items-center space-x-[8px]">
              <input
                className="flex-1 w-[337px] h-[53px] p-[16px] border border-white rounded-lg bg-[#F3F3F5] text-black placeholder-[#C2C3C9]"
                placeholder="학교 메일을 정확하게 입력해 주세요"
                value={studentMail}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isCodeSent}
              />
              <button
                className={`w-[133px] h-[53px] text-white rounded-lg transition hover:opacity-90 ${
                  studentMail.trim() && isSchoolVerified && cooldown === 0
                    ? 'bg-[#4C4C4E]'
                    : 'bg-[#C2C3C9]'
                }`}
                onClick={handleSendCode}
                disabled={!isSchoolVerified || !studentMail.includes('@') || cooldown > 0}
              >
                {isCodeSent
                  ? cooldown > 0
                    ? `${cooldown}s 후 재발송`
                    : '재발송'
                  : '인증번호 받기'}
              </button>
            </div>
          </div>
          <div>
            <label className="block mb-1 text-gray-700">인증번호</label>
            <div className="flex items-center space-x-5">
              <input
                className="flex-1 w-[460px] h-[53px] p-[16px]  border border-[#F3F3F5] rounded-lg bg-[#F3F3F5] text-black"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>
          </div>
          {msg && (
            <p
              className={
                msg.type === "error" ? "text-red-600" : "text-green-600"
              }
            >
              {msg.text}
            </p>
          )}
          <div className="flex justify-center mt-[40px]">
            <button
              onClick={handleNext}
              disabled={!studentMail || !code}
              className={`w-[180px] h-[53px] text-white rounded-lg font-medium px-[24px] py-[16px] transition hover:opacity-90 ${
                studentMail.trim() && code.trim() ? "bg-[#6849FE]" : "bg-[#C2C3C9]"
              }`}
            >
              다음
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
