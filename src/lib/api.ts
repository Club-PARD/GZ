import axios from 'axios'

// 백엔드 API base URL (Next.js 프록시 사용 - 상대 경로)
const API_BASE_URL = ''

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true,  // 쿠키 인증 기본 설정
  headers: {
    'Content-Type': 'application/json',
  },
})

// 닉네임 중복 확인
export const checkNickname = async (nickname: string) => {
  const response = await api.post('/api/auth/check-nickname', { 
    nickname: nickname 
  })
  return response.data
}

// 회원가입
export const register = async (email: string, university: string, nickname: string, password: string) => {
  const response = await api.post('/api/auth/signUp', {
    email,
    university,
    nickname,
    password
  })
  return response.data
}

// 로그인
export const login = async (email: string, password: string) => {
  const response = await api.post('/api/auth/login', {
    email,
    password
  })
  return response.data
}

// 홈 데이터 가져오기
export const getHomeData = async () => {
  console.log('🔄 홈 데이터 요청 시작')
  
  // 쿠키 상태 확인
  console.log('🍪 현재 쿠키:', document.cookie)
  
  // 저장된 인증 토큰이 있다면 헤더에 추가
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  // localStorage에서 토큰을 확인 (필요한 경우)
  const token = localStorage.getItem('authToken');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch('/api/post/home', {
    method: 'GET',
    credentials: 'include',
    headers
  })
  
  // 응답 헤더 확인
  console.log('📊 응답 상태:', response.status)
  console.log('📊 응답 헤더:', Object.fromEntries(response.headers.entries()))
  
  if (!response.ok) {
    // 에러 응답의 본문도 로깅
    const errorText = await response.text()
    console.error('❌ 에러 응답 본문:', errorText)
    
    // 403 에러인 경우 인증 문제로 판단
    if (response.status === 403) {
      console.error('❌ 인증 실패 - 로그인이 필요합니다')
      // 로컬 스토리지의 인증 정보 제거
      if (typeof window !== 'undefined') {
        localStorage.removeItem('me')
      }
    }
    
    const error = new Error(`HTTP error! status: ${response.status}`)
    ;(error as any).response = { status: response.status, data: errorText }
    throw error
  }
  
  // 응답 타입 확인
  const contentType = response.headers.get('content-type')
  console.log('🔍 응답 Content-Type:', contentType)
  
  // 응답 텍스트 먼저 확인
  const responseText = await response.text()
  console.log('🔍 응답 텍스트:', responseText.substring(0, 200))
  
  try {
    return JSON.parse(responseText)
  } catch (parseError) {
    console.error('❌ JSON 파싱 실패:', parseError)
    console.error('❌ 응답 전체:', responseText)
    throw new Error(`JSON 파싱 실패: ${parseError}`)
  }
} 