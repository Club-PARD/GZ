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
  const response = await fetch('/api/post/home', {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    }
  })
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
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