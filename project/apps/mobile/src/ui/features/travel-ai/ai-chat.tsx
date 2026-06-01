import { Ionicons } from "@expo/vector-icons";
import { Spinner } from "@pitsi-ui/native/components/spinner";
import { FlashList } from "@shopify/flash-list";
import { Stack } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Keyboard,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useCSSVariable } from "uniwind";
import type { AiAssistantPayload, Home, StaticImage } from "../../../lib/api/travel";
import { ActionMenu, type ActionMenuAction } from "../../components/action-menu";
import { AdaptiveGlassView } from "../../components/adaptive-glass-view";
import { ChatMessageBubble, type SmartChatMessage } from "./chat-message-bubble";

const NEW_CHAT_ACTION_ID = "ai-new-chat";
const DELETE_ALL_ACTION_ID = "ai-delete-all";
const SESSION_ACTION_PREFIX = "ai-session:";
const DELETE_ACTION_PREFIX = "ai-delete:";
type AiChatMessage = SmartChatMessage & { payload?: AiAssistantPayload };
type AiChatSessionSummary = { id: string; title: string };

const PILL_HEIGHT = 72;

export function AiChat({
  activeSessionId,
  imageSrc,
  input,
  isSaved,
  messages,
  onChangeInput,
  onChipPress,
  onDeleteAllChats,
  onDeleteChat,
  onExpandHomes,
  onNewChat,
  onOpenDetail,
  onSeeActivities,
  onSelectChat,
  onSend,
  onToggleSave,
  sending,
  sessions,
}: {
  activeSessionId: string;
  chips: string[];
  imageSrc: (image: StaticImage) => string;
  input: string;
  isSaved?: (homeId: string) => boolean;
  messages: AiChatMessage[];
  onChangeInput: (value: string) => void;
  onChipPress: (chip: string) => void;
  onDeleteAllChats: () => void;
  onDeleteChat: (id: string) => void;
  onExpandHomes: (homes: Home[]) => void;
  onNewChat: () => void;
  onOpenDetail?: (homeId: string) => void;
  onSeeActivities: () => void;
  onSelectChat: (id: string) => void;
  onSend: () => void;
  onToggleSave?: (homeId: string) => void;
  sending: boolean;
  sessions: AiChatSessionSummary[];
}) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  // Match the iOS 26 floating tab bar inset so the composer aligns with the
  // tab pill + profile button beneath it.
  const pillWidth = width - 48;
  const isEmpty = messages.length === 0;
  const [primary, primaryForeground, surface, surfaceFg, mutedFg, focusColor] = useCSSVariable([
    "--primary",
    "--primary-foreground",
    "--surface",
    "--surface-foreground",
    "--muted-foreground",
    "--focus",
  ]) as [string, string, string, string, string, string];

  const [keyboardHeight, setKeyboardHeight] = useState(0);
  // Apple UIMenu pattern: per-session nested submenu lets the user choose
  // Open vs Delete on each row, then a global "Delete all chats" sits at the
  // bottom as a single destructive action.
  const chatActions: ActionMenuAction[] = [
    {
      id: NEW_CHAT_ACTION_ID,
      title: "New chat",
    },
    {
      id: "ai-recent-section",
      title: "Recent chats",
      displayInline: true,
      subactions: sessions.map((session) => ({
        id: `ai-session-menu:${session.id}`,
        title: session.title,
        state: session.id === activeSessionId ? "on" : "off",
        subactions: [
          {
            id: `${SESSION_ACTION_PREFIX}${session.id}`,
            title: "Open",
          },
          {
            id: `${DELETE_ACTION_PREFIX}${session.id}`,
            title: "Delete",
            destructive: true,
          },
        ],
      })),
    },
    {
      id: DELETE_ALL_ACTION_ID,
      title: "Delete all chats",
      destructive: true,
    },
  ];

  useEffect(() => {
    const showEvent = Platform.OS === "android" ? "keyboardDidShow" : "keyboardWillShow";
    const hideEvent = Platform.OS === "android" ? "keyboardDidHide" : "keyboardWillHide";
    const showSub = Keyboard.addListener(showEvent, (event) => {
      setKeyboardHeight(event.endCoordinates.height);
    });
    const hideSub = Keyboard.addListener(hideEvent, () => {
      setKeyboardHeight(0);
    });
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);
  const barBottom = keyboardHeight > 0 ? keyboardHeight + 8 : insets.bottom + 14;

  return (
    <View className="flex-1 bg-background">
      <Stack.Screen
        options={{
          headerTitleAlign: "center",
          headerLeft: () => (
            <ActionMenu
              actions={chatActions}
              onAction={(id) => {
                if (id === NEW_CHAT_ACTION_ID) {
                  onNewChat();
                  return;
                }
                if (id === DELETE_ALL_ACTION_ID) {
                  onDeleteAllChats();
                  return;
                }
                if (id.startsWith(DELETE_ACTION_PREFIX)) {
                  onDeleteChat(id.slice(DELETE_ACTION_PREFIX.length));
                  return;
                }
                if (id.startsWith(SESSION_ACTION_PREFIX)) {
                  onSelectChat(id.slice(SESSION_ACTION_PREFIX.length));
                }
              }}
              title="Chat history"
            >
              <Pressable accessibilityLabel="Chat history" accessibilityRole="button" hitSlop={8}>
                <Ionicons color={surfaceFg} name="menu" size={26} />
              </Pressable>
            </ActionMenu>
          ),
          headerRight: () => (
            <Pressable
              accessibilityLabel="New chat"
              accessibilityRole="button"
              hitSlop={8}
              onPress={onNewChat}
            >
              <Ionicons color={surfaceFg} name="create-outline" size={24} />
            </Pressable>
          ),
        }}
      />

      {isEmpty ? (
        <View className="flex-1" />
      ) : (
        <ChatMessageList
          imageSrc={imageSrc}
          isSaved={isSaved}
          messages={messages}
          onChipPress={onChipPress}
          onExpandHomes={onExpandHomes}
          onOpenDetail={onOpenDetail}
          onSeeActivities={onSeeActivities}
          onToggleSave={onToggleSave}
          sending={sending}
          surface={surface}
        />
      )}

      <View
        pointerEvents="box-none"
        style={{ bottom: barBottom, left: 0, position: "absolute", right: 0 }}
      >
        <View style={{ alignItems: "center" }}>
          <View
            style={{
              height: PILL_HEIGHT,
              width: pillWidth,
            }}
          >
            <AdaptiveGlassView
              glassEffectStyle="regular"
              isInteractive
              style={[
                StyleSheet.absoluteFill,
                {
                  alignItems: "center",
                  borderCurve: "continuous",
                  borderRadius: PILL_HEIGHT / 2,
                  flexDirection: "row",
                  gap: 10,
                  paddingHorizontal: 20,
                },
              ]}
            >
              <Ionicons color={mutedFg} name="add" size={26} />
              <TextInput
                cursorColor={focusColor}
                onChangeText={onChangeInput}
                onSubmitEditing={onSend}
                placeholder="Ask Ainnb AI…"
                placeholderTextColor={mutedFg}
                returnKeyType="send"
                selectionColor={focusColor}
                style={{ color: surfaceFg, flex: 1, fontSize: 16, paddingVertical: 0 }}
                value={input}
              />
              <Pressable
                accessibilityLabel="Send"
                accessibilityRole="button"
                hitSlop={6}
                onPress={onSend}
                style={{
                  alignItems: "center",
                  backgroundColor: primary,
                  borderRadius: 18,
                  height: 36,
                  justifyContent: "center",
                  width: 36,
                }}
              >
                <Ionicons color={primaryForeground} name="arrow-up" size={20} />
              </Pressable>
            </AdaptiveGlassView>
          </View>
        </View>
      </View>
    </View>
  );
}

function ChatMessageList({
  imageSrc,
  isSaved,
  messages,
  onChipPress,
  onExpandHomes,
  onOpenDetail,
  onSeeActivities,
  onToggleSave,
  sending,
  surface,
}: {
  imageSrc: (image: StaticImage) => string;
  isSaved?: (homeId: string) => boolean;
  messages: AiChatMessage[];
  onChipPress: (chip: string) => void;
  onExpandHomes: (homes: Home[]) => void;
  onOpenDetail?: (homeId: string) => void;
  onSeeActivities: () => void;
  onToggleSave?: (homeId: string) => void;
  sending: boolean;
  surface: string;
}) {
  const renderItem = useCallback(
    ({ item }: { item: AiChatMessage }) => (
      <ChatMessageBubble
        imageSrc={imageSrc}
        isSaved={isSaved}
        message={item}
        onChipPress={onChipPress}
        onExpandHomes={onExpandHomes}
        onOpenDetail={onOpenDetail}
        onSeeActivities={onSeeActivities}
        onToggleSave={onToggleSave}
      />
    ),
    [imageSrc, isSaved, onChipPress, onExpandHomes, onOpenDetail, onSeeActivities, onToggleSave],
  );

  const keyExtractor = useCallback((item: AiChatMessage) => item.id, []);

  const footer = useMemo(() => {
    if (!sending) return null;
    return (
      <View
        style={{
          alignSelf: "flex-start",
          backgroundColor: surface,
          borderRadius: 18,
          marginTop: 12,
          paddingHorizontal: 16,
          paddingVertical: 12,
        }}
      >
        <Spinner size="sm" />
      </View>
    );
  }, [sending, surface]);

  return (
    <FlashList
      ItemSeparatorComponent={MessageGap}
      ListFooterComponent={footer}
      contentContainerStyle={{ paddingBottom: 140, paddingHorizontal: 16, paddingTop: 12 }}
      contentInsetAdjustmentBehavior="automatic"
      data={messages}
      keyExtractor={keyExtractor}
      keyboardDismissMode="on-drag"
      renderItem={renderItem}
      showsVerticalScrollIndicator={false}
    />
  );
}

function MessageGap() {
  return <View style={{ height: 12 }} />;
}
