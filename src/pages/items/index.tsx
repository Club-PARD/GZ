// src/pages/MyPostsPage.tsx
import React, { useState, useEffect } from "react";
import Header from "@/components/home-header";
import Footer from "@/components/Footer";
import Link from "next/link";
interface Post {
  id: number;
  imageUrl: string;
  title: string;
  hourlyPrice: number;
  dailyPrice: number;
  category: string;
}

const MyPostsPage: React.FC = () => {
  // ① 하드코딩된 더미 게시물
  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      imageUrl: "/images/usb.jpg",
      title: "1TB USB 빌려드려요",
      hourlyPrice: 3000,
      dailyPrice: 10000,
      category: "전자기기",
    },
    {
      id: 2,
      imageUrl: "/images/camera.jpg",
      title: "후지필름 카메라",
      hourlyPrice: 7000,
      dailyPrice: 30000,
      category: "취미/여가",
    },
    {
      id: 3,
      imageUrl: "/images/calculator.jpg",
      title: "계산기 편하게 빌리세요",
      hourlyPrice: 2000,
      dailyPrice: 10000,
      category: "도서/학업",
    },
    {
      id: 4,
      imageUrl: "/images/fan.jpg",
      title: "미니 선풍기 빌려드립니다",
      hourlyPrice: 3000,
      dailyPrice: 12000,
      category: "생활용품",
    },
  ]);

  // ② 서버에서 실제 게시물 유무를 받아올 flag
  const [hasPosts, setHasPosts] = useState<boolean>(true);

  // ③ 마운트 시(혹은 필요할 때) 서버 호출: posts 배열과 hasPosts flag 업데이트
  useEffect(() => {
    fetch("/api/my-posts")
      .then((res) => res.json())
      .then((data: { items: Post[] }) => {
        if (data.items && data.items.length > 0) {
          setPosts(data.items);
          setHasPosts(true);
        } else {
          setPosts([]);
          setHasPosts(false);
        }
      })
      .catch(() => {
        // 에러나 빈 응답 시에도 빈 상태 처리
        setPosts([]);
        setHasPosts(false);
      });
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold mb-8 text-center">내 게시물</h1>

        {/* ④ posts가 있으면 그리드, 없으면 empty state */}
        {hasPosts ? (
          <div className="grid grid-cols-4 gap-6">
            {posts.map((post) => (
              <div
                key={post.id}
                className="
                  bg-white rounded-lg overflow-hidden shadow
                  flex flex-col
                "
              >
                {/* 이미지 */}
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />

                <div className="p-4 flex-1 flex flex-col justify-between">
                  {/* 제목 + 카테고리 */}
                  <div>
                    <h2 className="font-semibold mb-2">{post.title}</h2>
                    <span className="inline-block text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded">
                      {post.category}
                    </span>
                  </div>

                  {/* 가격 정보 */}
                  <div className="mt-4 space-y-1">
                    <div className="flex items-baseline">
                      <span className="text-lg font-bold">
                        {post.hourlyPrice.toLocaleString()}원
                      </span>
                      <span className="ml-1 text-sm text-gray-500">/1시간</span>
                    </div>
                    <div className="flex items-baseline">
                      <span className="text-lg font-bold">
                        {post.dailyPrice.toLocaleString()}원
                      </span>
                      <span className="ml-1 text-sm text-gray-500">/1일</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            {/* 빈 상태 아이콘 */}
            <img
              src="/images/emptyfolder.svg"
              alt="등록된 물건이 없어요"
              className="width: 120px height: 120px flex-shrink: 0 "
            />
            <p className="text-gray-500 mb-6">등록한 물건이 없어요</p>
            {/* 물건 등록 버튼 */}
            <Link href="/detail/new-page" passHref>
              <button
                className="
              inline-flex items-center justify-center
              px-4 py-2 gap-2
              bg-purple-600 text-white rounded-lg
              text-sm font-medium
            "
              >
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
