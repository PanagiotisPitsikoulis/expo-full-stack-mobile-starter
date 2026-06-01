import { createContext, type ReactNode, useContext, useMemo, useState } from "react";

export type SettingsKey =
  | "profile"
  | "travel"
  | "payments"
  | "notifications"
  | "privacy"
  | "appearance"
  | "data";

export type SettingsCategory = { description: string; key: SettingsKey; title: string };
export type SettingsDetailItem = { description?: string; title: string };

export const SETTINGS_CATEGORIES: SettingsCategory[] = [
  { description: "Identity, guest details, and verification", key: "profile", title: "Profile" },
  { description: "AI preferences, budget, and trip style", key: "travel", title: "Travel" },
  { description: "Cards, credits, and receipts", key: "payments", title: "Payments" },
  { description: "Trip alerts and AI updates", key: "notifications", title: "Notifications" },
  { description: "Safety, sharing, and account access", key: "privacy", title: "Privacy" },
  { description: "Theme and display density", key: "appearance", title: "Appearance" },
  { description: "Exports, backups, and reset", key: "data", title: "Data" },
];

export function settingsCategoryByKey(key: string | undefined): SettingsCategory {
  return SETTINGS_CATEGORIES.find((category) => category.key === key) ?? SETTINGS_CATEGORIES[0];
}

const SETTINGS_DETAIL_ITEMS: Record<SettingsKey, SettingsDetailItem[]> = {
  profile: [
    { title: "Personal details" },
    { title: "Identity verification" },
    { title: "Guest profile" },
  ],
  travel: [{ title: "Trip style" }, { title: "Budget range" }, { title: "AI recommendations" }],
  payments: [{ title: "Payment methods" }, { title: "Credits" }, { title: "Receipts" }],
  notifications: [{ title: "Trip alerts" }, { title: "Messages" }, { title: "Recommendations" }],
  privacy: [{ title: "Account access" }, { title: "Sharing" }, { title: "Safety" }],
  appearance: [{ title: "Theme" }, { title: "Display density" }, { title: "Language" }],
  data: [{ title: "Export data" }, { title: "Backups" }, { title: "Reset account data" }],
};

export function settingsDetailItemsForKey(key: SettingsKey): SettingsDetailItem[] {
  return SETTINGS_DETAIL_ITEMS[key];
}

type SettingsFeatureValue = {
  actions: {
    setQuery: (query: string) => void;
    setSelected: (key: SettingsKey) => void;
  };
  state: {
    filteredCategories: SettingsCategory[];
    query: string;
    selected: SettingsKey;
  };
};

const SettingsFeatureContext = createContext<SettingsFeatureValue | null>(null);

export function SettingsFeatureProvider({
  children,
  initialSelected = "profile",
}: {
  children: ReactNode;
  initialSelected?: SettingsKey;
}) {
  const [selected, setSelected] = useState<SettingsKey>(initialSelected);
  const [query, setQuery] = useState("");

  const filteredCategories = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return SETTINGS_CATEGORIES;
    return SETTINGS_CATEGORIES.filter(
      (category) =>
        category.title.toLowerCase().includes(normalized) ||
        category.description.toLowerCase().includes(normalized),
    );
  }, [query]);

  const value = useMemo<SettingsFeatureValue>(
    () => ({
      actions: { setQuery, setSelected },
      state: { filteredCategories, query, selected },
    }),
    [filteredCategories, query, selected],
  );

  return (
    <SettingsFeatureContext.Provider value={value}>{children}</SettingsFeatureContext.Provider>
  );
}

export function useSettingsFeature() {
  const value = useContext(SettingsFeatureContext);
  if (!value) {
    throw new Error("useSettingsFeature must be used within SettingsFeatureProvider");
  }
  return value;
}
