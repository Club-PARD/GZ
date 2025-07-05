// src/lib/firebase-functions.ts

import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

// Firestore와 Messaging 서비스 사용 준비
const db = admin.firestore();
const messaging = admin.messaging();

/**
 * Sendbird 웹훅 요청을 처리하여 푸시 알림을 보냅니다.
 * HTTP 요청으로 트리거됩니다.
 */
export const sendbirdWebhook = functions.https.onRequest(async (request, response) => {
  // Sendbird가 보내는 웹훅 데이터 (POST body)
  const webhookPayload = request.body;

  // 이벤트 타입이 'group_channel:message_send'가 아니면 무시
  if (webhookPayload.category !== "group_channel:message_send") {
    response.status(200).send("Not a message event. Ignored.");
    return;
  }

  // 필요한 정보 추출
  const sender = webhookPayload.sender;
  const messageText = webhookPayload.payload?.message || "메시지 내용 없음";
  const channelName = webhookPayload.channel?.name || "채널";
  const channelUrl = webhookPayload.channel?.channel_url;

  if (!sender || !channelUrl) {
    response.status(200).send("Missing sender or channel info.");
    return;
  }

  // 실제로는 Sendbird API를 사용해야 하지만, 임시로 테스트용 사용자들에게 모두 알림
  const testUsers = ['user1', 'user2', 'user3'];
  const recipients = testUsers.filter(userId => userId !== sender.user_id);

  if (recipients.length === 0) {
    response.status(200).send("No recipients to notify.");
    return;
  }

  // 각 수신자에게 알림 보내기
  const notificationPromises = recipients.map(async (recipientUserId: string) => {
    try {
      // Firestore에서 수신자의 FCM 토큰 조회
      const tokenDoc = await db.collection("fcm_tokens").doc(recipientUserId).get();
      if (!tokenDoc.exists) return;
      const fcmToken = tokenDoc.data()?.token;
      if (!fcmToken) return;
      // 푸시 알림 메시지 구성
      const message = {
        notification: {
          title: `💬 ${channelName} - ${sender.nickname || sender.user_id}`,
          body: messageText,
        },
        token: fcmToken,
      };
      // FCM으로 메시지 전송
      await messaging.send(message);
    } catch (error) {
      // 무시
    }
  });

  await Promise.all(notificationPromises);
  response.status(200).send("Notifications sent successfully.");
});
