import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect } from 'react';
import { onForegroundMessage } from '@/lib/firebase';
import { initSendbird } from '@/lib/sendbird';

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // .env.local 파일에서 Sendbird App ID를 가져옵니다.
    const SENDBIRD_APP_ID = process.env.NEXT_PUBLIC_SENDBIRD_APP_ID;
    
    // 앱이 로드될 때 Sendbird를 초기화합니다.
    if (SENDBIRD_APP_ID) {
      console.log('Sendbird 초기화 중...', SENDBIRD_APP_ID);
      initSendbird(SENDBIRD_APP_ID);
    } else {
      // 환경 변수가 없을 경우 에러를 출력합니다.
      console.error("SENDBIRD_APP_ID is not defined. Please check your .env.local file and restart the server.");
      console.log('Available env vars:', Object.keys(process.env).filter(key => key.startsWith('NEXT_PUBLIC')));
    }

    // 포그라운드 메시지 리스너를 설정합니다.
    onForegroundMessage();
  }, []);

  return <Component {...pageProps} />;
}
