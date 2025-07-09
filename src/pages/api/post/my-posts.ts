// src/pages/api/post/my-posts.ts
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const forwardHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (req.headers.cookie) {
      forwardHeaders['Cookie'] = req.headers.cookie;
    }
    if (req.headers.authorization) {
      forwardHeaders['Authorization'] = req.headers.authorization;
    }

    console.log('백엔드 API URL:', `${process.env.NEXT_PUBLIC_API_URL}/post/my-posts`);
    console.log('전달되는 헤더:', forwardHeaders);

    const backendResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/post/my-posts`,
      {
        method: 'GET',
        headers: forwardHeaders,
      }
    );

    console.log('백엔드 응답 상태:', backendResponse.status);
    console.log('백엔드 응답 ok:', backendResponse.ok);

    const data = await backendResponse.text();
    console.log('백엔드 응답 데이터 길이:', data.length);

    const setCookieHeader = backendResponse.headers.get('set-cookie');
    if (setCookieHeader) {
      res.setHeader('Set-Cookie', setCookieHeader);
    }

    const contentType = backendResponse.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      res.setHeader('Content-Type', 'application/json');
      try {
        const jsonData = JSON.parse(data);
        
        // 백엔드에서 status: 0으로 오는 경우 HTTP 상태 코드로 변환
        if (jsonData.status === 0) {
          jsonData.status = backendResponse.status;
        }
        
        res.status(backendResponse.status);
        return res.json(jsonData);
      } catch {
        return res
          .status(500)
          .json({ message: 'Invalid JSON response from backend' });
      }
    } else {
      res.status(backendResponse.status);
      return res.send(data);
    }
  } catch (err: any) {
    console.error('내 물건 목록 요청 실패:', err);
    return res.status(500).json({
      message: 'Internal server error',
      error: err.message ?? 'Unknown error',
    });
  }
} 