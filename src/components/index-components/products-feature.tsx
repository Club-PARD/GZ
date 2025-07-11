import Image from "next/image";
import styles from "../../styles/products-feature.module.css"; 
import Link from "next/link";

const PRODUCTS = [
  { src: "/images/usb.jpg",        alt: "1TB USB",         title: "1TB USB 빌려드려요" },
  { src: "/images/camera.jpg",     alt: "후지필름 카메라",  title: "후지필름 카메라"   },
  { src: "/images/calculator.jpg", alt: "계산기",           title: "계산기 편하게 빌리세요" },
  { src: "/images/fan.jpg",        alt: "미니 선풍기",       title: "미니 선풍기 빌려드립니다" },
  { src: "/images/shoes.jpg",      alt: "축구화",           title: "좋은 축구화임"     },
];

export default function ProductsFeature() {
  return (
    <section
      className="
        h-[781px]
        w-full
        px-[166px]
        py-32
        bg-[#232323]
        text-center
      "
    >
      <div className="mb-[80px] w-full">
      <span className="text-[#6849FE] text-[18px] font-semibold block mb-[10px]">물건등록하기</span>
      <h3 className="text-4xl font-semibold mb-[24px] text-white" style={{ letterSpacing: '-1.08%' }}>
        현재 지구에서는
        <br />
        이런 물건들이 거래되고 있어요
      </h3>
      <Link
              href="/cert/cert"
              className="inline-flex          
    justify-center       
    items-center         
    gap-1.5               
    px-5                   
    py-3                   
    rounded-[8px]         
    bg-[var(--Purple-04,#6849FE)]
    text-white text-[16px] font-normal leading-[130%] tracking-[-0.32px] 
    hover:bg-[#5933E4]"
            >
            지금 빌리러 가기
            </Link>
      </div>

      <div className={styles.grid}>
        {PRODUCTS.map((p, i) => (
          <div key={i} className="flex flex-col items-center ">
            <div className={styles.wrapper}>
              <Image
                src={p.src}
                alt={p.alt}
                fill
                className="object-cover w-[200px]             /* width: 200px */
    h-12                  /* height: 48px (12 * 4px) */
    flex-shrink-0         /* flex-shrink: 0 */
    rounded-lg            /* border-radius: 8px */
    bg-[var(--Gray-09,#4C4C4E)]  /* background: var(--Gray-09, #4C4C4E) */
    text-[var(--White,#FFF)]   /* color: var(--White, #FFF) */
    text-center                /* text-align: center */
    text-[18px]                /* font-size: 18px */
    font-medium                /* font-weight: 500 */
    leading-[130%]             /* line-height: 130% */
    tracking-[-0.36px]         /* letter-spacing: -0.36px */"
                
              />
            </div>

            {/* 여기부터 캡션 박스 적용 */}
            <div className="mt-[20px]">
              <div className={styles.captionBox}>
                <span className={styles.captionText}>
                  {p.title}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
