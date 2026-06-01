import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useUserPreferences } from "../../lib/client";
import { useSession } from "../../lib/client/auth-client";
import { settingsCategoryByKey } from "../../lib/client/features/settings/provider";
import { setPersistedTheme } from "../../lib/client/global/theme";
import { SettingsCategoryDetail } from "../../ui/features/settings/category-detail";

export function SettingsCategoryRoute() {
  const router = useRouter();
  const params = useLocalSearchParams<{ category?: string }>();
  const category = settingsCategoryByKey(
    typeof params.category === "string" ? params.category : undefined,
  );
  const session = useSession();
  const { preferences, isLoading, update } = useUserPreferences();
  const [budgetPerNightText, setBudgetPerNightText] = useState(String(preferences.budgetPerNight));
  const [isEditingBudgetPerNight, setIsEditingBudgetPerNight] = useState(false);

  useEffect(() => {
    if (!isEditingBudgetPerNight) {
      setBudgetPerNightText(String(preferences.budgetPerNight));
    }
  }, [isEditingBudgetPerNight, preferences.budgetPerNight]);

  const persistBudgetPerNight = (value: string, normalizeText = false) => {
    const parsed = Number.parseInt(value, 10);
    const next = Number.isFinite(parsed) ? Math.min(5000, Math.max(20, parsed)) : 20;
    if (normalizeText) {
      setBudgetPerNightText(String(next));
    }
    void update({ budgetPerNight: next });
  };

  return (
    <SettingsCategoryDetail
      categoryKey={category.key}
      title={category.title}
      preferences={preferences}
      isLoading={isLoading}
      budgetPerNightText={budgetPerNightText}
      user={session.data?.user ?? null}
      onBudgetPerNightBlur={() => {
        setIsEditingBudgetPerNight(false);
        persistBudgetPerNight(budgetPerNightText, true);
      }}
      onBudgetPerNightFocus={() => setIsEditingBudgetPerNight(true)}
      onBudgetPerNightTextChange={(value) => {
        const next = value.replace(/\D/g, "");
        setBudgetPerNightText(next);
        if (next.length > 0) {
          persistBudgetPerNight(next);
        }
      }}
      onUpdate={(key, value) => {
        void update({ [key]: value });
      }}
      onReturnToOnboarding={() => router.push("/onboarding")}
      onThemeChange={(theme) => {
        if (theme === "light" || theme === "dark") {
          setPersistedTheme(theme);
        }
      }}
    />
  );
}
