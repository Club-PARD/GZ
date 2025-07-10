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

// 대여요청 탭용 아이템 타입
export interface RequestItem {
  postId: number;
  userId: number;
  itemName: string;
  applyList: ApplyItem[];
}

// API 호출 함수
export const fetchApplyHistory = async (): Promise<ApplyResponse> => {
  try {
    const response = await fetch('/api/apply/all', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch apply history');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching apply history:', error);
    throw error;
  }
};
