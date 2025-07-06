import { useRouter } from 'next/router';
import React from 'react';
import Header from '@/components/home-header';
import Footer from '@/components/Footer';

export default function DetailDynamicPage() {
  const router = useRouter();
  const { id } = router.query;

  return (
    <div className="bg-white min-h-screen pt-[80px]">
      <Header />
      <main className="max-w-5xl mx-auto my-8 p-8">
        <h1 className="text-2xl font-bold mb-4">상세 페이지</h1>
        <p>아이템 ID: <span className="font-mono text-lg text-purple-600">{id}</span></p>
        {/* TODO: id로 상세 정보 fetch 후 렌더링 */}
      </main>
      <Footer />
    </div>
  );
} 