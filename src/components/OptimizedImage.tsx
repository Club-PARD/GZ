import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
  fill?: boolean;
  priority?: boolean;
  onLoad?: () => void;
  onError?: () => void;
  fallbackText?: string;
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  style = {},
  fill = false,
  priority = false,
  onLoad,
  onError,
  fallbackText = '이미지 로드 실패'
}: OptimizedImageProps) {
  const [currentSrc, setCurrentSrc] = useState<string>('');
  const [attemptIndex, setAttemptIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);

  // gz-zigu.store 이미지에 대한 다양한 경로 시도
  const generatePossiblePaths = (originalSrc: string): string[] => {
    if (originalSrc.startsWith('https://gz-zigu.store/')) {
      // 이미 전체 URL인 경우
      const paths = [
        `/api/image/proxy?url=${encodeURIComponent(originalSrc)}`, // 프록시 사용
        originalSrc, // 원본 URL
      ];
      return paths;
    } else if (originalSrc.startsWith('/') || !originalSrc.includes('://')) {
      // 로컬 파일이거나 상대 경로인 경우
      return [originalSrc];
    } else {
      // 다른 외부 URL인 경우
      return [originalSrc];
    }
  };

  const possiblePaths = generatePossiblePaths(src);

  useEffect(() => {
    setAttemptIndex(0);
    setIsLoading(true);
    setHasError(false);
  }, [src]);

  useEffect(() => {
    if (attemptIndex < possiblePaths.length) {
      setCurrentSrc(possiblePaths[attemptIndex]);
      setIsLoading(true);
      setHasError(false);
    } else {
      setHasError(true);
      setIsLoading(false);
    }
  }, [attemptIndex, possiblePaths]);

  const handleError = () => {
    console.log(`❌ 이미지 로드 실패 (${attemptIndex + 1}/${possiblePaths.length}):`, possiblePaths[attemptIndex]);
    
    if (onError) {
      onError();
    }
    
    if (attemptIndex < possiblePaths.length - 1) {
      setAttemptIndex(prev => prev + 1);
    } else {
      setHasError(true);
      setIsLoading(false);
    }
  };

  const handleLoad = () => {
    console.log(`✅ 이미지 로드 성공:`, possiblePaths[attemptIndex]);
    setIsLoading(false);
    setHasError(false);
    
    if (onLoad) {
      onLoad();
    }
  };

  // 에러 상태일 때 fallback UI
  if (hasError || attemptIndex >= possiblePaths.length) {
    return (
      <div 
        className={`${className} bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300`}
        style={{ 
          ...style,
          ...(fill ? { position: 'absolute', inset: 0 } : { width, height })
        }}
      >
        <div className="text-center">
          <div className="text-gray-400 text-2xl mb-1">📷</div>
          <span className="text-gray-500 text-xs">{fallbackText}</span>
        </div>
      </div>
    );
  }

  // 로딩 중 UI
  if (isLoading) {
    return (
      <>
        <div 
          className={`${className} bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300`}
          style={{ 
            ...style,
            ...(fill ? { position: 'absolute', inset: 0 } : { width, height })
          }}
        >
          <div className="text-center">
            <div className="text-gray-400 text-2xl mb-1">⏳</div>
            <span className="text-gray-500 text-xs">로딩 중...</span>
          </div>
        </div>
        {/* 실제 이미지는 숨김 처리하여 로드 테스트 */}
        {fill ? (
          <Image
            src={currentSrc}
            alt={alt}
            fill
            style={{ display: 'none' }}
            onLoad={handleLoad}
            onError={handleError}
            priority={priority}
          />
        ) : (
          <Image
            src={currentSrc}
            alt={alt}
            width={width!}
            height={height!}
            style={{ display: 'none' }}
            onLoad={handleLoad}
            onError={handleError}
            priority={priority}
          />
        )}
      </>
    );
  }

  // 성공적으로 로드된 이미지
  return fill ? (
    <Image
      src={currentSrc}
      alt={alt}
      fill
      className={className}
      style={style}
      onLoad={handleLoad}
      onError={handleError}
      priority={priority}
    />
  ) : (
    <Image
      src={currentSrc}
      alt={alt}
      width={width!}
      height={height!}
      className={className}
      style={style}
      onLoad={handleLoad}
      onError={handleError}
      priority={priority}
    />
  );
} 