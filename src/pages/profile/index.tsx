// src/pages/ProfilePage.tsx
import React, { useState } from 'react';
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
  }, {
    id: 3,
    title: '신발 빌려드려요',
    category: '패션',
    duration: '2주일',
    price: 5000,
    deposit: 1000,
    status: '반납 요청',
    imageUrl: '/images/shoes.jpg',
  }, {
    id: 4,
    title: '캠핑용품 세트 빌려드려요',
    category: '여행',
    duration: '1달',
    price: 30000,
    deposit: 10000,
    status: '반납 수락',
    imageUrl: '/images/camping.jpg',
  }

  // ... 추가 아이템
];

const TransactionHistory: React.FC = () => {
  // useState 훅: 컴포넌트 내부에서 상태(state)를 관리하기 위한 React 훅입니다.
  // activeTab은 현재 선택된 탭을 의미하며, 'borrow'(빌린 내역) 또는 'lend'(빌려준 내역) 값을 가집니다.
  // setActiveTab 함수를 호출하여 activeTab 값을 업데이트할 수 있습니다.
  const [activeTab, setActiveTab] = useState<'borrow' | 'lend'>('borrow');

  // activeTab에 따라 보여줄 리스트를 선택
  const items = activeTab === 'borrow' ? borrowedItems : lentItems;

  // 렌더링할 컴포넌트 -> 받아온 길이가 0이면 "거래 내역이 없습니다."라는 문구를 보여줍니다.
  if(borrowedItems.length === 0 && lentItems.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-500">거래 내역이 없습니다.</p>
      </div>
    );
  }
  else if (lentItems.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-500">빌려준 내역이 없습니다.</p>
      </div>
    );
    //리턴값들
  }
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="max-w-250 mx-auto px-4">
        <main className="flex-grow container mx-auto p-4">
          <h1 className="text-2xl font-semibold mb-6 text-center">거래 내역</h1>
          <div>
            {/* 탭 - 수정 필요 */}
            <div
              className="
     flex justify-center space-x-8
     mb-1      /* 탭 아래 여백 조정 */
     pb-4      /* 탭 내부 아래 여백 조정 */
     border-b-2/* 선 두께: 2px (기본은 border-b = 1px) */
     border-gray-200 /* 선 색상: 연한 회색 */
   "
            >
              <button
                className={`pb-2 mx-6 ${activeTab === 'borrow' ? 'border-b-2 border-purple-600 text-purple-600' : 'text-gray-500'}`}
                onClick={() => setActiveTab('borrow')}
              >
                빌린 내역
              </button>
              <button
                className={`pb-2 mx-4 ${activeTab === 'lend' ? 'border-b-2 border-purple-600 text-purple-600' : 'text-gray-500'}`}
                onClick={() => setActiveTab('lend')}
              >
                빌려준 내역
              </button>
            </div>
          </div>
          <div className="inline-grid
                grid-cols-4
                
                divide-y divide-gray-200
                text-gray-600
                font-medium">
            {/* — 헤더 */}
            <div className="px-2 py-3">물품 정보</div>
            <div className="px-2 py-3 text-center">기간 및 금액</div>
            <div className="px-2 py-3 text-center">보증금</div>
            <div className="px-2 py-3 text-center">상태</div>

            {/* — 아이템들 */}
            
            {items.map(item => (
              <React.Fragment key={item.id}>
                <div className="flex items-center space-x-4 px-2 py-3">
                  {/* 물품 사진 */}
                  <img src={item.imageUrl} alt="" className="w-20 h-20 rounded object-cover" />
                  <div>
                    {/* 폰트 */}
                    <div className="font-semibold ">{item.title}</div>
                    <div className="text-sm text-gray-500">{item.category}</div>
                  </div>
                </div>
                {/* 금액 정보 */}
                <div className="px-2 py-3 text-center">
                  <div className="text-sm text-gray-400">{item.duration}</div>
                  <div className="font-medium">{item.price.toLocaleString()}원</div>
                </div>
                {/* 보증금 */}
                <div className="px-2 py-3 text-center font-medium">
                  {item.deposit.toLocaleString()}원
                </div>
                {/* 상태(반납, 내역) */}
                <div className="flex flex-col items-center  space-y-2 px-2 py-3">
                  <button className="px-3 py-2 border bg-[#FFFFFF] border-gray-300 rounded text-sm text-gray-500">
                    내역 조회
                  </button>
                  <button className="px-3 py-2 bg-[#8769FF] text-white rounded text-sm">
                    {activeTab === 'borrow' ? '반납 요청' : '반납 수락'}
                  </button>
                </div>
              </React.Fragment>
            ))}
          </div>
          ):(
            // ★ 데이터가 하나도 없을 때 보여줄 영역
            <div className="flex flex-col items-center py-20 text-gray-400">
              {/* 아이콘 이미지는 적당히 대체하세요 */}
              <img
                src="/images/folder-empty.png"
                alt="거래 내역 없음"
                className="w-16 h-16 mb-4"
              />
              <p>아직 거래 내역이 없어요.</p>
            </div>
          )

        </main>
      </div>
      <Footer />
    </div>
  );
};

export default TransactionHistory;
