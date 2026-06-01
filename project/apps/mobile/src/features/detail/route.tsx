import { useLocalSearchParams, useRouter } from "expo-router";
import { useAppData } from "../../lib/client";
import { useRequireAuth } from "../../lib/client/auth-guard";
import { DetailScreen } from "../../ui/features/detail/screen";

export function DetailRoute() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const homeId = typeof params.id === "string" ? params.id : undefined;
  const {
    actions: { selection, wishlist },
    selectors,
    state: { detail, listings },
  } = useAppData();
  const copy = detail.copy.homes;
  const home = (homeId ? listings.homesById[homeId] : undefined) ?? listings.selectedHome;
  const requireAuth = useRequireAuth();

  return (
    <DetailScreen
      buttonLabel={copy.button}
      copyBadge={copy.badge}
      galleryImages={detail.galleryImages}
      home={home}
      imageSrc={selectors.imageSrc}
      onCheckout={requireAuth(() => {
        selection.selectHome(home.id);
        router.push("/home/checkout");
      })}
      onToggleSave={requireAuth(() => wishlist.toggleHome(home.id))}
      saved={wishlist.isSaved(home.id)}
    />
  );
}
