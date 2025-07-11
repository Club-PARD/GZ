import { NextApiRequest, NextApiResponse } from 'next';
import axios, { AxiosError } from 'axios';

interface ApplyOkResponse {
  status: number;
  success: boolean;
  message: string;
  data: {
    applierId: number;
    studentMail: string;
    nickName: string;
    itemName: string;
  };
}

// 이메일 발송 함수
async function sendRentalApprovalEmail(responseData: ApplyOkResponse): Promise<void> {
  try {
    const functionsUrl = process.env.NEXT_PUBLIC_FIREBASE_FUNCTIONS_URL || 'https://us-central1-zigu-e4f0f.cloudfunctions.net';
    const emailEndpoint = `${functionsUrl}/sendRentalApprovalEmail`;

    const emailData = {
      email: responseData.data.studentMail,
      applicantNickname: responseData.data.nickName,
      itemTitle: responseData.data.itemName,
      lenderNickname: '대여자'
    };

    await axios.post(emailEndpoint, emailData, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error('이메일 발송 실패:', error.response?.status, error.response?.data);
    } else {
      console.error('이메일 발송 중 오류:', error);
    }
    throw error;
  }
}

export default async function handler(
  req: NextApiRequest, 
  res: NextApiResponse<ApplyOkResponse | { message: string; error: string }>
) {
  if (req.method !== 'DELETE') {
    res.setHeader('Allow', 'DELETE');
    return res.status(405).end('Method Not Allowed');
  }

  const { applyId, applierId } = req.body;
  if (!applyId) {
    return res.status(400).json({ 
      message: 'applyId가 필요합니다.',
      error: 'Missing applyId parameter'
    });
  }

  const forwardHeaders: Record<string, string> = { 'Content-Type': 'application/json' };
  if (req.headers.cookie) forwardHeaders['Cookie'] = req.headers.cookie;
  if (req.headers.authorization) forwardHeaders['Authorization'] = req.headers.authorization;

  const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/apply/ok`;
  
  const requestBody = {
    applyId: parseInt(applyId),
    applierId: parseInt(applierId) || 0
  };

  try {
    const backendResponse = await axios.delete<ApplyOkResponse>(backendUrl, {
      data: requestBody,
      headers: forwardHeaders,
      validateStatus: () => true,
      timeout: 30000,
    });
    
    // 성공적인 경우에만 이메일 발송 시도
    if (backendResponse.status === 200 && 
        backendResponse.data?.success && 
        backendResponse.data?.data?.studentMail && 
        backendResponse.data?.data?.nickName && 
        backendResponse.data?.data?.itemName) {
      
      // 이메일 발송을 별도 프로세스로 처리 (논블로킹)
      setImmediate(async () => {
        try {
          await sendRentalApprovalEmail(backendResponse.data);
        } catch {
          // 이메일 발송 실패는 전체 API 응답에 영향을 주지 않음
        }
      });
    }

    res.status(backendResponse.status);
    if (backendResponse.headers['content-type']?.includes('application/json')) {
      return res.json(backendResponse.data);
    }
    return res.send(backendResponse.data);
  } catch (error: unknown) {
    const err = error as Error;
    return res.status(500).json({
      message: 'Internal server error',
      error: err.message ?? 'Unknown error',
    });
  }
} 