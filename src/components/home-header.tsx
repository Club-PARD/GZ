import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <div className="pl-[260px] pr-[272px bg-white">
      <header className="w-full flex justify-between items-center px-8 py-4">
        <Image src="/images/logo.svg" alt="로고" width={63} height={20} />
        <div className="flex items-center gap-2">
          <Link
            href="/profile"
            className="text-black px-6 py-2 rounded-md hover:bg-gray-200 transition-colors"
          >
            내채팅
          </Link>
          <Link
            href="/profile"
            className="text-black px-6 py-2 rounded-md hover:bg-gray-200 transition-colors"
          >
            대여내역
          </Link>
          <Link
            href="/profile"
            className="text-black px-6 py-2 rounded-md hover:bg-gray-200 transition-colors"
          >
            등록한 물건
          </Link>
          <Link href="/profile">
            <Image
              src="/images/profile.svg"
              alt="프로필 이미지"
              width={40}
              height={40}
            />
          </Link>
        </div>
      </header>
    </div>
  );
}
