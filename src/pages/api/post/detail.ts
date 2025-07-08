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
        // 응답 크기 체크 (10MB 제한)
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (data.length > maxSize) {
          console.error('❌ 응답 크기가 너무 큼:', data.length, 'bytes');
          return res.status(413).json({ 
            success: false,
            message: 'Response too large - use localStorage fallback',
            error: 'SIZE_ERROR'
          });
        }

        // JSON 파싱 시도
        const jsonData = JSON.parse(data);
        
        // 순환 참조를 안전하게 처리하는 JSON 직렬화
        try {
          // 순환 참조를 감지하고 제거하는 함수
          const seen = new WeakSet();
          const safeJsonData = JSON.parse(JSON.stringify(jsonData, (key, val) => {
            if (val != null && typeof val === "object") {
              if (seen.has(val)) {
                return '[Circular Reference]';
              }
              seen.add(val);
            }
            return val;
          }));
          
          console.log('✅ 상세 정보 조회 성공 (순환 참조 처리됨)');
          return res.json(safeJsonData);
        } catch (circularError) {
          console.error('❌ 순환 참조 처리 실패:', circularError);
          
          // 마지막 수단: 기본 성공 응답과 localStorage 사용 권장
          return res.status(422).json({ 
            success: false,
            message: 'Data contains circular references - please use localStorage fallback',
            error: 'CIRCULAR_REFERENCE_PROCESSING_FAILED',
            originalDataSize: data.length
          });
        }
      } catch (parseError) {
        console.error('❌ JSON 파싱 실패:', parseError);
        console.error('❌ 응답 크기:', data.length, 'bytes');
        
        // 응답이 너무 크거나 형식이 잘못된 경우의 패턴 감지
        const hasRepeatingPattern = data.includes('}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]}}');
        if (hasRepeatingPattern) {
          console.error('❌ 순환 참조로 인한 무한 중첩 구조 감지');
        }
        
        // 응답 데이터의 일부만 로그 출력 (메모리 절약)
        if (data.length > 1000) {
          console.error('❌ 파싱 실패한 데이터 (처음 500자):', data.substring(0, 500));
          console.error('❌ 파싱 실패한 데이터 (마지막 500자):', data.substring(Math.max(0, data.length - 500)));
        } else {
          console.error('❌ 파싱 실패한 전체 데이터:', data);
        }
        
        // JSON 파싱 실패 시 프론트엔드에서 localStorage 사용하도록 특별한 에러 응답
        return res.status(404).json({ 
          success: false,
          message: 'Backend JSON parsing failed - use localStorage fallback',
          error: 'PARSE_ERROR',
          details: hasRepeatingPattern ? 'Circular reference detected' : 'Invalid JSON format'
        });
      }
    } else {
      console.log('📄 비JSON 응답 (처음 500자):', data.substring(0, 500));
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