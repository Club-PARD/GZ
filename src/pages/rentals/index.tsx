import React, { useState, useMemo, useEffect } from "react";
import Header from "@/components/home-header";
import Footer from "@/components/Footer";
import TabNav from "./TabNav";
import TransactionTable from "./TransactionTable";
import Pagination from "./Pagination";
import { TransactionItem, Tab } from "./rentals";

const lentItems: TransactionItem[] = [  {
    id: 1,
    title: "1TB USB 빌려드려요",
    category: "전자기기",
    duration: "10시간",
    price: 30000,
    status: "반납",
    imageUrl: "/images/usb.jpg",
  },
  {
    id: 2,
    title: "가방 빌려드려요",
    category: "패션",
    duration: "3일",
    price: 50000,
    status: "거래",
    imageUrl: "/images/bag.jpg",
  },
  {
    id: 3,
    title: "망치 빌려드려요",
    category: "도구",
    duration: "1주일",
    price: 20000,
    status: "거래",
    imageUrl: "/images/hammer.jpg",
  }, ];
const requestItems: TransactionItem[] = [ {
    id: 1,
    title: "1TB USB 빌려드려요",
    category: "전자기기",
    duration: "10시간",
    price: 30000,
    status: "반납",
    imageUrl: "/images/usb.jpg",
  },
  {
    id: 2,
    title: "가방 빌려드려요",
    category: "패션",
    duration: "3일",
    price: 50000,
    status: "거래",
    imageUrl: "/images/bag.jpg",
  },
  {
    id: 3,
    title: "망치 빌려드려요",
    category: "도구",
    duration: "1주일",
    price: 20000,
    status: "거래",
    imageUrl: "/images/hammer.jpg",
  }, ];
const borrowedItems: TransactionItem[] = [ {
    id: 1,
    title: "1TB USB 빌려드려요",
    category: "전자기기",
    duration: "10시간",
    price: 30000,
    status: "반납",
    imageUrl: "/images/usb.jpg",
  },
  {
    id: 2,
    title: "가방 빌려드려요",
    category: "패션",
    duration: "3일",
    price: 50000,
    status: "거래",
    imageUrl: "/images/bag.jpg",
  },
  {
    id: 3,
    title: "망치 빌려드려요",
    category: "도구",
    duration: "1주일",
    price: 20000,
    status: "거래",
    imageUrl: "/images/hammer.jpg",
  }, ];

const ITEMS_PER_PAGE = 5;
const BLOCK_SIZE = 5;

const RentalsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>("borrow");
  const [loanedItemsState, setLoanedItemsState] = useState<TransactionItem[]>(lentItems);
  const handleReturnConfirm = (id: number) => {
    setLoanedItemsState((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: "반납 완료" } : item))
    );
  };

  const items =
    activeTab === "borrow"
      ? borrowedItems
      : activeTab === "lend"
      ? loanedItemsState
      : requestItems;

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [totalPages, currentPage]);

  const currentItems = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return items.slice(start, start + ITEMS_PER_PAGE);
  }, [items, currentPage]);

  const currentBlockStart = Math.floor((currentPage - 1) / BLOCK_SIZE) * BLOCK_SIZE + 1;
  const currentBlockEnd = Math.min(currentBlockStart + BLOCK_SIZE - 1, totalPages);

  const handlePrevBlock = () => setCurrentPage(Math.max(currentBlockStart - BLOCK_SIZE, 1));
  const handleNextBlock = () =>
    setCurrentPage(Math.min(currentBlockStart + BLOCK_SIZE, totalPages - BLOCK_SIZE + 1));

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="pb-[60px] flex-grow pt-16">
        <div className="max-w-[980px] mx-auto">
          <h1
            className="pb-[60px] pt-[60px] text-[#232323]                    
            px-106                       
            [font-family:'Pretendard Variable']
            text-[32px]                        
            leading-[130%]                    
            tracking-[-0.64px]"
          >
            거래 내역
          </h1>

          <TabNav activeTab={activeTab} setActiveTab={setActiveTab} setCurrentPage={setCurrentPage} />

          <TransactionTable
            currentItems={currentItems}
            activeTab={activeTab}
            handleReturnConfirm={handleReturnConfirm}
          />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            currentBlockStart={currentBlockStart}
            currentBlockEnd={currentBlockEnd}
            handlePrevBlock={handlePrevBlock}
            handleNextBlock={handleNextBlock}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RentalsPage;
