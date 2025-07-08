// pages/detail/detail-page-producer.tsx
'use client';

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Header from '@/components/home-header'
import Footer from '@/components/Footer'
import { AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai'
import styles from "../../styles/detail.module.css";
import LoadingBalls from "@/components/loading-components/loding-ball";

export default function DetailPageProducer() {
  const [registeredItem, setRegisteredItem] = useState<any>(null)
  const [loading, setLoading] = useState(true);
  
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
    "/images/camera.jpg",
  ];

  // localStorage에서 등록된 아이템 정보 가져오기
  useEffect(() => {
    const storedItem = localStorage.getItem('registeredItem')
    if (storedItem) {
      try {
        const responseData = JSON.parse(storedItem)
        // Swagger 명세에 따라 response의 data 필드를 사용합니다.
        setRegisteredItem(responseData.data)
      } catch (error) {
        console.error('아이템 데이터 파싱 에러:', error)
      }
    }
    setLoading(false);
  }, [])

  // 등록된 아이템(data 객체)이 있으면 해당 이미지, 없으면 기본 이미지 사용
  // Swagger 명세에 따라 images 배열의 각 객체에서 s3Key를 이미지 소스로 사용합니다.
  const images = registeredItem?.images?.length > 0 
    ? registeredItem.images.map((img: any) => img.s3Key) 
    : defaultImages;

  // Swagger 명세에 따라 데이터 필드에 접근합니다.
  const writerNickname = registeredItem?.images?.[0]?.post?.writer?.nickname || '작성자';
  const itemName = registeredItem?.images?.[0]?.post?.itemName || '상품명 없음';


  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <div className="flex space-x-2 mb-4">
          <LoadingBalls />
        </div>
        <p className="text-gray-600">상품 정보를 불러오는 중입니다...</p>
      </div>
    );
  }

  return (
    <div className="bg-white pt-[80px]">
      <Header />

      <main className="max-w-5xl mx-40 my-8 flex gap-8">
        {/* 좌측: 이미지 세로 나열 */}
        <section className="w-1/2 space-y-4">
          {images.map((src: string, idx: number) => (
            <div key={idx} className={styles.imageContainer}>             
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
                // 이미지가 외부 URL일 경우 에러 처리가 필요할 수 있습니다.
                onError={(e) => e.currentTarget.src = defaultImages[0]}
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
            <span className="font-medium text-[#232323]">{writerNickname}</span>
          </div>

          {/* 제목·카테고리 */}
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-[#232323]">
              {itemName}
            </h1>
            <span className="px-2 py-1 bg-[#F2E8FF] text-[#6B46C1] text-xs rounded-full">
              {registeredItem?.category ? categoryMap[registeredItem.category] || registeredItem.category : '카테고리 없음'}
            </span>
          </div>
          <div className="border-b border-gray-200"></div>

          {/* 대여 가격 */}
          <div className="flex gap-4">
            <p className="mt-1 text-lg font-semibold text-[#ADAEB2]">1시간</p>
            <p className="mt-1 text-lg font-semibold text-[#ADAEB2]">
              {registeredItem?.price_per_hour != null ? `${registeredItem.price_per_hour}원` : '가격 정보 없음'}
            </p>
          </div>
          <div className="flex gap-4">
            <p className="mt-1 text-lg font-semibold text-[#ADAEB2]">1일</p>
            <p className="mt-1 text-lg font-semibold text-[#ADAEB2]">
              {registeredItem?.price_per_day != null ? `${registeredItem.price_per_day}원` : '가격 정보 없음'}
            </p>
          </div>

          <div className="border-b border-gray-200 pt-[36px]"></div>

          {/* 설명 */}
          <div className="p-4 h-40 bg-[#F9F9FA] rounded-lg text-sm text-gray-700">
            {registeredItem?.description || '설명이 없습니다.'}
          </div>

          
        </section>
      </main>

      <Footer />
    </div>
  );
}
