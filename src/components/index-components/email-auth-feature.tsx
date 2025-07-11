// components/EmailAuthFeature.tsx
import Image from "next/image";
import styles from '@/styles/onboarding.module.css';
export default function EmailAuthFeature() {
  return (
    <section className="w-full h-[800px] bg-white  ">
      <div className="flex justify-center items-center w-full mt-[12px]">
  <Image
    src="\images\IoIosArrowDown.svg" // 원하는 화살표 이미지 경로로 변경
    alt="아래 화살표"
    width={48}
    height={48}
    className="w-[48px] h-[48px] flex-shrink-0"
  />
</div>
      
      <div className="w-full flex h-full flex-row-reverse ">
        {/* 왼쪽 일러스트 영역 */}
        <div className="flex-1 flex items-start pt-[120px] pl-[253px] pr-[166px]">
          <Image
            src="/images/intro2.svg"
            alt="campus-illustration"
            width={580}
            height={540}
            className="max-w-full h-auto"
          />
        </div>

        {/* 오른쪽 텍스트 + 아이콘 영역 */}
        <div className="flex-1 flex flex-col justify-start pt-[136px]  pb-[140px] pr-[30] ">
          {/* 헤드라인 & 서브텍스트 */}
          <div className="pl-[166px]">
            <div className="flex flex-col gap-[129px]">
            <div>
              <p className="  text-[#6849FE]
                  text-[18px]
                  font-semibold
                  leading-[130%]
                  tracking-[-0.36px]
                  "
                style={{ fontStyle: 'normal' }}>
                학교 메일 인증
              </p>
              <h2 className="
                    text-[#232323]
                    text-[36px]
                    font-semibold
                    leading-[130%]
                    tracking-[-1.08px]
                    mt-[8px]
                  "
                  style={{ fontStyle: 'normal' }}
                >
                학교 메일을 인증하고<br />
                안전하게 물건을 거래해요
              </h2>
              <p className="text-[#616264]
                text-[18px]
                font-normal
                leading-[160%]
                tracking-[-0.36px]
                font-['Pretendard Variable']
                mt-4"
                style={{ fontStyle: 'normal' }}
                >
                같은 학교 학생끼리 물건을 빌리고 빌려줘요.<br />
                가까운 곳에서 물건을 거래할 수 있어요.
              </p>
            </div>
            </div>

          </div>
          
            {/* 하단 아이콘 3개 */}
            <div className={styles.iconContainer}>
              <div>
                <Image
                  src="/images/peopleicon.svg"
                  alt="안전거래 아이콘"
                  width={215}
                  height={250}
                />
              </div>
              <div>
                <Image
                  src="/images/id.svg"
                  alt="신분증 아이콘"
                  width={250}
                  height={250}
                />
              </div>
              <div>
                <Image
                  src="/images/shild.svg"
                  alt="커뮤니티 아이콘"
                  width={250}
                  height={250}
                />
              </div>
            </div>
        
        </div>
      </div>
    </section>
  );
}