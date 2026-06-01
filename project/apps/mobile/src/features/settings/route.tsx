import { useRouter } from "expo-router";
import {
  SettingsFeatureProvider,
  type SettingsKey,
  useSettingsFeature,
} from "../../lib/client/features/settings/provider";
import { SettingsScreen } from "../../ui/features/settings/screen";

function SettingsContainer() {
  const router = useRouter();
  const {
    actions: { setQuery, setSelected },
    state: { filteredCategories, query, selected },
  } = useSettingsFeature();

  return (
    <SettingsScreen
      categories={filteredCategories}
      onOpenKitchenSink={() => router.push("/profile/settings/kitchen-sink")}
      onQueryChange={setQuery}
      onReturnToOnboarding={() => router.push("/onboarding")}
      onSelect={(key) => {
        setSelected(key as SettingsKey);
        router.push(`/profile/settings/${key}`);
      }}
      query={query}
      selected={selected}
    />
  );
}

export function SettingsRoute() {
  return (
    <SettingsFeatureProvider>
      <SettingsContainer />
    </SettingsFeatureProvider>
  );
}
