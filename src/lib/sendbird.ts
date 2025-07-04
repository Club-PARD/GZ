// src/lib/sendbird.ts
import SendbirdChat, { SendbirdChatWith } from "@sendbird/chat";
import { GroupChannelModule } from "@sendbird/chat/groupChannel";
import { OpenChannelModule } from "@sendbird/chat/openChannel";

type SendbirdInstance = SendbirdChatWith<[GroupChannelModule, OpenChannelModule]>;

let sb: SendbirdInstance | null = null;

export function initSendbird(appId: string): SendbirdInstance {
  if (!sb) {
    sb = SendbirdChat.init({
      appId,
      modules: [new GroupChannelModule(), new OpenChannelModule()],
    });
  }
  return sb;
}

/**
 * 초기화된 Sendbird 인스턴스를 반환합니다.
 * @returns {SendbirdInstance | null}
 */
export function getSendbird(): SendbirdInstance | null {
  return sb;
}
