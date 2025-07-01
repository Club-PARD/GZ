import Image from 'next/image';
import BottomButton from '@/components/bottom_button';

export default function Footer() {
  return (
    <div className="w-full bg-[#F9F9FB] py-20">
      <div className="flex items-start gap-8 px-[260px]">
        <div className="flex flex-col gap-2 w-full">
          <div className='flex flex-row justify-between items-center'>
            <Image
              src="/images/logo.svg"
              alt="logo"
              width={64}
              height={32}
            />
            <BottomButton />
          </div>
          <p className="text-[#828286] text-[16px] font-normal">
            '지구'는 대학생들이 캠퍼스 안에서 단기간 필요한 물건을<br />
            빠르게 빌리고 빌려주는 P2P 대여 플랫폼입니다.
          </p>
        </div>
      </div>
    </div>
  )
}
