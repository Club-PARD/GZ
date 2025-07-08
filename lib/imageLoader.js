export default function imageLoader({ src, width, quality }) {
  // gz-zigu.store 이미지인 경우 프록시를 통해 로드
  if (src.startsWith('https://gz-zigu.store/')) {
    const encodedSrc = encodeURIComponent(src);
    return `/api/image/proxy?url=${encodedSrc}&w=${width}&q=${quality || 75}`;
  }
  
  // 다른 이미지는 그대로 반환
  return src;
} 