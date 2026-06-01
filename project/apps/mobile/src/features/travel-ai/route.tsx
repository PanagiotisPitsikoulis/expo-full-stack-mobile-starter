import type { AiPendingAction } from "@repo/airbnb-headless/providers";
import { useRouter } from "expo-router";
import { useCallback, useLayoutEffect } from "react";
import { useRequireAuth } from "../../lib/client/auth-guard";
import { AiFeatureProvider, useAiFeature } from "../../lib/client/features/ai/provider";
import { useTravel } from "../../lib/client/features/travel-shell/provider";
import { useAppData } from "../../lib/client/global/app-data-provider";
import { AiChat } from "../../ui/features/travel-ai/ai-chat";

const SCREEN_PATH: Record<string, string> = {
  home: "/(travel)/(tabs)/home",
  map: "/(travel)/(tabs)/map",
  activities: "/(travel)/(tabs)/activities",
  trips: "/(travel)/(tabs)/profile/trips",
  wishlists: "/(travel)/(tabs)/profile/wishlists",
};

function AiContainer() {
  const {
    actions: { chipPress, deleteAllChats, deleteChat, newChat, selectChat, send, setInput },
    state: { activeId, chips, input, messages, sending, sessions },
  } = useAiFeature();
  const {
    actions: { selection, wishlist },
    selectors: { imageSrc },
  } = useAppData();
  const router = useRouter();
  const requireAuth = useRequireAuth();

  const openDetail = (homeId: string) => {
    selection.selectHome(homeId);
    router.push({ params: { id: homeId }, pathname: "/home/detail" });
  };

  return (
    <AiChat
      activeSessionId={activeId}
      chips={chips}
      imageSrc={imageSrc}
      input={input}
      isSaved={wishlist.isSaved}
      messages={messages}
      onChangeInput={setInput}
      onChipPress={requireAuth(chipPress)}
      onExpandHomes={(homes) => {
        if (homes[0]) openDetail(homes[0].id);
      }}
      onDeleteAllChats={deleteAllChats}
      onDeleteChat={deleteChat}
      onNewChat={newChat}
      onOpenDetail={openDetail}
      onSeeActivities={() => router.push("/activities")}
      onSelectChat={selectChat}
      onSend={requireAuth(() => send())}
      onToggleSave={requireAuth(wishlist.toggleHome)}
      sending={sending}
      sessions={sessions}
    />
  );
}

export function TravelAiRoute() {
  const { setRoute } = useTravel();
  const router = useRouter();
  const {
    actions: { booking, selection },
  } = useAppData();

  useLayoutEffect(() => {
    setRoute("ai");
  }, [setRoute]);

  const onAiAction = useCallback(
    (action: AiPendingAction) => {
      if (action.kind === "open_screen") {
        const path = SCREEN_PATH[action.screen];
        if (path) router.push(path as never);
        return;
      }
      if (action.kind === "start_reservation") {
        selection.selectHome(action.homeId);
        const draft: { checkIn?: string; checkOut?: string; guests?: number } = {};
        if (action.checkIn) draft.checkIn = action.checkIn;
        if (action.checkOut) draft.checkOut = action.checkOut;
        if (action.guests) draft.guests = action.guests;
        if (Object.keys(draft).length > 0) booking.updateDraft(draft);
        router.push({ params: { id: action.homeId }, pathname: "/home/detail" });
        return;
      }
      if (action.kind === "cancel_reservation") {
        booking.cancel(action.reservationId);
        return;
      }
    },
    [booking, router, selection],
  );

  return (
    <AiFeatureProvider onAction={onAiAction}>
      <AiContainer />
    </AiFeatureProvider>
  );
}
