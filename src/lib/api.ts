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
  const headers: Record<string, string> = {}
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  try {
    const response = await api.get('/api/post/home', { headers })
    return response.data
  } catch (error: any) {
    if (error.response?.status === 403 && typeof window !== 'undefined') {
      localStorage.removeItem('me')
    }
    throw error
  }
}

// 내 물건 목록 가져오기
export const getMyPosts = async () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null
  const headers: Record<string, string> = {}
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  try {
    const response = await api.get('/api/post/my-posts', { headers })
    return response.data
  } catch (error: any) {
    if (error.response?.status === 403 && typeof window !== 'undefined') {
      localStorage.removeItem('me')
      localStorage.removeItem('authToken')
    }
    throw error
  }
}

// 게시물 삭제
export const deletePosts = async (postIds: number[]) => {
  const userId =
    typeof window !== 'undefined' ? localStorage.getItem('me') : null
  const authToken =
    typeof window !== 'undefined' ? localStorage.getItem('authToken') : null

  const headers: Record<string, string> = {}
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
// src/lib/api.ts
export async function getSearchData(keyword: string) {
  const res = await fetch(`/api/post/search?keyword=${encodeURIComponent(keyword)}`, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error(`Search failed: ${res.status}`);
  return res.json() as Promise<{
    status: number;
    success: boolean;
    message: string;
    data: Array<{
      post_id: number;
      firstImageUrl?: string | null;
      itemName: string;
      category: string;
      price_per_hour: number;
      price_per_day: number;
    }>;
  }>;
}
