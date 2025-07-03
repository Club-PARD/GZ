// src/lib/sendbird.ts
import SendbirdChat, { SendbirdChatWith } from "@sendbird/chat";
import { GroupChannelModule } from "@sendbird/chat/groupChannel";
import { OpenChannelModule } from "@sendbird/chat/openChannel";

let sb: SendbirdChatWith<[GroupChannelModule, OpenChannelModule]> | null = null;
export function initSendbird(appId: string) {
  if (!sb) {
    sb = SendbirdChat.init({
      appId,
      modules: [new GroupChannelModule(), new OpenChannelModule()],
    });
  }
  return sb;
}
