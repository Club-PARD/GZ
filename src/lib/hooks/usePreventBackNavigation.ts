import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';

interface UsePreventBackNavigationOptions {
  enabled?: boolean;
  blockPaths?: string[];
}

export const usePreventBackNavigation = (options: UsePreventBackNavigationOptions = {}) => {
  const router = useRouter();
  const { enabled = true, blockPaths = ['/', '/cert/login', '/cert/register', '/cert/cert'] } = options;
  const isPreventing = useRef(false);

  useEffect(() => {
    if (!enabled) return;

    // popstate(뒤로가기)로 막기
    const handlePopState = () => {
      if (isPreventing.current) return;
      const currentPath = window.location.pathname;
      if (blockPaths.includes(currentPath)) {
        isPreventing.current = true;
        router.replace('/home');
        setTimeout(() => {
          isPreventing.current = false;
        }, 100);
      }
    };

    // 라우터 이동 자체를 막기
    const handleRouteChangeStart = (url: string) => {
      if (blockPaths.includes(url)) {
        router.events.emit('routeChangeError');
        router.replace('/home');
        return false;
      }
    };

    window.addEventListener('popstate', handlePopState);
    router.events.on('routeChangeStart', handleRouteChangeStart);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      router.events.off('routeChangeStart', handleRouteChangeStart);
    };
  }, [enabled, router, blockPaths]);
}; 