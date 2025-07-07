import Image from "next/image";

export default function Divider() {
  return (
    <div>
        <Image src="/images/divider.svg" 
        alt="divider" 
        width={100} 
        height={80} 
        className="w-full"
        />
    </div>
  );
}