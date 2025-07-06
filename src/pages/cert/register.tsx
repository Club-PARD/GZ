// pages/cert/register.tsx
import { GetServerSideProps } from "next";
import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Header from "@/components/cert-header";
import { PiCheckCircleFill } from "react-icons/pi";

// 쿠키 파싱 헬퍼 (원본 그대로)
function parseCookies(cookieHeader?: string): Record<string, string> {
  const list: Record<string, string> = {};
  if (!cookieHeader) return list;
  cookieHeader.split(";").forEach((pair) => {
    const [rawKey, rawVal] = pair.split("=");
    if (rawKey && rawVal) {
      list[rawKey.trim()] = decodeURIComponent(rawVal.trim());
    }
  });
  return list;
}

type Props = {
  studentMail: string;
  schoolName: string;
};

export default function Register({ studentMail, schoolName }: Props) {
  const router = useRouter();
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [msg, setMsg] = useState<{
    text: string;
    type: "error" | "success";
  } | null>(null);

  const handleNicknameCheck = async () => {
    if (!nickname.trim()) {
      setMsg({ text: "닉네임을 입력해 주세요.", type: "error" });
      return;
    }
    if (nickname.length > 10) {
      setMsg({ text: "닉네임은 10자 이하로 입력해주세요.", type: "error" });
      return;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMsg(null);

    if (!nickname.trim()) {
      return setMsg({ text: "닉네임을 입력해 주세요.", type: "error" });
    }
    if (password.length < 8) {
      return setMsg({
        text: "비밀번호는 8자 이상이어야 합니다.",
        type: "error",
      });
    }
    if (!agreeTerms || !agreePrivacy) {
      return setMsg({ text: "필수 약관에 모두 동의해 주세요.", type: "error" });
    }

    try {
      const { data } = await axios.post("/api/auth/signUp", {
        studentMail,
        schoolName,
        nickname,
        password,
      });
      console.log("회원가입 응답:", data);

      if (data.success === true) {
        setMsg({ text: "회원가입이 완료되었습니다.", type: "success" });
        setTimeout(() => {
          router.push("/cert/success");
        }, 1000);
      } else {
        setMsg({
          text: data.message || "회원가입에 실패했습니다.",
          type: "error",
        });
      }
    } catch (error: any) {
      console.error("회원가입 에러:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "회원가입에 실패했습니다.";
      setMsg({ text: errorMessage, type: "error" });
    }
  };

  return (
    <main>
      <Header />
      <div className="min-h-screen bg-[#F3F3F5] flex flex-col items-center pt-16">
        {/* 제목 */}
        <h1 className="text-3xl font-bold mb-6 text-black">회원가입</h1>

        <div className="flex justify-center space-x-[20px] mb-8">
          <div className="w-[180px] h-[56px] flex items-center bg-white rounded-lg px-[20px] py-[16px] space-x-2">
            <span className="w-[24px] h-[24px] bg-[#ADAEB2] text-[#F3F3F5] rounded-lg flex items-center justify-center font-bold">
              1
            </span>
            <span className="text-[#ADAEB2] font-bold">학교 이메일 인증</span>
          </div>
          <div className="w-[180px] h-[56px] flex items-center bg-white rounded-lg px-[20px] py-[16px] space-x-2">
            <span className="w-[24px] h-[24px] bg-[#232323] text-white rounded-lg flex items-center justify-center font-bold">
              2
            </span>
            <span className="text-[#232323] font-bold">회원 정보 입력</span>
          </div>
          <div className="w-[180px] h-[56px] flex items-center bg-white rounded-lg px-[20px] py-[16px] space-x-2">
            <span className="w-[24px] h-[24px] bg-[#ADAEB2] text-[#F3F3F5] rounded-lg flex items-center justify-center font-bold">
              3
            </span>
            <span className="font-bold text-[#ADAEB2]">회원가입 완료</span>
          </div>
        </div>

        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          className="w-[580px] h-[638px] bg-[#FFFFFF] px-[60px] rounded-2xl mb-[70px]"
        >
          {/* 아이디(이메일) */}
          <div>
            <label className="block pl-[4px] mb-[8px] text-[#232323] mt-[52px]">
              아이디
            </label>
            <input
              type="email"
              value={studentMail}
              readOnly
              className="w-[460px] h-[53px] p-[16px] border border-[#F3F3F5] rounded-lg bg-[#F3F3F5] text-[#232323]"
            />
          </div>

          {/* 닉네임 */}
          <div>
            <label className="block pl-[4px] mb-[8px] text-[#232323] mt-[32px]">
              닉네임
            </label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => {
                setNickname(e.target.value);
                setMsg(null);
              }}
              placeholder="최대 10자"
              className="w-[460px] h-[53px] p-[16px] border border-[#F3F3F5] rounded-lg bg-[#F3F3F5] text-[#232323] placeholder-[#C2C3C9]"
            />
          </div>

          {/* 비밀번호 */}
          <div>
            <label className="block pl-[4px] mb-[8px] text-[#232323] mt-[32px]">
              비밀번호
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-[460px] h-[53px] p-[16px] border border-[#F3F3F5] rounded-lg bg-[#F3F3F5] text-[#232323]"
            />
            <p className="mt-[4px] text-sm text-[#828286] ml-[4px]">
              영문, 숫자, 특수문자 조합 8자~16자
            </p>
          </div>

          {/* 지구(ZIGU) 서비스 동의 */}
          <div className="space-y-3">
            <p className="block pl-[4px] mb-[8px] text-[#232323] mt-[32px] text-[16px]">
              지구(ZIGU) 서비스 동의
            </p>

            {/* 이용약관 동의 */}
            <label
              className="flex items-center mt-[12px] cursor-pointer"
              onClick={() => setAgreeTerms((prev) => !prev)}
            >
              {agreeTerms ? (
                <PiCheckCircleFill size={24} className="text-[#6849FE]" />
              ) : (
                <span className="w-[24px] h-[24px] border-2 border-[#ADAEB2] rounded-full" />
              )}
              <span className="ml-2 text-[#232323]">
                [필수] 서비스 이용약관에 동의합니다.
              </span>
            </label>

            {/* 개인정보 동의 */}
            <label
              className="flex items-center mt-[8px] cursor-pointer"
              onClick={() => setAgreePrivacy((prev) => !prev)}
            >
              {agreePrivacy ? (
                <PiCheckCircleFill size={24} className="text-[#6849FE]" />
              ) : (
                <span className="w-[24px] h-[24px] border-2 border-[#ADAEB2] rounded-full" />
              )}
              <span className="ml-2 text-[#232323]">
                [필수] 개인정보 수집∙이용에 동의합니다.
              </span>
            </label>
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

          {/* 다음 버튼 */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={
                !nickname ||
                password.length < 8 ||
                !agreeTerms ||
                !agreePrivacy
              }
              className={`justify items-center w-[180px] h-[53px] px-[24px] py-[16px] text-white rounded-lg mt-[28px] mb-[48px] ${
                nickname &&
                password.length >= 8 &&
                agreeTerms &&
                agreePrivacy
                  ? "bg-[#6849FE]"
                  : "bg-[#C2C3C9]"
              }`}
            >
              다음
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

// SSR: 쿠키에서 studentMail, schoolName 꺼내서 props로 넘기기
export const getServerSideProps: GetServerSideProps<Props> = async ({
  req,
}) => {
  const cookies = parseCookies(req.headers.cookie);
  const studentMail = cookies.studentMail || "";
  const schoolName = cookies.schoolName || "";

  if (!studentMail) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: { studentMail, schoolName },
  };
};
