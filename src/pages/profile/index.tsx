import Header from "@/components/home-header";
import Footer from "@/components/Footer";
import React from "react";
import styles from "./profile.module.css";

// 거래 아이템의 타입 정의
interface Item {
  id: number; // 각 아이템의 고유 ID
  name: string; // 아이템 이름
  price: string; // 가격 문자열
  status: string; // 거래 상태 표시 (거래 완료, 거래 중 등)
  imageUrl?: string; // 이미지 URL (선택적)
}

// 더미 데이터 배열: 실제 API 대신 렌더링 용도로 사용
const dummyItems: Item[] = [
  {
    id: 1,
    name: "물건 이름 1",
    price: "₩12,000",
    status: "거래 완료",
    imageUrl: "/images/placeholder.png",
  },
  {
    id: 2,
    name: "물건 이름 2",
    price: "₩34,000",
    status: "거래 중",
    imageUrl: "/images/placeholder.png",
  },
  {
    id: 3,
    name: "물건 이름 3",
    price: "₩56,000",
    status: "거래 대기",
    imageUrl: "/images/placeholder.png",
  },
];

// ProfilePage 컴포넌트: 사용자 프로필 및 거래 내역 목록 표시
export default function ProfilePage() {
  // 하드코딩된 사용자 정보 (실제 환경에서는 API 호출로 대체)
  const nickname = "닉네임";
  const email = "gkrryrcibapdif@yu.ac.kr";

  // JSX 반환: 컴포넌트 렌더링 구조 정의
  return (
    // 최상위 wrapper: CSS 모듈의 배경, 레이아웃 적용
    <div className={styles.wrapper}>
      {/* 헤더 컴포넌트 렌더링 */}
      <Header />

      {/* 메인 컨텐츠 영역 */}
      <main className={styles.main}>
        {/* 프로필 헤더 섹션: 닉네임, 이메일, 뱃지, 버튼 */}
        <section className={styles.profileHeader}>
          {/* 프로필 정보: 닉네임과 이메일 */}
          <div className={styles.profileInfo}>
            <h1 className={styles.nickname}>{nickname}</h1>
            <p className={styles.email}>{email}</p>
          </div>

          {/* 프로필 정보 보기 버튼 */}
          <button className={styles.profileButton}>프로필 정보</button>
        </section>

        {/* 탭 섹션: 게시물/거래 탭 전환 UI */}
        <br />
        <section className={styles.tabs}>
          {/* 비활성 탭 */}
          <button className={styles.tabs}>내가 쓴 게시물</button>
          {/* 활성화된 탭 (active 스타일 추가) */}
          <button className={`${styles.tab} ${styles.active}`}>
            내가 거래한 물건
          </button>
        </section>

        {/* 거래 아이템 리스트 섹션 */}
        <section className={styles.itemList}>
          {/* 더미 데이터 반복 렌더링: .map() 사용 */}
          {dummyItems.map((item) => (
            <div key={item.id} className={styles.itemCard}>
              {/* 아이템 이미지 */}
              <img
                src={item.imageUrl}
                alt={item.name}
                className={styles.itemImage}
              />

              {/* 아이템 이름 및 가격 */}
              <div className={styles.itemDetails}>
                <h3 className={styles.itemName}>{item.name}</h3>
                <p className={styles.itemPrice}>{item.price}</p>
              </div>

              {/* 거래 상태 버튼 */}
              <button className={styles.statusButton}>{item.status}</button>
            </div>
          ))}
        </section>
      </main>

      {/* 푸터 컴포넌트 렌더링 */}
      <Footer />
    </div>
  );
}
