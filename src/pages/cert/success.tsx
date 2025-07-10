// pages/cert/register.tsx
import { useState } from 'react'
import { useRouter } from 'next/router'
import Header from '@/components/cert-header';
import Link from 'next/link';
import { PiCheckCircleFill } from "react-icons/pi";


export default function Success() {
  const router = useRouter()

  return (
    <main>
      <Header />
      <div className="min-h-screen bg-[#F3F3F5] flex flex-col items-center pt-16">
        <div className="flex justify-center space-x-[20px] mb-8">
          <div className="w-[180px] h-[56px] flex items-center bg-white rounded-lg px-[20px] py-[16px] space-x-2">
            <span className="w-[24px] h-[24px] bg-[#ADAEB2] text-[#F3F3F5] rounded-lg flex items-center justify-center font-bold">1</span>
            <span className="text-[#ADAEB2] font-bold">학교 이메일 인증</span>
          </div>
          
          <div className="w-[180px] h-[56px] flex items-center bg-white rounded-lg px-[20px] py-[16px] space-x-2">
            <span className="w-[24px] h-[24px] bg-[#ADAEB2] text-[#F3F3F5] rounded-lg flex items-center justify-center font-bold">2</span>
            <span className="font-bold text-[#ADAEB2]">회원 정보 입력</span>
          </div>
          <div className="w-[180px] h-[56px] flex items-center bg-white rounded-lg px-[20px] py-[16px] space-x-2">
            <span className="w-[24px] h-[24px] bg-[#232323] text-white rounded-lg flex items-center justify-center font-bold">3</span>
            <span className="text-[#232323] font-bold">회원가입 완료</span>
          </div>
        </div>

        <div
          className="w-[580px] h-[484px] bg-[#FFFFFF] rounded-2xl"
        >
          <div className="flex justify-center">
            <PiCheckCircleFill
              className="w-[100px] h-[100px] text-[#6849FE] mt-[80px]" />
          </div>
          <h1 className="text-[32px] text-center font-bold mt-[20px] text-[#232323]">회원가입이 완료되었습니다!</h1>
          <p className="text-sm text-center text-[#616264] mt-[12px]">회원님의 회원가입을 진심으로 축하드립니다.</p>
          <p className="text-sm text-center text-[#616264]">로그인 후 지구 서비스를 더 자세히 살펴볼 수 있습니다.</p>
          <div className="flex justify-center">

            <Link href="/cert/login">
              <button
                type="submit"
                className="w-[180px] h-[53px] px-[24px] py-[16px] bg-[#6849FE] text-white rounded-lg mt-[60px]"
              >
                로그인하러 가기
              </button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}

