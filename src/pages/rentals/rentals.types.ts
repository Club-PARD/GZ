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

export interface TransactionItem {
  id: number;
  title: string;
  category: string;
  duration: string;
  price: number;
  status: string;
  imageUrl: string;
} 