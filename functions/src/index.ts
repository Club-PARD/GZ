// src/lib/firebase-functions.ts

import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { Request, Response } from "express";
import * as nodemailer from "nodemailer";

admin.initializeApp();

// Firestore와 Messaging 서비스 사용 준비
const db = admin.firestore();
const messaging = admin.messaging();

// Sendbird API 설정
const SENDBIRD_APP_ID = "07CA004F-C047-45F1-ACF2-11B70C188311"; // 로그에서 확인된 앱 ID
const SENDBIRD_API_TOKEN =
  functions.config().sendbird?.api_token || process.env.SENDBIRD_API_TOKEN;

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
export const sendbirdWebhook = functions.https.onRequest(
  async (request: Request, response: Response) => {
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
        .map((member) => member.user_id)
        .filter((userId) => userId !== sender.user_id);
      console.log(`✅ 웹훅 멤버 정보에서 추출: ${recipients.join(", ")}`);
    }
    // 2순위: 채널 객체의 멤버 정보
    else if (
      webhookPayload.channel.members &&
      webhookPayload.channel.members.length > 0
    ) {
      recipients = webhookPayload.channel.members
        .map((member) => member.user_id)
        .filter((userId) => userId !== sender.user_id);
      console.log(`✅ 채널 멤버 정보에서 추출: ${recipients.join(", ")}`);
    }
    // 3순위: 센드버드 API 호출 (실제 토큰 사용)
    else if (SENDBIRD_API_TOKEN) {
      try {
        console.log("🔍 센드버드 API로 채널 멤버 조회 중...");
        console.log(`🔑 API 토큰: ${SENDBIRD_API_TOKEN.substring(0, 10)}...`);

        const apiResponse = await fetch(
          `https://api-${SENDBIRD_APP_ID}.sendbird.com/v3/group_channels/${channelUrl}`,
          {
            headers: {
              "Api-Token": SENDBIRD_API_TOKEN,
              "Content-Type": "application/json",
            },
          }
        );

        console.log(`📡 API 응답 상태: ${apiResponse.status}`);

        if (apiResponse.ok) {
          const channelData: SendbirdChannelResponse = await apiResponse.json();
          console.log(`📋 채널 데이터:`, JSON.stringify(channelData, null, 2));

          if (channelData.members && channelData.members.length > 0) {
            recipients = channelData.members
              .map((member) => member.user_id)
              .filter((userId) => userId !== sender.user_id);
            console.log(
              `✅ API에서 가져온 채널 멤버들: ${recipients.join(", ")}`
            );
          } else {
            console.log("⚠️ API 응답에 멤버 정보가 없습니다.");
          }
        } else {
          const errorText = await apiResponse.text();
          console.error(
            "❌ 센드버드 API 호출 실패:",
            apiResponse.status,
            errorText
          );
        }
      } catch (error) {
        console.error("❌ 센드버드 API 호출 중 오류:", error);
      }
    }

    // 4순위: 1:1 채팅 추출 (최종 폴백)
    if (recipients.length === 0) {
      console.log("🔍 1:1 채팅 채널에서 사용자 추출 중...");
      console.log(`📝 채널 URL 분석: ${channelUrl}`);

      // 1:1 채팅의 경우 채널 URL에서 간단히 추출 가능
      const userIdPattern = /(\d{6,})/g;
      const foundIds = channelUrl.match(userIdPattern) || [];

      recipients = foundIds.filter((id) => id !== sender.user_id);

      if (recipients.length > 0) {
        console.log(`✅ 1:1 채팅에서 추출한 사용자: ${recipients.join(", ")}`);
      } else {
        console.log("❌ 채널 멤버를 찾을 수 없어서 알림을 보내지 않습니다.");
        console.log("💡 모든 방법으로 멤버를 찾을 수 없습니다.");
        response.status(200).send("No channel members found.");
        return;
      }
    }

    console.log(
      `📋 총 ${recipients.length}명에게 알림 전송 예정: ${recipients.join(
        ", "
      )}`
    );

    // 각 수신자에게 알림 보내기
    let successCount = 0;
    let failCount = 0;

    const notificationPromises = recipients.map(
      async (recipientUserId: string) => {
        try {
          console.log(`🔍 ${recipientUserId} 사용자의 FCM 토큰 조회 중...`);

          const tokenDoc = await db
            .collection("fcm_tokens")
            .doc(recipientUserId)
            .get();
          if (!tokenDoc.exists) {
            console.log(
              `❌ ${recipientUserId}: FCM 토큰 문서가 존재하지 않습니다.`
            );
            failCount++;
            return;
          }

          const fcmToken = tokenDoc.data()?.token;
          if (!fcmToken) {
            console.log(`❌ ${recipientUserId}: FCM 토큰이 비어있습니다.`);
            failCount++;
            return;
          }

          console.log(
            `✅ ${recipientUserId}: FCM 토큰 확인됨 (${fcmToken.substring(
              0,
              20
            )}...)`
          );

          const message = {
            notification: {
              title: `💬 ${sender.nickname || sender.user_id}`,
              body: messageText,
            },
            data: {
              channelUrl: channelUrl,
              senderId: sender.user_id,
              messageType: "chat",
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
      }
    );

    await Promise.all(notificationPromises);

    console.log(
      `📊 알림 전송 결과: 성공 ${successCount}건, 실패 ${failCount}건`
    );
    response
      .status(200)
      .send(
        `Notifications sent successfully. Success: ${successCount}, Failed: ${failCount}`
      );
  }
);

/**
 * FCM 토큰을 저장하는 함수
 */
export const saveFcmToken = functions.https.onRequest(
  async (request: Request, response: Response) => {
    response.set("Access-Control-Allow-Origin", "*");
    response.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    response.set("Access-Control-Allow-Headers", "Content-Type");

    if (request.method === "OPTIONS") {
      response.status(204).send("");
      return;
    }

    if (request.method !== "POST") {
      response.status(405).json({ error: "Method not allowed" });
      return;
    }

    try {
      const { userId, fcmToken }: { userId: string; fcmToken: string } =
        request.body;

      if (!userId || !fcmToken) {
        response.status(400).json({ error: "userId와 fcmToken이 필요합니다." });
        return;
      }

      await db.collection("fcm_tokens").doc(userId).set({
        token: fcmToken,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      response.status(200).json({
        success: true,
        message: "FCM 토큰이 저장되었습니다.",
      });
    } catch (error) {
      console.error("FCM 토큰 저장 오류:", error);
      response.status(500).json({ error: "FCM 토큰 저장에 실패했습니다." });
    }
  }
);

/**
 * FCM 토큰을 조회하는 함수
 */
export const getFcmToken = functions.https.onRequest(
  async (request: Request, response: Response) => {
    response.set("Access-Control-Allow-Origin", "*");
    response.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    response.set("Access-Control-Allow-Headers", "Content-Type");

    if (request.method === "OPTIONS") {
      response.status(204).send("");
      return;
    }

    if (request.method !== "GET") {
      response.status(405).json({ error: "Method not allowed" });
      return;
    }

    try {
      const userId = request.query.userId as string;

      if (!userId) {
        response.status(400).json({ error: "userId가 필요합니다." });
        return;
      }

      const tokenDoc = await db.collection("fcm_tokens").doc(userId).get();

      if (!tokenDoc.exists) {
        response.status(404).json({ error: "FCM 토큰을 찾을 수 없습니다." });
        return;
      }

      const tokenData = tokenDoc.data();
      response.status(200).json({
        success: true,
        fcmToken: tokenData?.token,
        updatedAt: tokenData?.updatedAt,
      });
    } catch (error) {
      console.error("FCM 토큰 조회 오류:", error);
      response.status(500).json({ error: "FCM 토큰 조회에 실패했습니다." });
    }
  }
);

/**
 * FCM 토큰을 삭제하는 함수
 */
export const deleteFcmToken = functions.https.onRequest(
  async (request: Request, response: Response) => {
    response.set("Access-Control-Allow-Origin", "*");
    response.set("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
    response.set("Access-Control-Allow-Headers", "Content-Type");

    if (request.method === "OPTIONS") {
      response.status(204).send("");
      return;
    }

    if (request.method !== "DELETE") {
      response.status(405).json({ error: "Method not allowed" });
      return;
    }

    try {
      const { userId }: { userId: string } = request.body;

      if (!userId) {
        response.status(400).json({ error: "userId가 필요합니다." });
        return;
      }

      await db.collection("fcm_tokens").doc(userId).delete();

      response.status(200).json({
        success: true,
        message: "FCM 토큰이 삭제되었습니다.",
      });
    } catch (error) {
      console.error("FCM 토큰 삭제 오류:", error);
      response.status(500).json({ error: "FCM 토큰 삭제에 실패했습니다." });
    }
  }
);

// 이메일 서비스 클래스
class EmailService {
  private transporter: nodemailer.Transporter;
  private gmailEmail: string;
  private gmailPassword: string;

  constructor() {
    this.gmailEmail = functions.config().gmail?.email || "test@example.com";
    this.gmailPassword = functions.config().gmail?.password || "test-password";

    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: this.gmailEmail,
        pass: this.gmailPassword,
      },
      debug: true,
      logger: true,
    });
  }

  async testConnection(): Promise<boolean> {
    try {
      console.log("🔌 Gmail SMTP 연결 테스트 시작...");
      await this.transporter.verify();
      console.log("✅ Gmail SMTP 연결 성공!");
      return true;
    } catch (error: any) {
      console.error("❌ Gmail SMTP 연결 실패:");
      console.error("에러 메시지:", error.message);
      return false;
    }
  }

  async sendRentalApprovalNotification(
    email: string,
    applicantNickname: string,
    itemTitle: string,
    lenderNickname: string
  ): Promise<void> {
    console.log(`📤 대여 승인 알림 이메일 발송 시작: ${email} (${applicantNickname})`);

    // 먼저 연결 테스트
    const isConnected = await this.testConnection();
    if (!isConnected) {
      throw new Error(
        "Gmail SMTP 연결에 실패했습니다. 앱 비밀번호를 확인해주세요."
      );
    }

    const mailOptions = {
      from: `"ZiGU 대여 알림" <${this.gmailEmail}>`,
      to: email,
      subject: `🎉 대여 요청이 승인되었습니다 - ${itemTitle}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>대여 요청 승인 알림</title>
        </head>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #f8f9fa; border-radius: 8px; padding: 30px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #7559FF; margin-bottom: 10px;">🎉 대여 승인 완료!</h1>
              <p style="color: #666; font-size: 18px; margin: 0;">안녕하세요, ${applicantNickname}님</p>
            </div>
            
            <div style="background-color: #ffffff; border-radius: 8px; padding: 25px; margin-bottom: 25px; border-left: 4px solid #7559FF;">
              <h2 style="color: #333; margin-top: 0; margin-bottom: 15px;">📦 승인된 대여 아이템</h2>
              <p style="color: #666; font-size: 16px; margin-bottom: 10px;">
                <strong style="color: #333;">아이템명:</strong> ${itemTitle}
              </p>
              <p style="color: #666; font-size: 16px; margin-bottom: 0;">
                <strong style="color: #333;">대여자:</strong> ${lenderNickname}님
              </p>
            </div>

            <div style="background-color: #e8f5e8; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
              <h3 style="color: #2d5016; margin-top: 0; margin-bottom: 15px;">✅ 다음 단계</h3>
              <ul style="color: #2d5016; margin: 0; padding-left: 20px;">
                <li style="margin-bottom: 8px;">ZiGU 앱에서 대여자와 채팅을 통해 수령 방법을 조율하세요</li>
                <li style="margin-bottom: 8px;">약속한 시간과 장소에서 아이템을 수령하세요</li>
                <li style="margin-bottom: 0;">사용 후 안전하게 반납해주세요</li>
              </ul>
            </div>

            <div style="text-align: center; margin-bottom: 25px;">
              <a href="#" style="background-color: #7559FF; color: white; text-decoration: none; 
                         padding: 15px 30px; border-radius: 8px; font-weight: bold; display: inline-block;">
                ZiGU 앱에서 확인하기
              </a>
            </div>

            <hr style="border: none; border-top: 1px solid #eee; margin: 25px 0;">
            
            <div style="text-align: center;">
              <p style="color: #999; font-size: 14px; margin-bottom: 5px;">
                안전한 대여 거래를 위해 항상 ZiGU 앱 내에서 소통해주세요.
              </p>
              <p style="color: #aaa; font-size: 12px; margin: 0;">
                ZiGU 대학생 중고 렌탈 플랫폼
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    try {
      const result = await this.transporter.sendMail(mailOptions);
      console.log("✅ 대여 승인 알림 이메일 발송 성공!");
      console.log("📬 Message ID:", result.messageId);
    } catch (error: any) {
      console.error("❌ 대여 승인 알림 이메일 발송 실패:");
      console.error("에러 메시지:", error.message);
      throw error;
    }
  }
}

/**
 * 대여 승인 시 이메일 알림을 보내는 함수
 */
export const sendRentalApprovalEmail = functions.https.onRequest(
  async (request: Request, response: Response) => {
    response.set("Access-Control-Allow-Origin", "*");
    response.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    response.set("Access-Control-Allow-Headers", "Content-Type");

    if (request.method === "OPTIONS") {
      response.status(204).send("");
      return;
    }

    if (request.method !== "POST") {
      response.status(405).json({ error: "Method not allowed" });
      return;
    }

    try {
      const {
        email,
        applicantNickname,
        itemTitle,
        lenderNickname,
      }: {
        email: string;
        applicantNickname: string;
        itemTitle: string;
        lenderNickname: string;
      } = request.body;

      if (!email || !applicantNickname || !itemTitle || !lenderNickname) {
        response.status(400).json({
          error: "email, applicantNickname, itemTitle, lenderNickname이 모두 필요합니다.",
        });
        return;
      }

      const emailService = new EmailService();
      await emailService.sendRentalApprovalNotification(
        email,
        applicantNickname,
        itemTitle,
        lenderNickname
      );

      response.status(200).json({
        success: true,
        message: "대여 승인 알림 이메일이 발송되었습니다.",
      });
    } catch (error: any) {
      console.error("대여 승인 이메일 발송 오류:", error);
      response.status(500).json({
        error: "이메일 발송에 실패했습니다.",
        details: error.message,
      });
    }
  }
);
