// public/firebase-messaging-sw.js

// Firebase SDK 스크립트를 가져옵니다.
importScripts('https://www.gstatic.com/firebasejs/9.15.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.15.0/firebase-messaging-compat.js');

// ❗ 중요: .env.local 파일을 만들고 본인의 Firebase 설정으로 교체해 주세요.
// 서비스 워커는 process.env에 접근할 수 없으므로, 설정 값을 직접 입력해야 합니다.
// 보안을 위해 이 값들을 직접 코드에 넣는 대신, 빌드 시 환경 변수를 주입하는 방식을 사용하는 것이 좋습니다.
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyDA2ZqVA16jNbmLSptWAl7lQxg4UaMXsy8",
  authDomain: "zigu-e4f0f.firebaseapp.com",
  projectId: "zigu-e4f0f",
  storageBucket: "zigu-e4f0f.firebasestorage.app",
  messagingSenderId: "658258397768",
  appId: "1:658258397768:web:fe4f51b5d1fea5d72f667d",
  measurementId: "G-JXC21SED78"
};

// Firebase 앱 초기화
firebase.initializeApp(FIREBASE_CONFIG);

const messaging = firebase.messaging();

// 백그라운드 메시지 핸들러
// 앱이 백그라운드에 있거나 닫혔을 때 FCM 메시지를 받으면 호출됩니다.
messaging.onBackgroundMessage(function(payload) {
  // Sendbird는 data 페이로드로 메시지를 보냅니다.
  // 이 데이터를 파싱하여 알림을 구성해야 합니다.
  const sendbirdPayload = payload.data && payload.data.sendbird ? JSON.parse(payload.data.sendbird) : null;

  if (!sendbirdPayload) {
    return;
  }
  
  const notificationTitle = sendbirdPayload.push_title || "새 메시지";
  const notificationOptions = {
    body: sendbirdPayload.message || "새로운 메시지가 도착했습니다.",
    icon: '/images/logo.svg', // 알림 아이콘
    data: {
      url: `/channels/${sendbirdPayload.channel.channel_url}` // 클릭 시 이동할 URL
    }
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// 알림 클릭 이벤트 핸들러
self.addEventListener('notificationclick', function(event) {
  event.notification.close(); // 알림 닫기

  // 알림 데이터에 포함된 URL로 이동
  const urlToOpen = event.notification.data.url;
  if (urlToOpen) {
    event.waitUntil(
      clients.openWindow(urlToOpen)
    );
  }
}); 