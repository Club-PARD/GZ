// components/profile/SupportSection.tsx
import React from 'react';

const SupportSection: React.FC = () => (
  <div>
    <div className="w-[880px] h-px bg-[#D8D9DF]  " />
    <h1 className="text-2xl font-semibold mb-4 dark:text-black mt-[20px]">
      고객센터
    </h1>
    <div className="w-[880px] h-px bg-[#D8D9DF]  " />
    <div className="space-y-4 text-gray-700 mt-[20px]">
      <p>
        <span className="font-medium dark:text-black">이메일:</span>{' '}
        <a
          href="mailto:zigu06official@gmail.com"
          className="hover:underline"
        >
          zigu06official@gmail.com
        </a>
      </p>
      <p>
        <span className="font-medium dark:text-black">
          근무시간 및 휴무안내:
        </span>
        <br />
        평일 09:00–18:00 (점심 12:00–14:00)
        <br />
        휴무: 토/일/공휴일
      </p>
      
    </div>
    <div className="w-[880px] h-px bg-[#D8D9DF] mt-[230px] " />
  </div>
    
 
);

export default SupportSection;
