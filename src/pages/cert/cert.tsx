// pages/cert/cert.tsx
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Header from "@/components/cert-header";

export default function Home() {
  const router = useRouter();

  // form values
  const [univ, setUniv] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");

  // 인증 상태 플래그
  const [isSchoolVerified, setSchoolVerified] = useState(false);
  const [isCodeSent, setCodeSent] = useState(false);

  // 사용자 메시지
  const [msg, setMsg] = useState<{
    text: string;
    type: "error" | "success";
  } | null>(null);

  // 재발송 카운트 & 쿨다운
  const [resendCount, setResendCount] = useState(0);
  const [cooldown, setCooldown] = useState(0);

  // 쿨다운 타이머
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown((c) => (c > 1 ? c - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  // 1) 학교 이름 인증
  const handleSchoolVerify = async () => {
    setMsg(null);
    const res = await fetch("/api/univcert/univ-check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ univName: univ }),
    });
    const json = await res.json();
    if (json.success) {
      setSchoolVerified(true);
      setMsg({ text: "학교 인증 완료", type: "success" });
    } else {
      setMsg({ text: json.message || "학교 이름 오류", type: "error" });
    }
  };

  // 2) 인증번호 발송
  const handleSendCode = async () => {
    setMsg(null);
    if (!isSchoolVerified)
      return setMsg({ text: "학교 인증을 먼저 해 주세요.", type: "error" });
    if (resendCount >= 3)
      return setMsg({ text: "재발송 최대 횟수(3회) 초과", type: "error" });
    if (cooldown > 0)
      return setMsg({ text: `재발송 대기중 ${cooldown}s`, type: "error" });

    await fetch("/api/univcert/clear", { method: "POST" });
    const res = await fetch("/api/univcert/send-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ univName: univ, email }),
    });
    const json = await res.json();
    if (json.success) {
      setCodeSent(true);
      setResendCount((c) => c + 1);
      setCooldown(30);
      setMsg({ text: "인증번호 발송 완료", type: "success" });
    } else {
      setMsg({ text: json.message || "발송 실패", type: "error" });
    }
  };

  // 3) 다음 버튼에 "코드 확인 + 이동" 합치기
  const handleNext = async () => {
    setMsg(null);
    if (!isCodeSent)
      return setMsg({ text: "인증번호를 먼저 발송해 주세요.", type: "error" });

    // 인증코드 검증
    const res = await fetch("/api/univcert/code-verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ univName: univ, email, code }),
    });
    const json = await res.json();
    if (!json.success) {
      return setMsg({ text: json.message || "코드 불일치", type: "error" });
    }

    // 성공 시 이동
    router.push("/cert/register");
  };

  return (
    <main>
      <Header />
      <div className="min-h-screen bg-gray-50 flex flex-col items-center pt-16">
        {/* 회원가입 제목 */}
        <h1 className="text-3xl font-bold mb-6 text-black">회원가입</h1>

        {/* Step Indicator */}
        <div className="flex justify-center space-x-4 mb-8">
        <div className="w-[178px] h-[56px] flex items-center bg-gray-200 rounded-lg px-[20px] py-[16px] space-x-2">            <span className="w-6 h-6 bg-black text-white rounded-lg flex items-center justify-center">
              1
            </span>
            <span className="font-medium text-gray-700">학교 이메일 인증</span>
          </div>
          <div className="flex items-center bg-gray-200 rounded-lg px-4 py-2 space-x-2">
            <span className="w-6 h-6 bg-gray-300 text-gray-500 rounded-lg flex items-center justify-center">
              2
            </span>
            <span className="font-medium text-gray-500">회원 정보 입력</span>
          </div>
          <div className="flex items-center bg-gray-200 rounded-lg px-4 py-2 space-x-2">
            <span className="w-6 h-6 bg-gray-300 text-gray-500 rounded-lg flex items-center justify-center">
              3
            </span>
            <span className="font-medium text-gray-500">가입 완료</span>
          </div>
        </div>

        {/* 인증 카드 */}
        <div className="w-[654px] h-[555px] bg-[#F5F5F5] p-8 rounded-2xl space-y-6">
          {/* 학교 */}
          <div>
            <label className="block mb-1 text-gray-700">학교</label>
            <div className="flex items-center space-x-5">
              <input
                className="flex-1 min-w-0 p-3 border border-gray-300 rounded-lg bg-white text-black placeholder-[#B3B3B3]"
                placeholder="학교 이름을 입력해 주세요."
                value={univ}
                onChange={(e) => setUniv(e.target.value)}
                disabled={isSchoolVerified}
              />
              <button
                className="w-[133px] h-[53px] flex-shrink-0 bg-[#4C4C4E] text-white rounded-lg text-center"
                onClick={handleSchoolVerify}
                disabled={isSchoolVerified || !univ.trim()}
              >
                학교 인증
              </button>
            </div>
          </div>

          {/* 학교 이메일 */}
          <div>
            <label className="block mb-1 text-gray-700">학교 이메일</label>
            <div className="flex items-center space-x-5">
              <input
                className="flex-1 p-3 border border-gray-300 rounded-lg bg-white text-black placeholder-[#B3B3B3]"
                placeholder="학교 이메일을 입력해 주세요."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isCodeSent}
              />
              <button
                className="w-32 py-3 bg-black text-white rounded-lg text-center"
                onClick={handleSendCode}
                disabled={
                  !isSchoolVerified || isCodeSent || !email.includes("@")
                }
              >
                {isCodeSent ? "재발송" : "인증번호 발송"}
              </button>
            </div>
          </div>

          {/* 인증번호 */}
          <div>
            <label className="block mb-1 text-gray-700">인증번호</label>
            <div className="flex items-center space-x-5">
              <input
                className="flex-1 p-3 border border-gray-300 rounded-lg bg-white text-black placeholder-[#B3B3B3]"
                placeholder="전송받은 인증번호를 입력해 주세요."
                value={code}
                onChange={(e) => setCode(e.target.value)}
                disabled={false}
              />
            </div>
          </div>

          {/* 메시지 */}
          {msg && (
            <p
              className={
                msg.type === "error" ? "text-red-600" : "text-green-600"
              }
            >
              {msg.text}
            </p>
          )}

          {/* 다음 버튼 (코드 확인 + 이동) */}
         <div className="flex justify-center  mt-[60px] bg-[#6849FE] w-[318px]  h-[53px] rounded-lg disabled:opacity-50 ">
            <button
              onClick={handleNext}
              disabled={!email || !code}
            >
              다음
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
