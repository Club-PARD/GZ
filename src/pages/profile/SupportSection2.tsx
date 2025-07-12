// components/profile/SupportSection.tsx
import React from 'react';
import Header from '@/components/index-header';
import Footer from '@/components/loginFooter';
const SupportSection: React.FC = () => (
    
  <section
    className="
      bg-white dark:bg-white     /* 라이트/다크 모드 모두 흰 배경 */
      py-6
    "
  >
    <Header />
    {/* 상단 구분선 */}
    <div className='dark:bg-white h-[500px]'>
         <div className="w-[880px]  h-px bg-[#D8D9DF] mx-auto mt-[100px]" />

    {/* 제목 */}
    <h1 className="w-[880px] mx-auto text-2xl font-semibold my-4 dark:text-black">
      고객센터
    </h1>

    {/* 중간 구분선 */}
    <div className="w-[880px] h-px bg-[#D8D9DF] mx-auto mb-6" />

    {/* 내용 */}
    <div className="w-[880px] mx-auto space-y-4 text-gray-700 dark:text-gray-700">
      <div>
        <p className="font-medium dark:text-black inline">이메일:</p>{' '}
        <span>zigu06official@gmail.com</span>
      </div>
      <div>
        <p className="font-medium dark:text-black">근무시간 및 휴무안내:</p>
        <p>평일 09:00–18:00 (점심 12:00–14:00)</p>
        <p>휴무: 토/일/공휴일</p>
      </div>
    </div>

    {/* 하단 구분선 */}
    <div className="w-[880px] h-px bg-[#D8D9DF] mx-auto mt-6" />
    </div>
   <Footer />
  </section>
  
);

export default SupportSection;
