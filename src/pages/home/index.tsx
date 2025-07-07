// src/pages/index.tsx
import Header from "@/components/home-header";
import { IoSearchOutline } from "@/components/icons";
import { IoLocationSharp } from "react-icons/io5";
import styles from "./home.module.css";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Footer from "@/components/Footer";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", name: "전체" },
    { id: "electronics", name: "전자기기" },
    { id: "health", name: "건강" },
    { id: "hobby", name: "취미/여가" },
    { id: "beauty", name: "뷰티/패션" },
    { id: "study", name: "도서/학업" },
    { id: "life", name: "생활용품" },
    { id: "etc", name: "기타" },
  ];

  const items = [
    {
      id: 1,
      title: "1TB USB 빌려드려요",
      image: "/images/usb.jpg",
      category: "전자기기",
      price: { hour: 3000, day: 10000 },
      timeUnit: { hour: "1시간", day: "1일" },
    },
    {
      id: 2,
      title: "후지필름 카메라",
      image: "/images/camera.jpg",
      category: "취미/여가",
      price: { hour: 7000, day: 30000 },
      timeUnit: { hour: "1시간", day: "1일" },
    },
    {
      id: 3,
      title: "계산기 편하게 빌리세요",
      image: "/images/calculator.jpg",
      category: "도서/학업",
      price: { hour: 2000, day: 10000 },
      timeUnit: { hour: "1시간", day: "1일" },
    },
    {
      id: 4,
      title: "미니 선풍기 빌려드립니다",
      image: "/images/fan.jpg",
      category: "생활용품",
      price: { hour: 3000, day: 12000 },
      timeUnit: { hour: "1시간", day: "1일" },
    },
    {
      id: 5,
      title: "좋은 축구화임",
      image: "/images/shoes.jpg",
      category: "건강",
      price: { hour: 5000, day: 20000 },
      timeUnit: { hour: "1시간", day: "1일" },
    },
    {
      id: 6,
      title: "오피스백 대여해드림",
      image: "/images/bag.jpg",
      category: "생활용품",
      price: { hour: 3000, day: 12000 },
      timeUnit: { hour: "1시간", day: "1일" },
    },
    {
      id: 7,
      title: "공구 많아요",
      image: "/images/hammer.jpg",
      category: "생활용품",
      price: { hour: 5000, day: 20000 },
      timeUnit: { hour: "1시간", day: "1일" },
    },
    {
      id: 8,
      title: "비싼 캠핑 용품입니다.",
      image: "/images/camping.jpg",
      category: "생활용품",
      price: { hour: 3000, day: 12000 },
      timeUnit: { hour: "1시간", day: "1일" },
    },
  ];

  return (
    <main className="min-h-screen w-full flex flex-col relative bg-white pt-16">
      <Header />
      <div
        className="w-full flex flex-col items-center justify-center h-[351px]"
        style={{
          backgroundImage: "url(/images/main.svg)",
          backgroundSize: "contain",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundColor: "#6849FE",
        }}
      >
        <div className="flex flex-col items-center gap-8">
          <h1 className="text-[36px] font-bold text-white text-center">
            필요할때마다 사지말고,지구에서 잠깐 빌려요
          </h1>

          <div className="w-[780px] h-[68px] relative">
            <input
              className="w-full h-full bg-[#F3F3F5] pl-14 pr-6 text-lg rounded-full border border-gray-300 focus:outline-none focus:border-[#8769FF] focus:ring-1 focus:ring-[#8769FF] text-black"
              type="text"
              placeholder="지금 어떤 물건을 구매하고 있나요?"
            />
            <div className="absolute left-5 top-1/2 -translate-y-1/2">
              <IoSearchOutline size={24} color="#A2A3A7" />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center gap-8 pt-[20px]">
        <div className="flex items-center gap-2 mt-[50px] pl-[210px] self-start">
          <IoLocationSharp size={24} color="black" />
          <div className="text-[22px] font-bold text-black">
            한동대학교 학생들이 주고받은 물건들
          </div>
        </div>

        <div className="flex gap-2 pl-[210px] self-start">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full transition-colors ${
                selectedCategory === category.id
                  ? "bg-[#8769FF] text-white"
                  : "bg-[#F3F3F5] text-[#A2A3A7] hover:bg-[#F3F3F5]"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-5 gap-6 px-[150px]">
          {items
            .filter(
              (item) =>
                selectedCategory === "all" ||
                item.category ===
                  categories.find((c) => c.id === selectedCategory)?.name
            )
            .map((item) => (
              <Link
                key={item.id}
                href="detail/detail-page-consumer"
                className={styles.itemCard}
              >
                <div className={styles.imageContainer}>
                  <img
                    src={item.image}
                    alt={item.title}
                    className={styles.image}
                  />
                </div>
                <h3 className={styles.itemTitle}>{item.title}</h3>
                <div className={styles.priceContainer}>
                  <span className={styles.price}>{item.price.hour}원</span>
                  <span className="text-[#A2A3A7]">/{item.timeUnit.hour}</span>
                </div>
                <div className={styles.priceContainer}>
                  <span className={styles.price}>{item.price.day}원</span>
                  <span className="text-[#A2A3A7]">/{item.timeUnit.day}</span>
                </div>
                <div className=" flex flex-row gap-2">
                  <span className={styles.rentalTag}>대여중</span>
                  <span className={styles.categoryTag}>{item.category}</span>
                </div>
              </Link>
            ))}
        </div>
        <div className="flex w-full h-40"></div>
      </div>

      <Footer />

      <Link
        href="/detail/new-page"
        className="fixed bottom-8 right-8 bg-[#8769FF] 
        text-white px-6 py-4 rounded-lg flex items-center gap-2 hover:bg-[#7559EF] transition-colors shadow-lg"
      >
        <span className="text-2xl">+</span>
        <span className="text-[18px] font-bold">물건 등록하기</span>
      </Link>
    </main>
  );
}
