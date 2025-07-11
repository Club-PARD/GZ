// components/hero-section.tsx
import Link from "next/link";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="relative h-[835px] overflow-hidden bg-[linear-gradient(180deg,#F0EDFF_0%,#D8D0FF_100%)]">
    
      <div className="w-full h-[780px] flex flex-col items-center ">
        <div className=" mt-[148px] max-w-2xl space-y-5  text-black text-center ">
          <h2 className="text-center
    font-['Pretendard Variable']
    text-[48px]
    font-bold
    leading-[130%]
    tracking-[-1.44px]
    text-[#232323]
  "
  style={{ fontStyle: 'normal' }}
>
            잠깐 필요한 그 물건,
            <br />
            캠퍼스 안에서 지금 구해요
          </h2>
          <p className="text-center
    font-['Pretendard Variable']
    text-[18px]
    font-normal
    leading-[160%]
    tracking-[-0.36px]
    text-[#616264]
    mt-[8px]
  "
  style={{ fontStyle: 'normal' }}
>
            &apos;지구&apos;는 캠퍼스 안에서 단기간 필요한 물건을 빠르게 빌리고 빌려주는 P2P 대여 플랫폼입니다.
          </p>
          <div className="flex gap-4 justify-center mt-[12px]">
            <Link
              href="/cert/cert"
              className="  inline-flex
            px-[20px] py-[12px]
            justify-center items-center
            gap-[6px]
            rounded-[8px]
            bg-[#6849FE] text-center text-[18px]
            font-medium
            leading-[130%]
            tracking-[-0.36px]
            text-white
            hover:bg-[#5933E4]
            "
            
            >
              지금 빌리러 가기
            </Link>
            
          </div>
          {/* 오른쪽 이미지 (50%) */}
        </div>
        <div className="w-1/2 mt-[40px] flex justify-center items-center">
  {/* 여기 안에 검정 테두리 래퍼 */}
  <div
    className="
      
      
      overflow-hidden     /* 이미지 잘림 */
    
    flex-shrink-0
    rounded-[12px]
   aspect-[451/293]
   bg-lightgray bg-center bg-cover bg-no-repeat
    "
  >
<Image
            src="/images/onboardfinal.svg"
            alt="hero-section"
            width={902}
            height={586}
            className="block" /* next/image 의 wrapper 스타일 방지 */
          />
  </div>
          
        </div>
      </div>
      
    </section>
  );
}
