import { useRouter } from "expo-router";
import { useUserPreferences } from "../../lib/client";
import { OnboardingScreen } from "../../ui/features/onboarding";

export function OnboardingRoute() {
  const router = useRouter();
  const { isAuthenticated, update } = useUserPreferences();

  return (
    <OnboardingScreen
      onFinish={({ name: _name, ...patch }) => {
        // Persist only when signed in; otherwise just continue to home.
        if (isAuthenticated) {
          void update(patch).catch(() => {
            // Surface silently for now — onboarding completion still navigates.
          });
        }
        router.replace("/home");
      }}
    />
  );
}
