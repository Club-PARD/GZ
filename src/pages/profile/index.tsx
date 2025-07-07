// src/pages/ProfilePage.tsx
import React, { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/home-header';
import Footer from '@/components/Footer';

interface TransactionItem {
  id: number;
  title: string;
  category: string;
  duration: string;
  price: number;
  deposit: number;
  status: string;
  imageUrl: string;
}

// 더미 데이터 예시
const borrowedItems: TransactionItem[] = [
  {
    id: 1,
    title: '1TB USB 빌려드려요',
    category: '전자기기',
    duration: '10시간',
    price: 30000,
    deposit: 10000,
    status: '반납 요청',
    imageUrl: '/images/usb.jpg',
  },
  {
    id: 2,
    title: '가방 빌려드려요',
    category: '패션',
    duration: '3일',
    price: 50000,
    deposit: 20000,
    status: '반납 수락',
    imageUrl: '/images/bag.jpg',
  },
  {
    id: 3,
    title: '망치 빌려드려요',
    category: '도구',
    duration: '1주일',
    price: 20000,
    deposit: 5000,
    status: '반납 요청',
    imageUrl: '/images/hammer.jpg',
  },
];

const lentItems: TransactionItem[] = [
  {
    id: 2,
    title: '카메라 빌려드려요',
    category: '전자기기',
    duration: '1일',
    price: 15000,
    deposit: 5000,
    status: '반납 수락',
    imageUrl: '/images/camera.jpg',
  },
  {
    id: 3,
    title: '신발 빌려드려요',
    category: '패션',
    duration: '2주일',
    price: 5000,
    deposit: 1000,
    status: '반납 요청',
    imageUrl: '/images/shoes.jpg',
  },
  {
    id: 4,
    title: '캠핑용품 세트 빌려드려요',
    category: '여행',
    duration: '1달',
    price: 30000,
    deposit: 10000,
    status: '반납 수락',
    imageUrl: '/images/camping.jpg',
  },
];

const TransactionHistory: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'borrow' | 'lend'>('borrow');
  const items = activeTab === 'borrow' ? borrowedItems : lentItems;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 pt-16">
      <Header />

      <div className="max-w-250 mx-auto px-4">
        <main className="flex-grow container mx-auto p-4">
          <h1 className="text-2xl font-semibold mb-6 text-center">거래 내역</h1>

          {/* 탭 */}
          <div className="flex justify-center space-x-8 mb-1 pb-4 border-b-2 border-gray-200">
            <button
              className={`pb-2 mx-6 ${
                activeTab === 'borrow'
                  ? 'border-b-2 border-purple-600 text-purple-600'
                  : 'text-gray-500'
              }`}
              onClick={() => setActiveTab('borrow')}
            >
              빌린 내역
            </button>
            <button
              className={`pb-2 mx-4 ${
                activeTab === 'lend'
                  ? 'border-b-2 border-purple-600 text-purple-600'
                  : 'text-gray-500'
              }`}
              onClick={() => setActiveTab('lend')}
            >
              빌려준 내역
            </button>
          </div>

          {/* 거래 내용 또는 빈 상태 메시지 */}
          {items.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">
                {activeTab === 'borrow' ? '빌린 내역이 없습니다.' : '빌려준 내역이 없습니다.'}
              </p>
            </div>
          ) : (
            /* 거래 테이블 */
            <div className="bg-white rounded-lg overflow-hidden shadow-sm">
              {/* 테이블 헤더 */}
              <div className="grid grid-cols-4 bg-gray-50 border-b border-gray-200 text-gray-600 font-medium">
                <div className="px-4 py-3">물품 정보</div>
                <div className="px-4 py-3 text-center">기간 및 금액</div>
                <div className="px-4 py-3 text-center">보증금</div>
                <div className="px-4 py-3 text-center">상태</div>
              </div>

              {/* 테이블 본문 */}
              <div className="divide-y divide-gray-200">
                {items.map(item => (
                  <div key={item.id} className="grid grid-cols-4 hover:bg-gray-50">
                    {/* 물품 정보 */}
                    <div className="flex items-center space-x-4 px-4 py-4">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-16 h-16 rounded object-cover flex-shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-gray-900 truncate">{item.title}</div>
                        <div className="text-sm text-gray-500">{item.category}</div>
                      </div>
                    </div>

                    {/* 기간 및 금액 */}
                    <div className="flex flex-col justify-center items-center px-4 py-4">
                      <div className="text-sm text-gray-400">{item.duration}</div>
                      <div className="font-medium text-gray-900">
                        {item.price.toLocaleString()}원
                      </div>
                    </div>

                    {/* 보증금 */}
                    <div className="flex items-center justify-center px-4 py-4">
                      <div className="font-medium text-gray-900">
                        {item.deposit.toLocaleString()}원
                      </div>
                    </div>

                    {/* 상태 / 내역 조회 */}
                    <div className="flex flex-col items-center justify-center space-y-2 px-4 py-4">
                      <Link
                        href={
                          activeTab === 'lend'
                            ? '/detail/detail-page-producer'
                            : '/detail/detail-page-consumer'
                        }
                        onClick={(e) => {
                          console.log('Link clicked!', activeTab);
                          // e.preventDefault(); // 테스트용으로 주석처리
                        }}
                        className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 bg-white hover:bg-gray-50 transition-colors cursor-pointer"
                      >
                        내역 조회
                      </Link>
                      <button 
                        onClick={() => {
                          console.log('Button clicked!', activeTab);
                          alert('버튼이 클릭되었습니다!');
                        }}
                        className="px-4 py-2 bg-[#8769FF] text-white rounded-md text-sm hover:bg-[#7557FF] transition-colors"
                      >
                        {activeTab === 'borrow' ? '반납 요청' : '반납 수락'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default TransactionHistory;
