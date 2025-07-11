// src/pages/api/apply/myApplies.ts
import { NextApiRequest, NextApiResponse } from 'next';

export const config = {
  api: {
    bodyParser: false,
    responseLimit: false,
    externalResolver: true,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('▶️ [myApplies] incoming request');
  console.log('  • method:', req.method);
  console.log('  • url:', req.url);
  console.log('  • headers:', JSON.stringify(req.headers, null, 2));

  if (req.method !== 'GET') {
    console.log('❌ [myApplies] method not allowed');
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // 쿼리스트링 분리
    const queryString = req.url?.includes('?') ? req.url.split('?')[1] : '';
    const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/apply/myApplies${queryString ? `?${queryString}` : ''}`;
    console.log('🔗 [myApplies] proxying to:', backendUrl);

    // 포워딩할 헤더 구성
    const forwardHeaders: Record<string, string> = {};
    if (req.headers.cookie) {
      forwardHeaders['Cookie'] = req.headers.cookie;
    }
    if (req.headers.authorization) {
      forwardHeaders['Authorization'] = req.headers.authorization;
    }
    if (req.headers.accept) {
      forwardHeaders['Accept'] = req.headers.accept as string;
    }
    console.log('📤 [myApplies] forwarding headers:', JSON.stringify(forwardHeaders, null, 2));

    // 60초 타임아웃
    const controller = new AbortController();
    const timeout = setTimeout(() => {
      console.log('⏰ [myApplies] request timed out after 60s, aborting');
      controller.abort();
    }, 60000);

    const backendResponse = await fetch(backendUrl, {
      method: 'GET',
      headers: forwardHeaders,
      signal: controller.signal,
    });
    clearTimeout(timeout);

    console.log('⬅️ [myApplies] backend responded status:', backendResponse.status);
    console.log('⬅️ [myApplies] backend response headers:', JSON.stringify(Object.fromEntries(backendResponse.headers.entries()), null, 2));

    // Set-Cookie 전달
    const setCookie = backendResponse.headers.get('set-cookie');
    if (setCookie) {
      console.log('🍪 [myApplies] setting cookie header to client:', setCookie);
      res.setHeader('Set-Cookie', setCookie);
    }

    const bodyText = await backendResponse.text();
    console.log('📦 [myApplies] response body text:', bodyText);

    res.status(backendResponse.status);
    const contentType = backendResponse.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      res.setHeader('Content-Type', 'application/json');
      try {
        const json = JSON.parse(bodyText);
        console.log('✅ [myApplies] sending JSON to client');
        return res.json(json);
      } catch (parseErr) {
        console.error('❌ [myApplies] JSON parse error:', parseErr);
        return res.status(502).json({ message: 'Invalid JSON from backend' });
      }
    } else {
      console.log('✅ [myApplies] sending text to client');
      return res.send(bodyText);
    }
  } catch (err: any) {
    if (err.name === 'AbortError') {
      console.error('❌ [myApplies] fetch aborted:', err);
      return res.status(504).json({ message: 'Backend request timed out' });
    }
    console.error('❌ [myApplies] internal error:', err);
    return res.status(500).json({
      message: 'Internal server error',
      error: err.message || 'Unknown error',
    });
  }
}
