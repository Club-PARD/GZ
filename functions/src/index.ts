// src/lib/firebase-functions.ts

import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { Request, Response } from "express";

admin.initializeApp();

// Firestore와 Messaging 서비스 사용 준비
const db = admin.firestore();
const messaging = admin.messaging();

// Sendbird API 설정
const SENDBIRD_APP_ID = "07CA004F-C047-45F1-ACF2-11B70C188311"; // 로그에서 확인된 앱 ID
const SENDBIRD_API_TOKEN = functions.config().sendbird?.api_token || process.env.SENDBIRD_API_TOKEN;

// 타입 정의
interface WebhookSender {
  user_id: string;
  nickname: string;
  profile_url: string;
  metadata: Record<string, unknown>;
}

interface WebhookChannel {
  channel_url: string;
  name: string;
  members?: Array<{ user_id: string }>;
}

interface WebhookPayload {
  app_id: string;
  category: string;
  channel: WebhookChannel;
  sender: WebhookSender;
  payload: {
    message: string;
    message_id: number;
    created_at: number;
  };
  members?: Array<{ user_id: string }>;
}

interface SendbirdChannelMember {
  user_id: string;
  nickname: string;
  profile_url: string;
}

interface SendbirdChannelResponse {
  channel_url: string;
  name: string;
  members: SendbirdChannelMember[];
}


/**
 * Sendbird 웹훅 요청을 처리하여 푸시 알림을 보냅니다.
 * 실제 채널 멤버들에게만 알림을 전송합니다.
 */
export const sendbirdWebhook = functions.https.onRequest(async (request: Request, response: Response) => {
  const webhookPayload: WebhookPayload = request.body;

  if (webhookPayload.category !== "group_channel:message_send") {
    response.status(200).send("Not a message event. Ignored.");
    return;
  }

  const sender = webhookPayload.sender;
  const messageText = webhookPayload.payload?.message || "메시지 내용 없음";
  const channelUrl = webhookPayload.channel?.channel_url;

  if (!sender || !channelUrl) {
    response.status(200).send("Missing sender or channel info.");
    return;
  }

  // 채널 참여자 정보 추출
  let recipients: string[] = [];
  
  if (webhookPayload.members) {
    recipients = webhookPayload.members
      .map(member => member.user_id)
      .filter(userId => userId !== sender.user_id);
  } else if (webhookPayload.channel.members) {
    recipients = webhookPayload.channel.members
      .map(member => member.user_id)
      .filter(userId => userId !== sender.user_id);
  } else {
    // Sendbird API로 실제 채널 멤버 가져오기
    try {
      if (SENDBIRD_API_TOKEN) {
        console.log("Sendbird API로 채널 멤버 조회 중...");
        
        const response = await fetch(
          `https://api-${SENDBIRD_APP_ID}.sendbird.com/v3/group_channels/${channelUrl}`,
          {
            headers: {
              'Api-Token': SENDBIRD_API_TOKEN,
              'Content-Type': 'application/json'
            }
          }
        );
        
        if (response.ok) {
          const channelData: SendbirdChannelResponse = await response.json();
          if (channelData.members) {
            recipients = channelData.members
              .map(member => member.user_id)
              .filter(userId => userId !== sender.user_id);
            console.log(`API에서 가져온 채널 멤버들: ${recipients.join(', ')}`);
          }
        } else {
          console.error("Sendbird API 호출 실패:", response.status);
        }
      }
      
      // API 실패 시 폴백: 채널 URL에서 사용자 ID 추출 시도
      if (recipients.length === 0) {
        console.log("채널 URL에서 사용자 ID 추출 시도");
        
        // 채널 URL 패턴: sendbird_group_channel_[userId1]_[userId2]_...
        // 또는 distinct 채널의 경우 사용자 ID들이 포함될 수 있음
        const urlParts = channelUrl.split('_');
        const possibleUserIds = urlParts.filter(part => 
          /^\d+$/.test(part) && part !== SENDBIRD_APP_ID.replace(/-/g, '')
        );
        
        if (possibleUserIds.length > 0) {
          recipients = possibleUserIds.filter(userId => userId !== sender.user_id);
          console.log(`URL에서 추출한 사용자들: ${recipients.join(', ')}`);
        }
      }
      
    } catch (error) {
      console.error("채널 멤버 조회 실패:", error);
    }
    
    // 최종 폴백: 알림 없음
    if (recipients.length === 0) {
      console.log("채널 멤버를 찾을 수 없어서 알림을 보내지 않습니다.");
      response.status(200).send("No channel members found.");
      return;
    }
  }

  if (recipients.length === 0) {
    response.status(200).send("No recipients to notify.");
    return;
  }

  // 각 수신자에게 알림 보내기
  const notificationPromises = recipients.map(async (recipientUserId: string) => {
    try {
      const tokenDoc = await db.collection("fcm_tokens").doc(recipientUserId).get();
      if (!tokenDoc.exists) return;
      
      const fcmToken = tokenDoc.data()?.token;
      if (!fcmToken) return;
      
      const message = {
        notification: {
          title: `💬 ${sender.nickname || sender.user_id}`,
          body: messageText,
        },
        data: {
          channelUrl: channelUrl,
          senderId: sender.user_id,
          messageType: 'chat'
        },
        token: fcmToken,
      };
      
      await messaging.send(message);
      console.log(`알림 전송 성공: ${recipientUserId}`);
      
    } catch (error) {
      console.error(`알림 전송 실패 (${recipientUserId}):`, error);
    }
  });

  await Promise.all(notificationPromises);
  response.status(200).send("Notifications sent successfully.");
});

/**
 * FCM 토큰을 저장하는 함수
 */
export const saveFcmToken = functions.https.onRequest(async (request: Request, response: Response) => {
  response.set('Access-Control-Allow-Origin', '*');
  response.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.set('Access-Control-Allow-Headers', 'Content-Type');

  if (request.method === 'OPTIONS') {
    response.status(204).send('');
    return;
  }

  if (request.method !== 'POST') {
    response.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { userId, fcmToken }: { userId: string; fcmToken: string } = request.body;

    if (!userId || !fcmToken) {
      response.status(400).json({ error: 'userId와 fcmToken이 필요합니다.' });
      return;
    }

    await db.collection("fcm_tokens").doc(userId).set({
      token: fcmToken,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    response.status(200).json({ 
      success: true, 
      message: 'FCM 토큰이 저장되었습니다.' 
    });

  } catch (error) {
    console.error('FCM 토큰 저장 오류:', error);
    response.status(500).json({ error: 'FCM 토큰 저장에 실패했습니다.' });
  }
});

/**
 * FCM 토큰을 조회하는 함수
 */
export const getFcmToken = functions.https.onRequest(async (request: Request, response: Response) => {
  response.set('Access-Control-Allow-Origin', '*');
  response.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.set('Access-Control-Allow-Headers', 'Content-Type');

  if (request.method === 'OPTIONS') {
    response.status(204).send('');
    return;
  }

  if (request.method !== 'GET') {
    response.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const userId = request.query.userId as string;

    if (!userId) {
      response.status(400).json({ error: 'userId가 필요합니다.' });
      return;
    }

    const tokenDoc = await db.collection("fcm_tokens").doc(userId).get();

    if (!tokenDoc.exists) {
      response.status(404).json({ error: 'FCM 토큰을 찾을 수 없습니다.' });
      return;
    }

    const tokenData = tokenDoc.data();
    response.status(200).json({ 
      success: true, 
      fcmToken: tokenData?.token,
      updatedAt: tokenData?.updatedAt 
    });

  } catch (error) {
    console.error('FCM 토큰 조회 오류:', error);
    response.status(500).json({ error: 'FCM 토큰 조회에 실패했습니다.' });
  }
});

/**
 * FCM 토큰을 삭제하는 함수
 */
export const deleteFcmToken = functions.https.onRequest(async (request: Request, response: Response) => {
  response.set('Access-Control-Allow-Origin', '*');
  response.set('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  response.set('Access-Control-Allow-Headers', 'Content-Type');

  if (request.method === 'OPTIONS') {
    response.status(204).send('');
    return;
  }

  if (request.method !== 'DELETE') {
    response.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { userId }: { userId: string } = request.body;

    if (!userId) {
      response.status(400).json({ error: 'userId가 필요합니다.' });
      return;
    }

    await db.collection("fcm_tokens").doc(userId).delete();

    response.status(200).json({ 
      success: true, 
      message: 'FCM 토큰이 삭제되었습니다.' 
    });

  } catch (error) {
    console.error('FCM 토큰 삭제 오류:', error);
    response.status(500).json({ error: 'FCM 토큰 삭제에 실패했습니다.' });
  }
});


