import { useRouter } from "expo-router";
import { useMemo } from "react";
import { useAppData } from "../../lib/client";
import { useTheatres } from "../../lib/client/features/theatres/api";
import { type SavedWishlistItem, WishlistScreen } from "../../ui/features/wishlist/screen";

export function WishlistRoute() {
  const router = useRouter();
  const theatres = useTheatres();
  const {
    actions: { selection, wishlist },
    selectors,
    state: { activities, realData, wishlist: wishlistState },
  } = useAppData();
  const savedItems = useMemo<SavedWishlistItem[]>(() => {
    const eventItems: SavedWishlistItem[] = [
      ...realData.events
        .filter((event) => wishlist.isEventSaved(event.id))
        .map((event) => ({
          id: event.id,
          image: event.image,
          kind: "activity" as const,
          subtitle: [event.venue, event.city].filter(Boolean).join(", ") || "Event",
          title: event.title,
        })),
      ...activities.nearby
        .filter((activity) => wishlist.isEventSaved(activity.id))
        .map((activity) => ({
          id: activity.id,
          image: activity.image,
          kind: "activity" as const,
          subtitle: [activity.price, activity.duration, activity.distance].join(" · "),
          title: activity.title,
        })),
      ...(theatres.data ?? [])
        .filter((theatre) => wishlist.isEventSaved(theatre.id))
        .map((theatre) => ({
          id: theatre.id,
          image: theatre.image,
          kind: "theatre" as const,
          subtitle: [theatre.city, theatre.country].filter(Boolean).join(", ") || "Theatre",
          title: theatre.name,
        })),
    ];
    const byId = new Map(eventItems.map((item) => [`${item.kind}-${item.id}`, item]));
    return [...byId.values()];
  }, [activities.nearby, realData.events, theatres.data, wishlist.isEventSaved]);

  return (
    <WishlistScreen
      error={wishlistState.error}
      homes={wishlistState.homes}
      imageSrc={selectors.imageSrc}
      items={savedItems}
      loading={wishlistState.loading || realData.status === "loading" || theatres.isLoading}
      onOpenHome={(home) => {
        selection.selectHome(home.id);
        router.push("/home/detail");
      }}
      onOpenItem={(item) => {
        if (item.kind === "theatre") {
          router.push({ params: { id: item.id }, pathname: "/theatres/detail" });
          return;
        }
        router.push({ params: { id: item.id }, pathname: "/activities/event" });
      }}
      onToggleHome={wishlist.toggleHome}
      onToggleItem={(item) => wishlist.toggleEvent(item.id)}
    />
  );
}
