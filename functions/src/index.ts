/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

// Firebase Admin SDK 초기화
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

  // 웹훅 데이터 구조 로깅
  functions.logger.info("받은 웹훅 데이터:", JSON.stringify(webhookPayload, null, 2));

  // 이벤트 타입이 'group_channel:message_send'가 아니면 무시
  if (webhookPayload.category !== "group_channel:message_send") {
    functions.logger.info("메시지 전송 이벤트가 아니므로 무시합니다.", webhookPayload.category);
    response.status(200).send("Not a message event. Ignored.");
    return;
  }

  // 필요한 정보 추출
  const sender = webhookPayload.sender;
  const messageText = webhookPayload.payload?.message || "메시지 내용 없음";
  const channelName = webhookPayload.channel?.name || "채널";
  const channelUrl = webhookPayload.channel?.channel_url;

  if (!sender || !channelUrl) {
    functions.logger.warn("발신자 또는 채널 정보가 없습니다.");
    response.status(200).send("Missing sender or channel info.");
    return;
  }

  // 채널 정보로부터 수신자 찾기 (채널 URL에서 추출)
  // sendbird_group_channel_269994103_e93d044c4c3ad2fd595e16dbb545faee07bc7334
  // 실제로는 Sendbird API를 사용해야 하지만, 임시로 테스트용 사용자들에게 모두 알림
  const testUsers = ['user1', 'user2', 'user3'];
  const recipients = testUsers.filter(userId => userId !== sender.user_id);

  if (recipients.length === 0) {
    functions.logger.info("수신자가 없거나 발신자와 동일합니다.");
    response.status(200).send("No recipients to notify.");
    return;
  }

  functions.logger.info(`${recipients.length}명의 수신자에게 알림을 보냅니다: ${recipients.join(', ')}`);

  // 각 수신자에게 알림 보내기
  const notificationPromises = recipients.map(async (recipientUserId: string) => {
    try {
      // Firestore에서 수신자의 FCM 토큰 조회
      const tokenDoc = await db.collection("fcm_tokens").doc(recipientUserId).get();
      if (!tokenDoc.exists) {
        functions.logger.warn(`${recipientUserId}의 FCM 토큰을 찾을 수 없습니다.`);
        return;
      }

      const fcmToken = tokenDoc.data()?.token;
      if (!fcmToken) {
        functions.logger.warn(`${recipientUserId}의 토큰 데이터가 비어있습니다.`);
        return;
      }

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
      functions.logger.info(`${recipientUserId}에게 성공적으로 알림을 보냈습니다.`);
    } catch (error) {
      functions.logger.error(`${recipientUserId}에게 알림을 보내는 중 오류 발생:`, error);
    }
  });

  // 모든 알림 작업이 끝날 때까지 기다림
  await Promise.all(notificationPromises);

  // Sendbird에게 성공적으로 처리했다고 응답
  response.status(200).send("Notifications sent successfully.");
});
