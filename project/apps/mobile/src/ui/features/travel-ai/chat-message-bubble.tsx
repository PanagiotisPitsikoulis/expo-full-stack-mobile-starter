import { View } from "react-native";
import type { AiAssistantPayload, Home, StaticImage } from "../../../lib/api/travel";
import { ChatBubble } from "../../components/chat-bubble";
import { AssistantPayloadView, isFullBleedPayload } from "./assistant-payload-view";

export type SmartChatMessage = {
  id: string;
  payload?: AiAssistantPayload;
  role: "ai" | "user";
  text: string;
};

export function ChatMessageBubble({
  imageSrc,
  isSaved,
  message,
  onChipPress,
  onExpandHomes,
  onOpenDetail,
  onSeeActivities,
  onToggleSave,
}: {
  imageSrc: (image: StaticImage) => string;
  isSaved?: (homeId: string) => boolean;
  message: SmartChatMessage;
  onChipPress: (prompt: string) => void;
  onExpandHomes: (homes: Home[]) => void;
  onOpenDetail?: (homeId: string) => void;
  onSeeActivities: () => void;
  onToggleSave?: (homeId: string) => void;
}) {
  const isUser = message.role === "user";
  const fullBleed = message.payload ? isFullBleedPayload(message.payload.kind) : false;
  const inBubblePayload = message.payload && !fullBleed;
  const inlinePayload = inBubblePayload && message.payload?.kind === "clarify";

  return (
    <View
      style={{
        alignItems: isUser ? "flex-end" : "stretch",
        gap: 12,
        width: "100%",
      }}
    >
      <ChatBubble role={message.role} text={inlinePayload ? undefined : message.text}>
        {inBubblePayload && message.payload ? (
          <AssistantPayloadView
            imageSrc={imageSrc}
            isSaved={isSaved}
            onChipPress={onChipPress}
            onExpandHomes={onExpandHomes}
            onOpenDetail={onOpenDetail}
            onSeeActivities={onSeeActivities}
            onToggleSave={onToggleSave}
            payload={message.payload}
            text={inlinePayload ? message.text : undefined}
          />
        ) : null}
      </ChatBubble>

      {fullBleed && message.payload ? (
        <View style={{ marginHorizontal: -16 }}>
          <AssistantPayloadView
            imageSrc={imageSrc}
            isSaved={isSaved}
            onChipPress={onChipPress}
            onExpandHomes={onExpandHomes}
            onOpenDetail={onOpenDetail}
            onSeeActivities={onSeeActivities}
            onToggleSave={onToggleSave}
            payload={message.payload}
          />
        </View>
      ) : null}
    </View>
  );
}
