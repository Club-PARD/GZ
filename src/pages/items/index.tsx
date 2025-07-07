import React, { useState, useEffect } from 'react';
import Header from '@/components/home-header';
import Footer from '@/components/Footer';
import Link from 'next/link';

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
  const [posts, setPosts] = useState<Post[]>([]);
  const [hasPosts, setHasPosts] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);



  const dummyPosts: Post[] = [
  {
    id: 1,
    imageUrl: "/images/bag.jpg",
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
    state:"대여중"
  },
];

 /* useEffect(() => {
    fetch("/api/my-posts")
      .then((res) => res.json())
      .then((data: { items: Post[] }) => {
        setPosts(data.items);
        setHasPosts(data.items.length > 0);
      })
      .catch(() => {
        setPosts([]);
        setHasPosts(false);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []); */

useEffect(() => {
  // 👇 실제 fetch 대신
  setPosts(dummyPosts);
  setHasPosts(dummyPosts.length > 0);
  setIsLoading(false);
}, []);

  return (
    <div className="min-h-screen flex flex-col bg-white pt-[60px] ">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8 pb-[67px]">
      <h1
        style={{
          color: "var(--Gray-10, #232323)",
          textAlign: "center",
          fontFamily: `"Pretendard Variable", sans-serif`,
          fontSize: "32px",
          fontStyle: "normal",
          fontWeight: 600,
          lineHeight: "130%",
          letterSpacing: "-0.64px",
        }}
      >
        내 물건
      </h1>

        {isLoading ? (
          /* 로딩 스켈레톤이나 Spinner */
          <p className="text-center text-gray-400">불러오는 중...</p>
        ) : hasPosts ? (
          <div className="grid 
                          grid-cols-2 
                          sm:grid-cols-3 
                          md:grid-cols-4 
                          lg:grid-cols-5 
                          gap-6
                          ">
            {posts.map(post => (
              <div key={post.id} className="bg-[var(--White,#FFF)] rounded-lg overflow-hidden pt-[40px] ">
                {/* 이미지 크기 */}
                <img src={post.imageUrl} alt={post.title} 
                className="w-[332.075px] h-[220px] flex-shrink-0 aspect-[332.08/220] rounded-lg aspect-square " />
                {/* 물건 제목 */}
                  <div
                    className="
                      pt-[16px]
                      ml-[10px]
                      text-[var(--Gray-10,#232323)]
                      [font-family:'Pretendard Variable']
                      text-[18px]
                      font-medium
                      leading-[130%]
                      tracking-[-0.36px]
                    "
                  >
                  <div>
                    <h2 className="text-[var(--Gray-10)] [font-family:'Pretendard Variable'] text-[18px] font-medium leading-[130%] tracking-[-0.36px] mb-[16px]">{post.title}</h2>
                    
                  </div>
                  <div className="mt-4 space-y-1">
                    <div className="flex items-baseline">
                      <span className="text-[var(--Gray-10,#232323)] [font-family:'Pretendard Variable'] text-[18px] font-semibold leading-[130%] tracking-[-0.36px]
">{post.hourlyPrice.toLocaleString()}원</span>
                      <span className="text-[var(--Gray-06,#ADAEB2)] [font-family:'Pretendard Variable'] text-[14px] font-medium leading-[130%] tracking-[-0.28px]
                      pl-[4px]
                    ">/1시간</span>
                    </div>
                    <div className="flex items-baseline">
                      <span className=" text-[var(--Gray-10,#232323)]
                        [font-family:'Pretendard Variable']
                        text-[18px]
                        font-semibold     
                        leading-[130%]
                        tracking-[-0.36px]">{post.dailyPrice.toLocaleString()}원</span>
                      <span className="text-[var(--Gray-06,#ADAEB2)] [font-family:'Pretendard Variable'] text-[14px] font-medium leading-[130%] tracking-[-0.28px]
                      pl-[4px]">/1일</span>
                    </div>
                    
                    <span className="inline-block text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded mr-2">
                      {post.state}
                    </span>
                    <span className="inline-block text-xs rounded bg-[var(--Gray-03,#F3F3F5)] text-[var(--Gray-07,#828286)] px-2 py-0.5 rounded">
                      {post.category}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <img
              src="/images/emptyfolder.svg"
              alt="등록된 물건이 없어요"
              className="w-30 h-30 flex-shrink-0"
            />
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
