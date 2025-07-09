// pages/MyPostsPage.tsx
import React, { useState, useEffect } from 'react';
import Header from '@/components/home-header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { getMyPosts } from '@/lib/api';

interface ApiResponse {
  status: number;
  success: boolean;
  message: string;
  data: Post[];
}

interface Post {
  post_id: number;
  firstImageUrl: string;
  itemName: string;
  category: string;
  price_per_hour: number;
  price_per_day: number;
}

const MyPostsPage: React.FC = () => {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [hasPosts, setHasPosts] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [me, setMe] = useState<string>("");

  // 로그인 상태 확인
  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("me") : null;
    if (!stored) {
      router.replace("/cert/login");
      return;
    }
    setMe(stored);
  }, [router]);

  useEffect(() => {
    const fetchMyPosts = async () => {
      if (!me) {
        setIsLoading(false);
        return;
      }

      try {
        const json: ApiResponse = await getMyPosts();
        if (json.success) {
          setPosts(json.data);
          setHasPosts(json.data.length > 0);
        } else {
          console.error('API 오류:', json.message);
          setPosts([]);
          setHasPosts(false);
        }
      } catch (err: any) {
        if (err.response?.status === 401 || err.response?.status === 403) {
          localStorage.removeItem("me");
          localStorage.removeItem("savedCredentials");
          router.replace("/cert/login");
          return;
        }
        console.error('데이터 가져오기 실패:', err);
        setPosts([]);
        setHasPosts(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyPosts();
  }, [me, router]);

  // 로딩 중 UI
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">내 물건 목록을 불러오는 중...</p>
      </div>
    );
  }

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

        {hasPosts ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {posts.map(post => (
              <Link
                key={post.post_id}
                href="/detail/detail-page-producer"
                className="block cursor-pointer hover:opacity-80 transition-opacity"
              >
                <div className="bg-white rounded-lg overflow-hidden">
                  <div className="relative w-full h-[220px]">
                    <Image
                      src={post.firstImageUrl ? `/api/image-proxy?url=${post.firstImageUrl}` : '/images/camera.jpg'}
                      alt={post.itemName}
                      fill
                      style={{ objectFit: 'cover' }}
                      className="rounded-t-lg"
                      unoptimized
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/images/camera.jpg';
                      }}
                    />
                  </div>
                  <div className="p-4">
                    <h2 className="text-[18px] font-medium text-gray-900 mb-2">
                      {post.itemName}
                    </h2>
                    <div className="space-y-1">
                      <div className="flex items-baseline">
                        <span className="text-[18px] font-semibold text-gray-900">
                          {post.price_per_hour.toLocaleString()}원
                        </span>
                        <span className="text-[14px] text-gray-500 pl-1">/1시간</span>
                      </div>
                      <div className="flex items-baseline">
                        <span className="text-[18px] font-semibold text-gray-900">
                          {post.price_per_day.toLocaleString()}원
                        </span>
                        <span className="text-[14px] text-gray-500 pl-1">/1일</span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
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
