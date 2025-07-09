// src/lib/api.ts
import axios from 'axios'

// Next.js 프록시 사용을 위한 빈 baseURL
const API_BASE_URL = ''

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 닉네임 중복 확인
export const checkNickname = async (nickname: string) => {
  const response = await api.post('/api/auth/check-nickname', { nickname })
  return response.data
}

// 회원가입
export const register = async (
  email: string,
  university: string,
  nickname: string,
  password: string
) => {
  const response = await api.post('/api/auth/signUp', {
    email,
    university,
    nickname,
    password,
  })
  return response.data
}

// 로그인
export const login = async (email: string, password: string) => {
  const response = await api.post('/api/auth/login', {
    email,
    password,
  })
  return response.data
}

// 홈 데이터 가져오기
export const getHomeData = async () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch('/api/post/home', {
    method: 'GET',
    credentials: 'include',
    headers,
  })

  if (!response.ok) {
    if (response.status === 403 && typeof window !== 'undefined') {
      localStorage.removeItem('me')
    }
    const errorText = await response.text().catch(() => '')
    const error = new Error(`HTTP error! status: ${response.status}`)
    ;(error as any).response = { status: response.status, data: errorText }
    throw error
  }

  const content = await response.text()
  return JSON.parse(content)
}

// 내 물건 목록 가져오기
export const getMyPosts = async () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch('/api/post/my-posts', {
    method: 'GET',
    credentials: 'include',
    headers,
  })

  if (!response.ok) {
    if (response.status === 403 && typeof window !== 'undefined') {
      localStorage.removeItem('me')
      localStorage.removeItem('authToken')
    }
    const errorText = await response.text().catch(() => '')
    const error = new Error(`HTTP error! status: ${response.status}`)
    ;(error as any).response = { status: response.status, data: errorText }
    throw error
  }

  const content = await response.text()
  return JSON.parse(content)
}

// 게시물 삭제
export const deletePosts = async (postIds: number[]) => {
  const userId =
    typeof window !== 'undefined' ? localStorage.getItem('me') : null
  const authToken =
    typeof window !== 'undefined' ? localStorage.getItem('authToken') : null

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`
  }

  const requests = postIds.map((postId) => {
    const params = new URLSearchParams()
    params.append('postId', String(postId))
    if (userId) params.append('userId', userId)

    const url = `/api/post/delete?${params.toString()}`

    return api.delete(url, { headers, withCredentials: true })
  })

  const responses = await Promise.all(requests)

  return responses[0].data
}