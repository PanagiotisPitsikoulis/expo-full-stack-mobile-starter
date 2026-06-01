import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { signOut, useSession } from "../../lib/client/auth-client";
import { useProfileSummary } from "../../lib/client/features/reservations/api";
import { AccountSurface } from "../../ui/components/account-surface";

export function ProfileRoute() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data } = useSession();
  const profileSummary = useProfileSummary();
  const profile = profileSummary.data?.profile;
  const stats = profileSummary.data?.stats;

  const authLink = data?.user
    ? {
        destructive: true,
        label: "Sign out",
        onPress: async () => {
          await signOut();
          queryClient.clear();
          router.replace("/login");
        },
      }
    : { destructive: true, label: "Log in or sign up", onPress: () => router.push("/login") };
  const displayName = profile?.name ?? data?.user?.name ?? "Guest";
  const displayEmail = profile?.email ?? data?.user?.email ?? "Sign in to load account details";
  const seed = profile?.email ?? data?.user?.email ?? displayName;
  const statsLine = [
    `${stats?.activeReservations ?? 0} active`,
    `${stats?.historyReservations ?? 0} in history`,
    `${stats?.wishlists ?? 0} saved stays`,
    `${stats?.eventReservations ?? 0} event reservations`,
    `${stats?.theatreReservations ?? 0} theatre bookings`,
  ].join(" · ");

  return (
    <AccountSurface
      email={displayEmail}
      links={[
        { label: "Wishlists", onPress: () => router.push("/profile/wishlists") },
        { label: "Reservations", onPress: () => router.push("/profile/trips") },
        { label: "Settings", onPress: () => router.push("/profile/settings") },
        authLink,
      ]}
      loading={profileSummary.isLoading}
      name={displayName}
      seed={seed}
      stats={statsLine}
    />
  );
}
