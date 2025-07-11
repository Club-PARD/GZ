import React from "react";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import Header from "@/components/home-header";
import Footer from "@/components/Footer";
import styles from "../../styles/detail.module.css";

// 공통 상세페이지 데이터 타입
interface Post {
  user_id: number;
  nickname: string;
  itemName: string;
  post_id: number;
  imageUrls?: string[];
  price_per_hour?: number;
  price_per_day?: number;
  description: string;
  category: string;
}

// 판매자 뷰
export const ProducerView = ({ post }: { post: Post }) => {
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editForm, setEditForm] = useState({
        itemName: post.itemName || "",
        pricePerHour: post.price_per_hour || 0,
        pricePerDay: post.price_per_day || 0,
        description: post.description || "",
    });
    
    const categoryMap: Record<string, string> = {
        ELECTRONICS: "전자기기",
        HEALTH: "건강",
        INTEREST: "취미/여가",
        BEAUTYFASION: "뷰티/패션",
        ACADEMIC: "도서/학업",
        ESSENTIALS: "생활용품",
        ETC: "기타",
    };
    const defaultImages = ["/images/camera.jpg"];

    const images =
    post.imageUrls && post.imageUrls.length > 0
      ? post.imageUrls.map((url) => {
          // Data URL인 경우 프록시를 거치지 않고 직접 사용
          if (url.startsWith('data:')) {
            return url;
          }
          // 일반 URL인 경우 프록시 사용
          return `/api/image-proxy?url=${url}`;
        })
      : defaultImages;

    const nickname = post.nickname || "알 수 없음";
    const itemName = post.itemName || "제목 없음";
    const categoryLabel = categoryMap[post.category] || post.category;

    const handleEdit = () => {
        setShowEditModal(true);
        setIsMenuOpen(false);
    };

    const handleDelete = async () => {
        if (!confirm("정말로 삭제하시겠습니까?")) {
            setIsMenuOpen(false);
            return;
        }

        try {
            const response = await fetch(`/api/post/delete?postId=${post.post_id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                alert("게시물이 삭제되었습니다.");
                router.push("/home"); // 홈으로 리다이렉트
            } else {
                const data = await response.json();
                alert(data.message || "삭제 중 오류가 발생했습니다.");
            }
        } catch (error) {
            console.error("삭제 중 오류:", error);
            alert("삭제 중 오류가 발생했습니다.");
        }
        setIsMenuOpen(false);
    };

    const handleEditFormChange = (field: string, value: string | number) => {
        setEditForm(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const submitEdit = async () => {
        try {
            const response = await fetch('/api/post/update', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    postId: post.post_id,
                    itemName: editForm.itemName,
                    pricePerHour: editForm.pricePerHour,
                    pricePerDay: editForm.pricePerDay,
                    description: editForm.description,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                alert("게시물이 수정되었습니다.");
                setShowEditModal(false);
                window.location.reload(); // 페이지 새로고침으로 변경사항 반영
            } else {
                alert(data.message || "수정 중 오류가 발생했습니다.");
            }
        } catch (error) {
            console.error("수정 중 오류:", error);
            alert("수정 중 오류가 발생했습니다.");
        }
    };

    return (
        <div className="bg-white pt-[80px]">
        <Header />
  
        <main className="max-w-5xl mx-40 my-8 flex gap-8">
          <section className="w-1/2 space-y-4">
            {images.map((src, idx) => (
              <div key={idx} className={styles.imageContainer}>
                <Image
                  src={src}
                  alt={`image-${idx}`}
                  width={580}
                  height={580}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  unoptimized
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/images/camera.jpg";
                  }}
                />
              </div>
            ))}
          </section>
  
          <section className="w-[560px] h-[500px] space-y-4 border border-gray-300 rounded-lg p-4 fixed right-40 bottom-16 top-[113px]">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-1">
                <Image
                  src="/chat/chat-profile.svg"
                  alt="프로필"
                  width={32}
                  height={32}
                  unoptimized
                />
                <span className="font-medium text-[#232323]">{nickname}</span>
              </div>
              
              {/* 점 세개 더보기 메뉴 */}
              <div className="relative">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="10" cy="4" r="1.5" fill="#6B7280" />
                    <circle cx="10" cy="10" r="1.5" fill="#6B7280" />
                    <circle cx="10" cy="16" r="1.5" fill="#6B7280" />
                  </svg>
                </button>
                
                {/* 드롭다운 메뉴 */}
                {isMenuOpen && (
                  <div className="absolute right-0 top-8 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    <button
                      onClick={handleEdit}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-t-lg transition-colors flex items-center"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      수정하기
                    </button>
                    <button
                      onClick={handleDelete}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 rounded-b-lg transition-colors flex items-center"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      삭제하기
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold text-[#232323]">{itemName}</h1>
              <span className="px-2 py-1 bg-[#F2E8FF] text-[#6B46C1] text-xs rounded-full">
                {categoryLabel}
              </span>
            </div>
  
            <div className="border-b border-gray-200" />
  
            <div className="flex gap-4">
  <p className="mt-1 text-lg font-semibold text-[#ADAEB2] w-12">
    1시간
  </p>
  <p className="mt-1 text-lg font-semibold text-black w-20 text-right whitespace-nowrap">
    {(post.price_per_hour || 0).toLocaleString()}원
  </p>
</div>
<div className="flex gap-4">
  <p className="mt-1 text-lg font-semibold text-[#ADAEB2] w-12">
    1일
  </p>
  <p className="mt-1 text-lg font-semibold text-black w-20 text-right whitespace-nowrap">
    {(post.price_per_day || 0).toLocaleString()}원
  </p>
</div>

  
            <div className="border-b border-gray-200 pt-[36px]" />
  
            <div className="p-4 h-48 bg-[#F9F9FA] rounded-lg text-sm text-gray-700 overflow-hidden">
              <div className="h-full overflow-hidden break-all whitespace-pre-wrap">
                {post.description || "설명이 없습니다."}
              </div>
            </div>
          </section>
        </main>

        {/* 수정하기 모달 */}
        {showEditModal && (
          <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto">
              <h2 className="text-xl font-bold mb-4 text-black">게시물 수정</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 text-black">
                    제목
                  </label>
                  <input
                    type="text"
                    value={editForm.itemName}
                    onChange={(e) => handleEditFormChange('itemName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6849FE] text-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 text-black">
                    시간당 가격 (원)
                  </label>
                  <input
                    type="number"
                    value={editForm.pricePerHour}
                    onChange={(e) => handleEditFormChange('pricePerHour', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6849FE] text-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 text-black">
                    일일 가격 (원)
                  </label>
                  <input
                    type="number"
                    value={editForm.pricePerDay}
                    onChange={(e) => handleEditFormChange('pricePerDay', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6849FE] text-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 ">
                    설명
                  </label>
                  <textarea
                    value={editForm.description}
                    onChange={(e) => handleEditFormChange('description', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6849FE] h-32 resize-none text-black"
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-6">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 py-2 px-4 bg-gray-200 text-gray-800 rounded-lg"
                >
                  취소
                </button>
                <button
                  onClick={submitEdit}
                  className="flex-1 py-2 px-4 bg-[#6849FE] text-white rounded-lg"
                >
                  수정완료
                </button>
              </div>
            </div>
          </div>
        )}
  
        <Footer />
      </div>
    )
} 