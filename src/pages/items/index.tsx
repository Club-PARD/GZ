// pages/MyPostsPage.tsx
import React, { useState, useEffect } from 'react';
import Header from '@/components/home-header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';

interface Post {
  id: number;
  imageUrl: string;
  title: string;
  hourlyPrice: number;
  dailyPrice: number;
  category: string;
  state: string;
}

const MyPostsPage: React.FC = () => {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [hasPosts, setHasPosts] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const dummyPosts: Post[] = [
    {
      id: 1,
      imageUrl: "/images/usb.jpg",
      title: "테스트 책상",
      hourlyPrice: 1000,
      dailyPrice: 5000,
      category: "가구",
      state: "대여중"
    },
    {
      id: 2,
      imageUrl: "/images/bag.jpg",
      title: "테스트 의자",
      hourlyPrice: 500,
      dailyPrice: 3000,
      category: "가구",
      state: "대여중"
    },
  ];

  useEffect(() => {
    // 실제 fetch 대신 더미 데이터 사용
    setPosts(dummyPosts);
    setHasPosts(dummyPosts.length > 0);
    setIsLoading(false);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white pt-[60px]">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8 pb-[67px]">
        <h1
          style={{
            color: "var(--Gray-10, #232323)",
            textAlign: "center",
            fontFamily: `"Pretendard Variable", sans-serif`,
            fontSize: "32px",
            fontWeight: 600,
            lineHeight: "130%",
            letterSpacing: "-0.64px",
          }}
        >
          내 물건
        </h1>

        {isLoading ? (
          <p className="text-center text-gray-400">불러오는 중...</p>
        ) : hasPosts ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {posts.map(post => (
              <Link
                key={post.id}
                href="/detail/detail-page-producer"
                className="block cursor-pointer hover:opacity-80 transition-opacity"
              >
                <div className="bg-white rounded-lg overflow-hidden">
                  <div className="relative w-full h-[220px]">
                    <Image
                      src={post.imageUrl}
                      alt={post.title}
                      fill
                      style={{ objectFit: 'cover' }}
                      className="rounded-t-lg"
                    />
                  </div>
                  <div className="p-4">
                    <h2 className="text-[18px] font-medium text-gray-900 mb-2">
                      {post.title}
                    </h2>
                    <div className="space-y-1">
                      <div className="flex items-baseline">
                        <span className="text-[18px] font-semibold text-gray-900">
                          {post.hourlyPrice.toLocaleString()}원
                        </span>
                        <span className="text-[14px] text-gray-500 pl-1">/1시간</span>
                      </div>
                      <div className="flex items-baseline">
                        <span className="text-[18px] font-semibold text-gray-900">
                          {post.dailyPrice.toLocaleString()}원
                        </span>
                        <span className="text-[14px] text-gray-500 pl-1">/1일</span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="inline-block text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded">
                          {post.state}
                        </span>
                        <span className="inline-block text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                          {post.category}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <Link href="/detail/detail-page-producer">
              <Image
                src="/images/emptyfolder.svg"
                alt="등록된 물건이 없어요"
                className="w-30 h-30 flex-shrink-0"
                width={120}
                height={120}
              />
            </Link>
            <p className="text-gray-500 mb-6">등록한 물건이 없어요</p>
            <Link href="/detail/new-page" passHref>
              <button className="inline-flex items-center justify-center px-4 py-2 gap-2 bg-purple-600 text-white rounded-lg text-sm font-medium">
                + 물건 등록하기
              </button>
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default MyPostsPage;
