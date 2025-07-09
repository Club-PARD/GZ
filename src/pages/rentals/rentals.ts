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
