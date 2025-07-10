// src/pages/rentals/index.tsx
import React from "react";
import Link from "next/link";
import Header from "@/components/home-header";
import Footer from "@/components/Footer";

const RentalsMainPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="pb-[60px] flex-grow pt-16">
        <div className="max-w-[980px] mx-auto">
          <h1
            className={`
              pb-[60px] pt-[60px] text-[#232323]
              px-106 [font-family:'Pretendard Variable']
              text-[32px] leading-[130%] tracking-[-0.64px]
            `}
          >
            거래 내역
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 빌린 내역 카드 */}
            <Link href="/rentals/borrowed">
              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">빌린 내역</h3>
                  <p className="text-gray-600 text-sm">내가 빌린 물건들의 거래 내역을 확인하세요</p>
                </div>
              </div>
            </Link>

            {/* 빌려준 내역 카드 */}
            <Link href="/rentals/lent">
              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">빌려준 내역</h3>
                  <p className="text-gray-600 text-sm">내가 빌려준 물건들의 거래 내역을 확인하세요</p>
                </div>
              </div>
            </Link>

            {/* 대여요청 카드 */}
            <Link href="/rentals/requests">
              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="text-center">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">대여요청</h3>
                  <p className="text-gray-600 text-sm">내 물건에 대한 대여요청을 확인하세요</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RentalsMainPage;
