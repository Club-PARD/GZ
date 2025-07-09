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
              className="bg-[#6849FE] text-white rounded-lg h-[55px] w-[193px] font-medium inline-flex items-center justify-center"
            >
              학교메일로 시작하기
            </Link>
      </div>

      <div className={styles.grid}>
        {PRODUCTS.map((p, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className={styles.wrapper}>
              <Image
                src={p.src}
                alt={p.alt}
                fill
                className="object-cover"
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
