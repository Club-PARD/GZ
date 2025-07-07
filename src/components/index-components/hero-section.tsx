// components/hero-section.tsx
import Link from "next/link";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="flex w-full">
      <div className="w-[166px] h-screen bg-white"></div>
      <div className="w-full h-[780px] flex">
        <div className="w-1/2 mt-[152px] space-y-5 text-black">
          <h2 className="text-5xl font-bold leading-tight" style={{ letterSpacing: '-2%' }}>
            잠깐 필요한 그 물건,
            <br />
            캠퍼스 안에서 지금 구해요
          </h2>
          <p className="text-gray-700 text-base " style={{ letterSpacing: '-2%' }}>
            '지구'는 대학생들이 캠퍼스 안에서 단기간 필요한 물건을
            <br />
            빠르게 빌리고 빌려주는 P2P 대여 플랫폼입니다.
          </p>
          <div className="flex gap-4 pt-4">
            <Link
              href="/cert/cert"
              className="bg-[#6849FE] text-white py-4 rounded-lg h-[55px] w-[193px] text-center font-medium"
            >
              학교메일로 시작하기
            </Link>
            <Link
              href="/cert/login"
              className="bg-[#F0EDFF] text-[#6849FE] px-6 py-4 rounded-lg w-[94px] h-[55px] text-center font-medium"
            >
              로그인
            </Link>
          </div>
          {/* 오른쪽 이미지 (50%) */}
        </div>
        <div className="w-1/2 pl-[60px] mt-[152px]">
          <Image
            src="/images/intro1.svg"
            alt="hero-section"
            width={580}
            height={540}
          />
        </div>
      </div>
      <div className="w-[166px] h-screen bg-white"></div>
    </section>
  );
}
