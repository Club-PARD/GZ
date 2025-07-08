import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    console.log('🔄 포스트 상세 정보 요청 시작');
    
    // Query parameters 가져오기
    const { postId, userId } = req.query;
    
    if (!postId) {
      return res.status(400).json({ message: 'postId is required' });
    }

    // 헤더 설정
    const forwardHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // 쿠키 전달
    if (req.headers.cookie) {
      forwardHeaders['Cookie'] = req.headers.cookie;
    }

    // Authorization 헤더 전달
    if (req.headers.authorization) {
      forwardHeaders['Authorization'] = req.headers.authorization;
    }

    // Query string 생성
    const queryParams = new URLSearchParams();
    queryParams.append('postId', String(postId));
    if (userId) {
      queryParams.append('userId', String(userId));
    }

    const backendUrl = `https://gz-zigu.store/post/detail?${queryParams.toString()}`;

    console.log('🔄 백엔드로 상세 정보 요청:', {
      url: backendUrl,
      postId,
      userId,
      hasCookie: !!forwardHeaders['Cookie'],
    });

    // 백엔드 API 호출
    const backendResponse = await fetch(backendUrl, {
      method: 'GET',
      headers: forwardHeaders,
    });

    console.log('📊 백엔드 응답 상태:', backendResponse.status);

    const data = await backendResponse.text();
    
    // 에러인 경우 상세 로깅
    if (backendResponse.status >= 400) {
      console.error('❌ 백엔드 에러 응답:');
      console.error('❌ 상태:', backendResponse.status);
      console.error('❌ 응답 본문:', data);
    }
    
    // 응답 헤더도 전달
    const setCookieHeader = backendResponse.headers.get('set-cookie');
    if (setCookieHeader) {
      res.setHeader('Set-Cookie', setCookieHeader);
    }

    res.status(backendResponse.status);
    
    const contentType = backendResponse.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      res.setHeader('Content-Type', 'application/json');
      try {
        const jsonData = JSON.parse(data);
        console.log('✅ 상세 정보 조회 성공:', jsonData);
        return res.json(jsonData);
      } catch (parseError) {
        console.error('❌ JSON 파싱 실패:', parseError);
        return res.status(500).json({ message: 'Invalid JSON response from backend' });
      }
    } else {
      return res.send(data);
    }
  } catch (error) {
    console.error('❌ 상세 정보 API 프록시 에러:', error);
    return res.status(500).json({ 
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 