// components/hero-section.tsx
import Link from "next/link";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="max-w-4xl mx-auto flex items-start justify-between py-20 px-4">
      {/* 왼쪽 텍스트 (50%) */}
      <div className="w-1/2 pr-4 space-y-6 text-black">
        <h2 className="text-4xl font-bold leading-snug">
          잠깐 필요한 그 물건,
          <br />
          캠퍼스 안에서 지금 구해요
        </h2>
        <p className="text-gray-700 w-7/8">
          ‘지구’는 대학생들이 캠퍼스 안에서 단기간 필요한 물건을
          <br />
          빠르게 빌리고 빌려주는 P2P 대여 플랫폼입니다.
        </p>
        <div className="flex gap-4"> 
          <Link
          href="/cert/cert"
          className="bg-[#6849FE] text-white  py-4 rounded-lg h-[55px] w-[193px] text-center"
        >
          학교메일로 시작하기
        </Link>
        <Link
          href="/cert/cert"
          className="bg-[#F0EDFF] text-[#6849FE] px-6 py-4 rounded-lg w-[94px] h-[55px] text-center size-[18px]"
        >
          로그인
        </Link>
        </div>
      </div>

      {/* 오른쪽 이미지 플레이스홀더 (50%) */}
      <div className="w-1/2 pl-4 flex justify-end">
        <div className="w-80 h-96 bg-[#E9E9E9] rounded-lg" />
        <Image
          src="/images/intro1.svg"
          alt="hero-section"
          width={480}
          height={540}
        />
      </div>
    </section>
  );
}
