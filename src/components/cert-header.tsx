import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <div className=" pl-[260px] pr-[272px] bg-white h-[68px]">
      <header className="w-full flex justify-between items-center px-8 py-4 h-full">
        <Link href={'/'}>
          <Image 
          src="/images/blogo.svg" 
          alt="로고" 
          width={94} 
          height={20} 
          style={{width: 'auto', height: 'auto'}} 
          priority
        />
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/cert/login"
            className="text-black px-6 py-2 rounded-md hover:bg-gray-200 transition-colors"
          >
            로그인
          </Link>
          <Link
            href="/"
            className="text-black px-6 py-2 rounded-md hover:bg-gray-200 transition-colors"
          >
            고객센터
          </Link>

        </div>
      </header>
    </div>
  );
}
