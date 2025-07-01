import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <div className="pl-[260px] pr-[272px] bg-[#FFFFFF]">
      <header className="w-full flex justify-between items-center px-8 py-4">
        <Image src="/images/logo.svg" alt="로고" width={63} height={20} />
        <div className="flex items-center gap-2">
          <Link href="/cert/login">
            <button className="px-4 py-1 bg-[#E9E9E9] text-black rounded hover:bg-gray-200">
              로그인
            </button>
          </Link>
        </div>
      </header>
    </div>
  );
}
