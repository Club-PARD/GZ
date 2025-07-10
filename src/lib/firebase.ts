import { initializeApp, getApps, getApp } from 'firebase/app';
import { getMessaging, getToken, onMessage, isSupported, Messaging } from 'firebase/messaging';

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

// Messaging 초기화를 조건부로 처리
let messaging: Messaging | undefined = undefined;
if (typeof window !== 'undefined') {
  // FCM 지원 여부를 먼저 확인
  isSupported().then((supported) => {
    if (supported) {
      messaging = getMessaging(app);
    } else {
      console.warn('FCM이 이 브라우저에서 지원되지 않습니다.');
    }
  }).catch((error) => {
    console.error('FCM 지원 여부 확인 중 오류:', error);
  });
}

/**
 * 환경 및 브라우저 호환성을 확인하는 함수
 */
const checkEnvironment = (): { isValid: boolean; message?: string } => {
  // 브라우저 환경이 아닌 경우
  if (typeof window === 'undefined') {
    return { isValid: false, message: '브라우저 환경이 아닙니다.' };
  }

  // Service Worker 지원 여부 확인
  if (!('serviceWorker' in navigator)) {
    return { isValid: false, message: 'Service Worker가 지원되지 않는 브라우저입니다.' };
  }

  // Notification API 지원 여부 확인
  if (!('Notification' in window)) {
    return { isValid: false, message: 'Notification API가 지원되지 않는 브라우저입니다.' };
  }

  // HTTPS 환경 확인 (localhost 제외)
  const isLocalhost = window.location.hostname === 'localhost' || 
                     window.location.hostname === '127.0.0.1' || 
                     window.location.hostname.includes('localhost');
  
  if (!isLocalhost && window.location.protocol !== 'https:') {
    return { isValid: false, message: 'FCM은 HTTPS 환경에서만 작동합니다.' };
  }

  return { isValid: true };
};

/**
 * Service Worker 등록을 확인하고 필요시 등록하는 함수
 */
const ensureServiceWorkerRegistration = async (): Promise<boolean> => {
  try {
    const registration = await navigator.serviceWorker.getRegistration('/firebase-messaging-sw.js');
    
    if (!registration) {
      console.log('Service Worker를 등록합니다...');
      const newRegistration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
      console.log('Service Worker 등록 성공:', newRegistration);
      return true;
    } else {
      console.log('Service Worker가 이미 등록되어 있습니다:', registration);
      return true;
    }
  } catch (error) {
    console.error('Service Worker 등록 실패:', error);
    return false;
  }
};

/**
 * FCM 토큰을 요청하고 반환합니다.
 * 브라우저에서 알림 권한을 요청합니다.
 * @param {(token: string) => void} onTokenReceived - 토큰 수신 시 호출될 콜백 함수
 */
export const requestFcmToken = async (
  onTokenReceived: (token: string) => void,
) => {
  try {
    // 환경 검사
    const envCheck = checkEnvironment();
    if (!envCheck.isValid) {
      console.warn('FCM 토큰 요청 불가:', envCheck.message);
      return;
    }

    // FCM 지원 여부 재확인
    const supported = await isSupported();
    if (!supported) {
      console.warn('FCM이 이 브라우저에서 지원되지 않습니다.');
      return;
    }

    // Service Worker 등록 확인
    const swRegistered = await ensureServiceWorkerRegistration();
    if (!swRegistered) {
      console.error('Service Worker 등록에 실패했습니다.');
      return;
    }

    // Messaging 인스턴스가 없으면 초기화
    if (!messaging) {
      messaging = getMessaging(app);
    }

    // 알림 권한 요청
    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
      console.log('알림 권한이 허용되었습니다.');
      
      try {
        const currentToken = await getToken(messaging, {
          vapidKey: VAPID_KEY,
        });
        
        if (currentToken) {
          console.log('FCM 토큰:', currentToken);
          onTokenReceived(currentToken);
        } else {
          console.log('FCM 토큰을 얻을 수 없습니다. 브라우저 설정을 확인해주세요.');
        }
             } catch (tokenError: unknown) {
         const error = tokenError as Error;
         console.error('FCM 토큰 요청 중 오류 발생:', error);
         
         // AbortError 특별 처리
         if (error.name === 'AbortError') {
           console.error('웹 푸시 데몬 연결 실패. 다음을 확인해주세요:');
           console.error('1. 브라우저가 FCM을 지원하는지 확인');
           console.error('2. 브라우저 알림이 차단되지 않았는지 확인');
           console.error('3. HTTPS 환경인지 확인');
           console.error('4. 프라이빗/시크릿 모드가 아닌지 확인');
         }
       }
    } else if (permission === 'denied') {
      console.log('알림 권한이 거부되었습니다.');
    } else {
      console.log('알림 권한이 기본값으로 설정되어 있습니다.');
    }
  } catch (error) {
    console.error('FCM 초기화 중 오류 발생:', error);
  }
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