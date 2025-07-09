// components/DepositFeature.tsx
import Image from "next/image";

export default function DepositFeature() {
  return (
    <section className="w-full h-[780px] px-[166px]">
      <div className="flex">
        

        {/* 오른쪽: 상단 이미지만 */}
        <div className="flex-1">
          <div className="mt-[160px] mr-[118px]">
            <Image
              src="/images/intro3-2.svg"
              alt="staircase illustration 1"
              width={580}
              height={540}
            />
          </div>
        </div>
        {/* 왼쪽: 텍스트 + 하단 이미지 */}
        <div className="w-[482px] mt-[160px] space-y-5">
          <p className="text-[#6849FE] text-[18px] font-semibold">대여 신청하기</p>
          <h2 className="text-4xl font-bold text-[#232323]"style={{ letterSpacing: '-2%' }}>
            대여 신청서로 원하는 기간만큼
            <br />
            간편하게 빌릴 수 있어요!
          </h2>
          <p className=" text-base text-[#616264]">
          대여 신청서에 기간을 입력하고 서비스 이용에 동의하면
            <br />
            필요한 물건을 간편하게 빌릴 수 있어요.
          </p>

          {/* 텍스트 바로 밑에 하단 이미지 */}
          <div className="pt-[49px] flex justify-center">
            <Image
              src="/images/intro3-1.svg"
              alt="staircase illustration 2"
              width={280}
              height={200}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
