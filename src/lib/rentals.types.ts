export interface BorrowedData {
  borrowedId: number;
  postId?: number; // 게시물 ID 추가
  itemName: string;
  category?: string;
  peroid: number;
  unitOfPeroid: "DAY" | "HOUR";
  totalPrice: number;
  borrowStatus: "BORROWED" | "RETURNED" | string;
  firstImageUrl: string;
}

export interface TransactionItem {
  id: number; // borrowedId로 사용
  borrowedId: number; // 명확하게 borrowedId
  postId?: number; // 게시물 ID(상세페이지 이동용)
  title: string;
  category: string;
  duration: string;
  price: number;
  status: string;
  imageUrl: string;
}

export interface Apply {
  applyId: number;
  postId?: number; // 게시물 ID 추가
  applierId: number;
  applierNickname: string;
  firstImageUrl: string;
  period: number;
  unitOfPeriod: "DAY" | "HOUR";
  totalPrice: number;
}

export interface RequestItem {
  postId?: number; // 게시물 ID 추가
  itemName: string;
  applyList: Apply[];
}

export type Tab = "borrow" | "lend" | "request"; 