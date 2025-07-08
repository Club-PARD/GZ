import { NextApiRequest, NextApiResponse } from 'next';

// Next.js의 기본 body parser 비활성화 (raw body 처리를 위해)
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    console.log('🔄 포스트 생성 프록시 요청 시작');

    // raw body 읽기
    const chunks: Buffer[] = [];
    req.on('data', (chunk: Buffer) => {
      chunks.push(chunk);
    });

    await new Promise((resolve) => {
      req.on('end', resolve);
    });

    const body = Buffer.concat(chunks);
    console.log('📦 Body 크기:', body.length, 'bytes');

    // 헤더 설정 - 클라이언트 헤더를 그대로 전달
    const forwardHeaders: Record<string, string> = {};

    // Content-Type 헤더 전달 (multipart boundary 포함)
    if (req.headers['content-type']) {
      forwardHeaders['Content-Type'] = req.headers['content-type'];
    }

    // 쿠키 전달
    if (req.headers.cookie) {
      forwardHeaders['Cookie'] = req.headers.cookie;
    }

    // Authorization 헤더 전달
    if (req.headers.authorization) {
      forwardHeaders['Authorization'] = req.headers.authorization;
    }

    // Query parameter 전달 (userId 등)
    const queryString = req.url?.includes('?') ? req.url.split('?')[1] : '';
    const backendUrl = `https://gz-zigu.store/post/create${queryString ? `?${queryString}` : ''}`;

    console.log('🔄 백엔드로 포스트 생성 요청:', {
      url: backendUrl,
      contentType: forwardHeaders['Content-Type'],
      bodySize: body.length,
      hasCookie: !!forwardHeaders['Cookie'],
      queryParams: queryString,
    });

    // 백엔드 API 호출
    const backendResponse = await fetch(backendUrl, {
      method: 'POST',
      headers: forwardHeaders,
      body: body,
    });

    console.log('📊 백엔드 응답 상태:', backendResponse.status);

    const data = await backendResponse.text();
    
    // 500 에러인 경우 상세한 에러 정보 로깅
    if (backendResponse.status >= 400) {
      console.error('❌ 백엔드 에러 응답:');
      console.error('❌ 상태:', backendResponse.status);
      console.error('❌ 응답 본문:', data);
      console.error('❌ 응답 헤더:', Object.fromEntries(backendResponse.headers.entries()));
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
        console.log('✅ 포스트 생성 성공:', jsonData);
        return res.json(jsonData);
      } catch (parseError) {
        console.error('❌ JSON 파싱 실패:', parseError);
        console.error('❌ 응답 전체:', data);
        return res.status(500).json({ message: 'Invalid JSON response from backend' });
      }
    } else {
      console.log('📄 비JSON 응답:', data.substring(0, 200));
      return res.send(data);
    }
  } catch (error) {
    console.error('❌ 포스트 생성 API 프록시 에러:', error);
    return res.status(500).json({ 
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 