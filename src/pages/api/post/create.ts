// src/pages/api/post/create.ts
import { NextApiRequest, NextApiResponse } from 'next';

// Next.js의 기본 body parser 비활성화 (raw body 처리를 위해)
export const config = {
  api: {
    bodyParser: false,
    responseLimit: false,
    externalResolver: true,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // raw body 읽기 with size limit check
    const chunks: Buffer[] = [];
    let totalSize = 0;
    const maxSize = 50 * 1024 * 1024; // 50MB

    req.on('data', (chunk: Buffer) => {
      totalSize += chunk.length;
      if (totalSize > maxSize) {
        res.status(413).json({ 
          message: 'Request too large', 
          error: 'PAYLOAD_TOO_LARGE',
          maxSize: '50MB'
        });
        return;
      }
      chunks.push(chunk);
    });
    await new Promise<void>(resolve => req.on('end', resolve));

    const body = Buffer.concat(chunks);

    // 헤더 설정
    const forwardHeaders: Record<string, string> = {};
    if (req.headers['content-type']) {
      forwardHeaders['Content-Type'] = req.headers['content-type'];
    }
    if (req.headers.cookie) {
      forwardHeaders['Cookie'] = req.headers.cookie;
    }
    if (req.headers.authorization) {
      forwardHeaders['Authorization'] = req.headers.authorization;
    }

    // Query parameter 포함 URL 구성
    const queryString = req.url?.includes('?') ? req.url.split('?')[1] : '';
    const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/post/create${queryString ? `?${queryString}` : ''}`;

    // 백엔드 API 호출 with extended timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60초 timeout

    const backendResponse = await fetch(backendUrl, {
      method: 'POST',
      headers: forwardHeaders,
      body,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const data = await backendResponse.text();

    // Set-Cookie 헤더 전달
    const setCookieHeader = backendResponse.headers.get('set-cookie');
    if (setCookieHeader) {
      res.setHeader('Set-Cookie', setCookieHeader);
    }

    res.status(backendResponse.status);

    const contentType = backendResponse.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      res.setHeader('Content-Type', 'application/json');
      try {
        return res.json(JSON.parse(data));
      } catch {
        return res.status(500).json({ message: 'Invalid JSON response from backend' });
      }
    } else {
      return res.send(data);
    }
  } catch (err: unknown) {
    const error = err as Error;
    return res.status(500).json({
      message: 'Internal server error',
      error: error.message ?? 'Unknown error',
    });
  }
}
