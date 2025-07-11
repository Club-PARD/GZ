// src/lib/firebase-functions.ts

// 반환 타입
export interface FuncResult {
  success: boolean;
  message?: string;
  // sendCode 에만 포함됩니다.
  code?: string;
}

// 실제 배포된 Functions 엔드포인트
const FUNCTIONS_BASE_URL = "https://us-central1-chat-d845e.cloudfunctions.net";

// fetch + JSON 파싱만 담당. 에러(네트워크 에러)만 throw 합니다.
async function callFunctionRaw(functionName: string, data: unknown) {
  try {
    const response = await fetch(`${FUNCTIONS_BASE_URL}/${functionName}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    // 실패해도 JSON으로 파싱 시도
    const json = await response.json().catch(() => ({}));
    return { response, json };
  } catch (e) {
    throw new Error(`네트워크 오류: ${(e as Error).message}`);
  }
}

// 1) 학교 이름 인증
export async function univCheck(univName: string): Promise<FuncResult> {
  const { response, json } = await callFunctionRaw("univCheck", { univName });
  // response.ok가 아닌 실제 응답 데이터의 success 필드를 확인
  if (response.ok && json.success) {
    return { success: true };
  }
  return {
    success: false,
    message: json.message || "학교 인증에 실패했습니다.",
  };
}

// 2) 인증번호 발송
export async function sendCode(
  univName: string,
  email: string
): Promise<FuncResult> {
  const { response, json } = await callFunctionRaw("sendCode", {
    univName,
    email,
  });
  if (response.ok) {
    return {
      success: true,
      code: json.data?.code,
      message: json.message || "인증번호가 발송되었습니다.",
    };
  }
  return {
    success: false,
    message: json.message || "인증번호 발송에 실패했습니다.",
  };
}

// 3) 인증번호 확인
export async function verifyCode(
  univName: string,
  email: string,
  code: string
): Promise<FuncResult> {
  const { response, json } = await callFunctionRaw("verifyCode", {
    univName,
    email,
    code,
  });
  if (response.ok) {
    return { success: true };
  }
  if (response.status === 400) {
    return {
      success: false,
      message: json.message || "인증번호가 일치하지 않습니다.",
    };
  }
  return {
    success: false,
    message: json.message || `서버 오류 (${response.status})`,
  };
}

// 4) 회원가입
export async function register(
  email: string,
  univ: string,
  nickname: string,
  password: string
): Promise<FuncResult> {
  const { response, json } = await callFunctionRaw("register", {
    email,
    univ,
    nickname,
    password,
  });
  if (response.ok) {
    return { success: true };
  }
  return {
    success: false,
    message: json.message || "회원가입에 실패했습니다.",
  };
}

// 5) 로그인
export async function login(
  email: string,
  password: string
): Promise<FuncResult> {
  const { response, json } = await callFunctionRaw("login", {
    email,
    password,
  });
  if (response.ok) {
    return { success: true };
  }
  return {
    success: false,
    message: json.message || "로그인에 실패했습니다.",
  };
}
