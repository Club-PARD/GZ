// components/Header.tsx
import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    
    <header className="sticky border-b border-gray-100 bg-white flex items-center h-[68px] pl-[166px] pr-[166px] ">
      {/* 1) 왼쪽: 로고 */}
      <Image
        src="/images/Logo_purple.svg"
        alt="지구 로고"
        width={94.167}
        height={20}
      />

      {/* 2) 오른쪽 그룹: 로그인 + 버튼 */}
      <div className="flex space-x-4 ml-auto">
        <Link
          href="/cert/login"
          className="text-[var(--Gray-10,#232323)] text-sm hover:text-gray-900
          inline-flex items-center justify-center
            px-4 py-2 gap-1.5 rounded-lg
            bg-gray 
            text-center  font-medium
            leading-[130%] tracking-[-0.28px]
            hover:bg-[#E8E4FF]"
        >
          로그인
        </Link>
        <Link
          href="/cert/cert"
          className="
            inline-flex items-center justify-center
            px-4 py-2 gap-1.5 rounded-lg
            bg-[var(--Purple-04,#6849FE)] text-white
            text-center text-sm font-medium
            leading-[130%] tracking-[-0.28px]
            hover:bg-[#5933E4]
          "
        >
          지금 빌리러 가기
        </Link>
      </div>
    </header>
  );
}
