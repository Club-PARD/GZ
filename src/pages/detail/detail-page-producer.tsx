// pages/detail/detail-page-producer.tsx
'use client';

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Header from '@/components/home-header'
import Footer from '@/components/Footer'
import { AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai'
import styles from "../../styles/detail.module.css";

export default function DetailPageProducer() {
  const [registeredItem, setRegisteredItem] = useState<any>(null)
  
  // 카테고리 한국어 변환
  const categoryMap: Record<string, string> = {
    'ELECTRONICS': '전자기기',
    'HEALTH': '건강',
    'INTEREST': '취미/여가',
    'BEAUTYFASION': '뷰티/패션',
    'ACADEMIC': '도서/학업',
    'ESSENTIALS': '생활용품',
    'ETC': '기타',
  }
  
  // 기본 이미지 (등록된 이미지가 없을 경우 사용)
  const defaultImages = [
    "/images/usb.jpg",
    "/images/bag.jpg",
    "/images/camera.jpg",
    "/images/camping.jpg",
    "/images/shoes.jpg",
  ];

  // localStorage에서 등록된 아이템 정보 가져오기
  useEffect(() => {
    const storedItem = localStorage.getItem('registeredItem')
    if (storedItem) {
      try {
        const itemData = JSON.parse(storedItem)
        setRegisteredItem(itemData)
      } catch (error) {
        console.error('아이템 데이터 파싱 에러:', error)
      }
    }
  }, [])

  // 등록된 아이템이 있으면 해당 이미지, 없으면 기본 이미지 사용
  const images = registeredItem?.imageUrls || defaultImages

  return (
    <div className="bg-white pt-[80px]">
      <Header />

      <main className="max-w-5xl mx-40 my-8 flex gap-8">
        {/* 좌측: 이미지 세로 나열 */}
        <section className="w-1/2 space-y-4">
          {images.map((src: string, idx: number) => (
            <div className={styles.imageContainer}>             
              <Image
                src={src}
                alt={`image-${idx}`}
                width={580}
                height={580}
                style={{ 
                  width: '100%',
                  height: '100%',
                  objectFit: "cover"
                }}
              />
            </div>
          ))}
        </section>

        {/* 우측: 상품 상세 정보 */}
        <section className="w-150 space-y-4 border border-gray-300 rounded-lg p-4 fixed right-40 bottom-70 top-[110px]">
          {/* 프로필 */}
          <div className="flex items-center space-x-1 mb-2">
            <img
              src="/chat/chat-profile.svg"
              alt="프로필"
              className="w-8 h-8 rounded-full"
            />
            <span className="font-medium text-[#232323]">user2</span>
          </div>

          {/* 제목·카테고리 */}
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-[#232323]">
              {registeredItem?.itemName || '1TB USB 빌려드려요'}
            </h1>
            <span className="px-2 py-1 bg-[#F2E8FF] text-[#6B46C1] text-xs rounded-full">
              {registeredItem?.category ? categoryMap[registeredItem.category] || registeredItem.category : '전자기기'}
            </span>
          </div>
          <div className="border-b border-gray-200"></div>

          {/* 대여 가격 */}
          <div className="flex gap-4">
            <p className="mt-1 text-lg font-semibold text-[#ADAEB2]">1시간</p>
            <p className="mt-1 text-lg font-semibold text-[#ADAEB2]">
              {registeredItem?.pricePerHour || '3000'}
            </p>
          </div>
          <div className="flex gap-4">
            <p className="mt-1 text-lg font-semibold text-[#ADAEB2]">1일</p>
            <p className="mt-1 text-lg font-semibold text-[#ADAEB2]">
              {registeredItem?.pricePerDay || '10000'}
            </p>
          </div>

          <div className="border-b border-gray-200 pt-[36px]"></div>

          {/* 설명 */}
          <div className="p-4 h-40 bg-[#F9F9FA] rounded-lg text-sm text-gray-700">
            {registeredItem?.description || 
              '용량 커서 문제 없어요. 생활 기스 살짝 있는 거 말고는 훼손된 부분 딱히 없어요. 분실만 조심해주면 좋겠어요!'
            }
          </div>

          
        </section>
      </main>

      <Footer />
    </div>
  );
}
