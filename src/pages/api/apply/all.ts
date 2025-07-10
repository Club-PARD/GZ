import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // 실제 백엔드 API 호출
    const backendUrl = process.env.NEXT_PUBLIC_API_UR || 'http://localhost:8080';
    const response = await axios.get(`${backendUrl}/api/apply/all`, {
      headers: {
        'Content-Type': 'application/json',
        // 필요한 경우 인증 헤더 추가
        // 'Authorization': `Bearer ${token}`,
      },
      validateStatus: () => true,
    });

    res.status(200).json(response.data);
    
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