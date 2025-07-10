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
  console.log("🚀 센드버드 웹훅 호출됨");
  console.log("📦 전체 요청 데이터:", JSON.stringify(request.body, null, 2));
  
  const webhookPayload: WebhookPayload = request.body;

  if (webhookPayload.category !== "group_channel:message_send") {
    console.log(`❌ 메시지 이벤트가 아님: ${webhookPayload.category}`);
    response.status(200).send("Not a message event. Ignored.");
    return;
  }

  const sender = webhookPayload.sender;
  const messageText = webhookPayload.payload?.message || "메시지 내용 없음";
  const channelUrl = webhookPayload.channel?.channel_url;

  console.log(`👤 발신자: ${sender?.user_id} (${sender?.nickname})`);
  console.log(`💬 메시지: ${messageText}`);
  console.log(`📱 채널 URL: ${channelUrl}`);

  if (!sender || !channelUrl) {
    console.log("❌ 발신자 또는 채널 정보 누락");
    response.status(200).send("Missing sender or channel info.");
    return;
  }

  // 채널 참여자 정보 추출
  let recipients: string[] = [];
  
  // 1순위: 웹훅에서 직접 제공되는 멤버 정보
  if (webhookPayload.members && webhookPayload.members.length > 0) {
    recipients = webhookPayload.members
      .map(member => member.user_id)
      .filter(userId => userId !== sender.user_id);
    console.log(`✅ 웹훅 멤버 정보에서 추출: ${recipients.join(', ')}`);
  } 
  // 2순위: 채널 객체의 멤버 정보
  else if (webhookPayload.channel.members && webhookPayload.channel.members.length > 0) {
    recipients = webhookPayload.channel.members
      .map(member => member.user_id)
      .filter(userId => userId !== sender.user_id);
    console.log(`✅ 채널 멤버 정보에서 추출: ${recipients.join(', ')}`);
  } 
  // 3순위: 1:1 채팅 추출 (API 호출 대신 바로 시도)
  else {
    console.log("🔍 1:1 채팅 채널에서 사용자 추출 중...");
    console.log(`📝 채널 URL 분석: ${channelUrl}`);
    
    // 1:1 채팅의 경우 채널 URL에서 간단히 추출 가능
    const userIdPattern = /(\d{6,})/g;
    const foundIds = channelUrl.match(userIdPattern) || [];
    
    recipients = foundIds.filter(id => id !== sender.user_id);
    
    if (recipients.length > 0) {
      console.log(`✅ 1:1 채팅에서 추출한 사용자: ${recipients.join(', ')}`);
    } else {
      console.log("❌ 채널 멤버를 찾을 수 없어서 알림을 보내지 않습니다.");
      console.log("💡 웹훅에서 멤버 정보를 제공하지 않는 경우입니다.");
      response.status(200).send("No channel members found.");
      return;
    }
  }

  console.log(`📋 총 ${recipients.length}명에게 알림 전송 예정: ${recipients.join(', ')}`);

  // 각 수신자에게 알림 보내기
  let successCount = 0;
  let failCount = 0;
  
  const notificationPromises = recipients.map(async (recipientUserId: string) => {
    try {
      console.log(`🔍 ${recipientUserId} 사용자의 FCM 토큰 조회 중...`);
      
      const tokenDoc = await db.collection("fcm_tokens").doc(recipientUserId).get();
      if (!tokenDoc.exists) {
        console.log(`❌ ${recipientUserId}: FCM 토큰 문서가 존재하지 않습니다.`);
        failCount++;
        return;
      }
      
      const fcmToken = tokenDoc.data()?.token;
      if (!fcmToken) {
        console.log(`❌ ${recipientUserId}: FCM 토큰이 비어있습니다.`);
        failCount++;
        return;
      }
      
      console.log(`✅ ${recipientUserId}: FCM 토큰 확인됨 (${fcmToken.substring(0, 20)}...)`);
      
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
      
      console.log(`📱 ${recipientUserId}에게 알림 전송 시도 중...`);
      await messaging.send(message);
      console.log(`✅ 알림 전송 성공: ${recipientUserId}`);
      successCount++;
      
    } catch (error) {
      console.error(`❌ 알림 전송 실패 (${recipientUserId}):`, error);
      failCount++;
    }
  });

  await Promise.all(notificationPromises);
  
  console.log(`📊 알림 전송 결과: 성공 ${successCount}건, 실패 ${failCount}건`);
  response.status(200).send(`Notifications sent successfully. Success: ${successCount}, Failed: ${failCount}`);
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


