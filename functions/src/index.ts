// src/lib/firebase-functions.ts

import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

// Firestore와 Messaging 서비스 사용 준비
const db = admin.firestore();
const messaging = admin.messaging();

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



/**
 * Sendbird 웹훅 요청을 처리하여 푸시 알림을 보냅니다.
 * HTTP 요청으로 트리거됩니다.
 */
export const sendbirdWebhook = functions.https.onRequest(async (request, response) => {
  const webhookPayload: WebhookPayload = request.body;

  if (webhookPayload.category !== "group_channel:message_send") {
    response.status(200).send("Not a message event. Ignored.");
    return;
  }

  const sender = webhookPayload.sender;
  const messageText = webhookPayload.payload?.message || "메시지 내용 없음";
  const channelName = webhookPayload.channel?.name || "채널";
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
    // 폴백: 전체 FCM 토큰 등록된 사용자들에게 알림 (채널 정보가 없는 경우)
    console.log("채널 멤버 정보가 없어서 전체 알림을 보냅니다.");
    recipients = []; // 이 경우 아래에서 전체 사용자 조회
  }

  // 수신자가 없는 경우 전체 등록된 사용자들 조회
  if (recipients.length === 0) {
    try {
      const allTokens = await db.collection("fcm_tokens").get();
      recipients = allTokens.docs
        .map(doc => doc.id)
        .filter(userId => userId !== sender.user_id);
    } catch (error) {
      console.error("전체 사용자 조회 실패:", error);
      response.status(200).send("No recipients to notify.");
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
          title: `💬 ${channelName} - ${sender.nickname || sender.user_id}`,
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
export const saveFcmToken = functions.https.onRequest(async (request, response) => {
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
export const getFcmToken = functions.https.onRequest(async (request, response) => {
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
export const deleteFcmToken = functions.https.onRequest(async (request, response) => {
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


