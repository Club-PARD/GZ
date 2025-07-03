import { initializeApp, getApps, getApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

// 사용자가 제공한 index.tsx 파일을 참고하여 Firebase 설정을 직접 입력합니다.
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyDA2ZqVA16jNbmLSptWAl7lQxg4UaMXsy8",
  authDomain: "zigu-e4f0f.firebaseapp.com",
  projectId: "zigu-e4f0f",
  storageBucket: "zigu-e4f0f.firebasestorage.app",
  messagingSenderId: "658258397768",
  appId: "1:658258397768:web:fe4f51b5d1fea5d72f667d",
  measurementId: "G-JXC21SED78"
};

const VAPID_KEY = "BCv6ceYaxfbQgl2643B-1-omt-s-FJ8u03ssD1OSMf17krwcAm1wliSsWBtuJpKm0S6P37cpUUm1H4e5_XKlsiQ";

// Firebase 앱 초기화
const app = getApps().length ? getApp() : initializeApp(FIREBASE_CONFIG);
const messaging = typeof window !== 'undefined' ? getMessaging(app) : undefined;

/**
 * FCM 토큰을 요청하고 반환합니다.
 * 브라우저에서 알림 권한을 요청합니다.
 * @param {(token: string) => void} onTokenReceived - 토큰 수신 시 호출될 콜백 함수
 */
export const requestFcmToken = (
  onTokenReceived: (token: string) => void,
) => {
  if (!messaging) return;

  Notification.requestPermission().then(permission => {
    if (permission === 'granted') {
      console.log('알림 권한이 허용되었습니다.');
      getToken(messaging, {
        vapidKey: VAPID_KEY, // VAPID 키 직접 사용
      })
        .then(currentToken => {
          if (currentToken) {
            console.log('FCM 토큰:', currentToken);
            onTokenReceived(currentToken);
          } else {
            console.log('FCM 토큰을 얻을 수 없습니다. 알림 권한을 확인하세요.');
          }
        })
        .catch(err => {
          console.error('FCM 토큰 요청 중 오류 발생:', err);
        });
    } else {
      console.log('알림 권한이 거부되었습니다.');
    }
  });
};

/**
 * 포그라운드 메시지 수신 리스너를 설정합니다.
 * 앱이 활성화된 상태에서 메시지를 받으면 이 리스너가 호출됩니다.
 */
export const onForegroundMessage = () => {
  if (messaging) {
    onMessage(messaging, payload => {
      console.log('포그라운드 메시지 수신:', payload);
      
      const sendbirdPayload = payload.data && payload.data.sendbird ? JSON.parse(payload.data.sendbird) : null;

      // Sendbird 페이로드가 있으면 해당 정보로 알림 생성
      if (sendbirdPayload) {
        const notificationTitle = sendbirdPayload.push_title || '새 메시지';
        const notificationOptions = {
          body: sendbirdPayload.message || '새로운 메시지가 도착했습니다.',
          icon: '/images/logo.svg', // 알림 아이콘
          data: {
             url: `/channels/${sendbirdPayload.channel.channel_url}`
          }
        };
        const notification = new Notification(notificationTitle, notificationOptions);
        notification.onclick = (event) => {
            event.preventDefault(); // 브라우저의 기본 동작 방지
            window.open(notification.data.url, '_blank');
        };
      } else if (payload.notification) { // Firebase 콘솔 등에서 직접 보낸 테스트 알림 처리
        const notificationTitle = payload.notification.title || '새 메시지';
        const notificationOptions = {
          body: payload.notification.body,
          icon: '/images/logo.svg',
        };
        new Notification(notificationTitle, notificationOptions);
      }
    });
  }
};

export { app, messaging }; 