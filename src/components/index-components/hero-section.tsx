// components/hero-section.tsx
import Link from "next/link";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="relative h-[840px] overflow-hidden bg-[linear-gradient(180deg,#F0EDFF_0%,#D8D0FF_100%)]">
    
      <div className="w-full h-[780px] flex flex-col items-center ">
        <div className=" mt-[80px] max-w-2xl space-y-5  text-black text-center ">
          <h2 className="text-5xl font-bold leading-tight text-center" style={{ letterSpacing: '-2%' }}>
            잠깐 필요한 그 물건,
            <br />
            캠퍼스 안에서 지금 구해요
          </h2>
          <p className="text-gray-700 text-base " style={{ letterSpacing: '-2%' }}>
            '지구'는 대학생들이 캠퍼스 안에서 단기간 필요한 물건을
            
            빠르게 빌리고 빌려주는 P2P 대여 플랫폼입니다.
          </p>
          <div className="flex gap-4 pt-4 justify-center">
            <Link
              href="/cert/cert"
              className="bg-[#6849FE] text-white py-4 rounded-lg h-[55px] w-[193px] text-center font-medium "
            >
              지금 빌리러 가기
            </Link>
            
          </div>
          {/* 오른쪽 이미지 (50%) */}
        </div>
        <div className="w-1/2 mt-[52px] flex justify-center items-center">
  {/* 여기 안에 검정 테두리 래퍼 */}
  <div
    className="
      border-[12px]        /* 테두리 두께 */
      border-black        /* 테두리 색 */
      rounded-[32px]      /* 모서리 반경 */
      overflow-hidden     /* 이미지 잘림 */
    "
  >
<Image
            src="/images/onboard.png"
            alt="hero-section"
            width={902}
            height={476}
            className="block" /* next/image 의 wrapper 스타일 방지 */
          />
  </div>
          
        </div>
      </div>
      
    </section>
  );
}
