export type Tab = "borrow" | "lend" | "request";

export interface TransactionItem {
  id: number;
  title: string;
  category: string;
  duration: string;
  price: number;
  status: string;
  imageUrl: string;
}

// API 응답 타입들
export interface ApplyItem {
  applyId: number;
  applierNickname: string;
  firstImageUrl: string;
  period: number;
  unitOfPeriod: "DAY" | "HOUR";
  totalPrice: number;
}

export interface ApplyData {
  postId: number;
  userId: number;
  itemName: string;
  applyList: ApplyItem[];
}

export interface ApplyResponse {
  status: number;
  success: boolean;
  message: string;
  data: ApplyData[];
}

// 대여요청 탭용 아이템 타입 (ApplyData와 동일한 구조)
export type RequestItem = ApplyData;

// 대여/빌림 데이터 타입
export interface BorrowedData {
  borrowedId: number;
  itemName: string;
  category?: string;
  peroid: number;
  unitOfPeroid: "DAY" | "HOUR";
  totalPrice: number;
  borrowStatus: "BORROWED" | "RETURNED" | string;
  firstImageUrl: string;
}

export interface BorrowedResponse {
  success: boolean;
  message: string;
  data: BorrowedData[];
}

import axios from 'axios';

// API 호출 함수
export const fetchApplyHistory = async (): Promise<ApplyResponse> => {
  try {
    const response = await axios.get('/api/apply/all', {
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching apply history:', error);
    throw error;
  }
};
