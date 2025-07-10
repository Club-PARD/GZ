import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // 헤더 설정 (Cookie, Authorization 등)
    const forwardHeaders: Record<string, string> = {};
    if (req.headers.cookie) {
      forwardHeaders['Cookie'] = req.headers.cookie;
    }
    if (req.headers.authorization) {
      forwardHeaders['Authorization'] = req.headers.authorization;
    }

    // 쿼리스트링 유지
    const queryString = req.url?.includes('?') ? req.url.split('?')[1] : '';
    const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/apply/all${queryString ? `?${queryString}` : ''}`;

    // 백엔드 API 호출
    const backendResponse = await axios.get(backendUrl, {
      headers: forwardHeaders,
      validateStatus: () => true,
    });

    // Set-Cookie 헤더 전달
    const setCookieHeader = backendResponse.headers['set-cookie'];
    if (setCookieHeader) {
      res.setHeader('Set-Cookie', setCookieHeader);
    }

    // 상태 코드 및 응답 전달
    res.status(backendResponse.status);
    return res.json(backendResponse.data);
    
  } catch (error) {
    console.error('Error fetching apply history from backend:', error);
    
    // 백엔드 연결 실패 시 빈 데이터 반환
    res.status(200).json({
      status: 0,
      success: true,
      message: "신청 내역이 없습니다.",
      data: []
    });
  }
} 