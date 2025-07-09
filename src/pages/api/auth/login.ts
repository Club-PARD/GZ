import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // POST 메서드만 허용
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    console.log('🔄 백엔드로 로그인 요청:', {
      url: 'https://gz-zigu.store/auth/login',
      body: req.body,
    });

    // 백엔드 API 호출
    const backendResponse = await fetch('https://gz-zigu.store/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    console.log('📊 백엔드 로그인 응답 상태:', backendResponse.status);

    // 백엔드 응답을 클라이언트에 전달
    const data = await backendResponse.text();
    
    // Set-Cookie 헤더를 클라이언트로 전달
    const setCookieHeaders = backendResponse.headers.get('set-cookie');
    if (setCookieHeaders) {
      console.log('🍪 원본 쿠키:', setCookieHeaders);
      
      // 로컬 개발 환경을 위해 쿠키 속성 수정
      const modifiedCookie = setCookieHeaders
        .replace(/; Secure/g, '') // 로컬에서는 Secure 제거
        .replace(/; SameSite=None/g, '; SameSite=Lax'); // SameSite를 Lax로 변경
      
      console.log('🍪 수정된 쿠키:', modifiedCookie);
      res.setHeader('Set-Cookie', modifiedCookie);
    }

    res.status(backendResponse.status);
    
    // JSON 응답인지 확인
    const contentType = backendResponse.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      res.setHeader('Content-Type', 'application/json');
      try {
        const jsonData = JSON.parse(data);
        console.log('✅ 로그인 성공 응답:', jsonData);
        return res.json(jsonData);
      } catch (parseError) {
        console.error('❌ JSON 파싱 실패:', parseError);
        return res.status(500).json({ message: 'Invalid JSON response from backend' });
      }
    } else {
      return res.send(data);
    }
  } catch (error) {
    console.error('❌ 로그인 API 프록시 에러:', error);
    return res.status(500).json({ 
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 