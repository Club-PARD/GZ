// components/EmailAuthFeature.tsx
import Image from "next/image";
import styles from '@/styles/onboarding.module.css';

export default function EmailAuthFeature() {
  return (
    <section className="w-full h-[780px] bg-[#F3F3F5]">
      <div className="w-full flex h-full">
        {/* 왼쪽 일러스트 영역 */}
        <div className="flex-1 flex items-start pt-[120px] pl-[166px]">
          <Image
            src="/images/intro2.svg"
            alt="campus-illustration"
            width={580}
            height={540}
          />
        </div>

        {/* 오른쪽 텍스트 + 아이콘 영역 */}
        <div className="flex-1 flex flex-col justify-between pt-[136px]  pb-[120px] pl-[120px]">
          {/* 헤드라인 & 서브텍스트 */}
          <div className="flex flex-col gap-[120px]">
            <div>
              <h2 className="text-4xl font-bold  text-[#232323]" style={{ letterSpacing: '-2%' }}>
                학교 메일을 인증하고<br />
                안전하게 물건을 거래해요
              </h2>
              <p className="mt-4 text-base text-[#616264]">
                같은 학교 학생끼리 물건을 빌리고 빌려줘요.<br />
                가까운 곳에서 물건을 거래할 수 있어요.
              </p>
            </div>

            {/* 하단 아이콘 3개 */}
            <div className={styles.iconContainer}>
              <div>
                <Image
                  src="/images/intro2-1.svg"
                  alt="안전거래 아이콘"
                  width={220}
                  height={220}
                />
              </div>
              <div>
                <Image
                  src="/images/intro2-2.svg"
                  alt="신분증 아이콘"
                  width={220}
                  height={220}
                />
              </div>
              <div>
                <Image
                  src="/images/intro2-3.svg"
                  alt="커뮤니티 아이콘"
                  width={146}
                  height={220}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}