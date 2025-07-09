// src/pages/api/post/detail.ts
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { postId, userId } = req.query;
    if (!postId) {
      return res.status(400).json({ message: 'postId is required' });
    }

    const forwardHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (req.headers.cookie) {
      forwardHeaders['Cookie'] = req.headers.cookie;
    }
    if (req.headers.authorization) {
      forwardHeaders['Authorization'] = req.headers.authorization;
    }

    const params = new URLSearchParams();
    params.append('postId', String(postId));
    if (userId) {
      params.append('userId', String(userId));
    }
    const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/post/detail?${params.toString()}`;

    const backendResponse = await fetch(backendUrl, {
      method: 'GET',
      headers: forwardHeaders,
    });

    const data = await backendResponse.text();

    const setCookieHeader = backendResponse.headers.get('set-cookie');
    if (setCookieHeader) {
      res.setHeader('Set-Cookie', setCookieHeader);
    }

    res.status(backendResponse.status);

    const contentType = backendResponse.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      res.setHeader('Content-Type', 'application/json');
      try {
        // 응답 크기 제한 체크
        const maxSize = 10 * 1024 * 1024;
        if (data.length > maxSize) {
          return res.status(413).json({
            success: false,
            message: 'Response too large - use localStorage fallback',
            error: 'SIZE_ERROR',
          });
        }
        const jsonData = JSON.parse(data);
        // 순환 참조 안전 처리
        const seen = new WeakSet();
        const safeData = JSON.parse(
          JSON.stringify(jsonData, (_key, val) => {
            if (val && typeof val === 'object') {
              if (seen.has(val)) {
                return '[Circular]';
              }
              seen.add(val);
            }
            return val;
          })
        );
        return res.json(safeData);
      } catch {
        return res.status(422).json({
          success: false,
          message: 'Data contains circular references or invalid JSON',
          error: 'PARSE_ERROR',
        });
      }
    } else {
      return res.send(data);
    }
  } catch (err: any) {
    return res.status(500).json({
      message: 'Internal server error',
      error: err.message ?? 'Unknown error',
    });
  }
}
