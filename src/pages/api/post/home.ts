import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // GET 메서드만 허용
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // 클라이언트로부터 받은 쿠키를 백엔드로 전달
    const forwardHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // 쿠키가 있으면 전달
    if (req.headers.cookie) {
      forwardHeaders['Cookie'] = req.headers.cookie;
    }

    // Authorization 헤더가 있으면 전달
    if (req.headers.authorization) {
      forwardHeaders['Authorization'] = req.headers.authorization;
    }

    console.log('🔄 백엔드로 홈 데이터 요청:', {
      url: 'https://gz-zigu.store/post/home',
      headers: forwardHeaders,
    });

    // 백엔드 API 호출
    const backendResponse = await fetch('https://gz-zigu.store/post/home', {
      method: 'GET',
      headers: forwardHeaders,
    });

    console.log('📊 백엔드 응답 상태:', backendResponse.status);

    // 백엔드 응답을 클라이언트에 전달
    const data = await backendResponse.text();
    
    // 응답 헤더도 전달
    const setCookieHeader = backendResponse.headers.get('set-cookie');
    if (setCookieHeader) {
      res.setHeader('Set-Cookie', setCookieHeader);
    }

    res.status(backendResponse.status);
    
    // JSON 응답인지 확인
    const contentType = backendResponse.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      res.setHeader('Content-Type', 'application/json');
      try {
        const jsonData = JSON.parse(data);
        return res.json(jsonData);
      } catch (parseError) {
        console.error('❌ JSON 파싱 실패:', parseError);
        return res.status(500).json({ message: 'Invalid JSON response from backend' });
      }
    } else {
      return res.send(data);
    }
  } catch (error) {
    console.error('❌ 홈 API 프록시 에러:', error);
    return res.status(500).json({ 
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 