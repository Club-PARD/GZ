"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import LoadingBalls from "@/components/loading-components/loding-ball";
import { ProducerView } from "@/components/detail/ProducerView";
import { ConsumerView } from "@/components/detail/ConsumerView";

// API 응답 래퍼 타입
interface ApiResponse<T> {
  status: number;
  success: boolean;
  message: string;
  data: T;
}

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

export default function DetailPage() {
    const router = useRouter();
    const { postId } = router.query;
  
    const [me, setMe] = useState<string>("");
    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const storedMe = localStorage.getItem("me") || "";
        setMe(storedMe);
    }, []);
  
    useEffect(() => {
      if (!router.isReady || !postId) return;
  
      setLoading(true);
      (async function fetchDetail() {
        try {
          // detail-page-producer는 특별한 경로로 처리
          if (postId === 'detail-page-producer') {
            const registeredItem = localStorage.getItem('registeredItem');
            if (registeredItem) {
              const itemData = JSON.parse(registeredItem);
              console.log('localStorage에서 가져온 데이터:', itemData);
              
              // localStorage 데이터를 Post 인터페이스에 맞게 변환
              const postData: Post = {
                user_id: parseInt(localStorage.getItem('me') || '0'),
                nickname: "나",
                itemName: itemData.userInput?.itemName || itemData.data?.itemName || "제목 없음",
                post_id: itemData.data?.postId || Date.now(),
                imageUrls: itemData.imageUrls || itemData.data?.imageUrls || [],
                price_per_hour: itemData.userInput?.price_per_hour || itemData.data?.price_per_hour || 0,
                price_per_day: itemData.userInput?.price_per_day || itemData.data?.price_per_day || 0,
                description: itemData.userInput?.description || itemData.data?.description || "",
                category: itemData.userInput?.category || itemData.data?.category || "ETC"
              };
              
              setPost(postData);
              setLoading(false);
              return;
            } else {
              setError("등록된 물건 정보를 찾을 수 없습니다.");
              setLoading(false);
              return;
            }
          }

          // 일반적인 게시물 ID로 처리
          const res = await axios.get<ApiResponse<Post>>(
            "/api/post/detail",
            { params: { postId } }
          );
          if (res.data.success) {
            setPost(res.data.data);
          } else {
            setError(res.data.message || "게시물을 찾을 수 없습니다.");
          }
        } catch(e) {
          setError("게시물 정보를 불러오는 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
      })();
    }, [router.isReady, postId]);
  
    if (loading) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white">
          <LoadingBalls />
          <p className="text-gray-600 mt-4">상품 정보를 불러오는 중입니다...</p>
        </div>
      );
    }
  
    if (error) {
        return (
          <div className="min-h-screen flex items-center justify-center">
            <p className="text-red-500">{error}</p>
          </div>
        );
      }

    if (!post) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-500">상품 정보를 불러올 수 없습니다.</p>
        </div>
      );
    }
    
    const isOwner = me === String(post.user_id);

    return isOwner ? <ProducerView post={post} /> : <ConsumerView post={post} me={me} />;
  } 