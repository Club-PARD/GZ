import Image from "next/image";
import Link from "next/link";

export default function BottomButton() {
  return (
    <div className="flex gap-4">
      <Link
        href="/about"
        className="text-[#828286] hover:text-[#8769FF] transition-colors"
      >
        메인
      </Link>
      <Link
        href="/about"
        className="text-[#828286] hover:text-[#8769FF] transition-colors"
      >
        내 채팅
      </Link>
      <Link
        href="/about"
        className="text-[#828286] hover:text-[#8769FF] transition-colors"
      >
        대여 내역
      </Link>
      <Link
        href="/about"
        className="text-[#828286] hover:text-[#8769FF] transition-colors"
      >
        등록한 물건
      </Link>
      <Link
        href="/about"
        className="text-[#828286] hover:text-[#8769FF] transition-colors"
      >
        내 프로필
      </Link>
      <Link
        href="/about"
        className="text-[#828286] hover:text-[#8769FF] transition-colors"
      >
        문의하기
      </Link>
    </div>
  );
}
