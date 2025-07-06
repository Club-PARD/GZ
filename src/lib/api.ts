import axios from 'axios'

// 백엔드 API base URL (실제 Spring Boot 서버 주소로 변경)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
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
  const response = await api.post('/api/auth/register', {
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