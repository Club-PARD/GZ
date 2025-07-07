import Image from 'next/image';
import Link from 'next/link'
export default function Footer() {
  return (
    <div className="w-full bg-[#F3F3F5] py-20 h-[280px]">
      <div className="flex items-start gap-8 px-[260px]">
        <div className="flex flex-col gap-2 w-full">
          <div className='flex flex-row justify-between items-center'>
            <Image
              src="/images/blogo.svg"
              alt="logo"
              width={64}
              height={32}
            />
   
          </div>
          {/*수정필요*/}
          <p className="text-[#828286] text-[16px] font-normal">
            &apos;지구&apos;는 대학생들이 캠퍼스 안에서 단기간 필요한 물건을<br />
            빠르게 빌리고 빌려주는 P2P 대여 플랫폼입니다.
          </p>
           <div className="flex items-center gap-4 mt-20 text-[#B0B0B0] text-[14px]">
            <Link href="/terms" className="hover:underline">
              서비스 이용약관
            </Link>
            <Link href="/privacy" className="hover:underline">
              개인정보 수집·이용
            </Link>
            <Link href="/settings" className="hover:underline">
              환경설정
            </Link>
           </div>

        </div>
      </div>
    </div>
  )
}
