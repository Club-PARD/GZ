import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <div className="pl-[166px] pr-[272px] bg-[#6849FE]">
      <header className="w-full flex justify-between items-center px-8 py-4">
        <Image src="/images/logo.svg" alt="로고" width={94} height={20} />
      </header>
    </div>
  );
}
