import { Ionicons } from "@expo/vector-icons";
import { Text } from "@pitsi-ui/native/text";
import type { ReactNode } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { LiquidGlassInput } from "../../components/liquid-glass-input";
import { Screen } from "../../components/screen";

type SettingsCategoryView = { description: string; key: string; title: string };

const SECTION_GROUPS: { keys: string[]; title?: string }[] = [
  { keys: ["profile", "travel"], title: "Personal" },
  { keys: ["appearance", "notifications"], title: "Preferences" },
  { keys: ["payments", "privacy"], title: "Account" },
  { keys: ["data"], title: "Advanced" },
];

export function SettingsScreen({
  categories,
  onOpenKitchenSink,
  onQueryChange,
  onReturnToOnboarding,
  onSelect,
  query,
  selected,
}: {
  categories: SettingsCategoryView[];
  onOpenKitchenSink?: () => void;
  onQueryChange: (query: string) => void;
  onReturnToOnboarding?: () => void;
  onSelect: (key: string) => void;
  query: string;
  selected: string;
}) {
  const byKey = new Map(categories.map((c) => [c.key, c] as const));
  const searching = query.trim().length > 0;

  return (
    <Screen>
      <ScrollView
        className="flex-1 bg-background"
        contentContainerClassName="gap-7 px-4 pb-16 pt-3"
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
      >
        <LiquidGlassInput
          onChangeText={onQueryChange}
          placeholder="Search settings"
          value={query}
        />

        {searching ? (
          <SettingsSection>
            {categories.map((category, index) => (
              <SettingsRow
                accessory={<DisclosureChevron />}
                isFirst={index === 0}
                isLast={index === categories.length - 1}
                key={category.key}
                onPress={() => onSelect(category.key)}
                selected={category.key === selected}
                title={category.title}
              />
            ))}
            {categories.length === 0 ? (
              <View className="px-6 py-5">
                <Text className="text-[15px] text-muted">No results</Text>
              </View>
            ) : null}
          </SettingsSection>
        ) : (
          <>
            {SECTION_GROUPS.map((group) => {
              const items = group.keys
                .map((key) => byKey.get(key))
                .filter((c): c is SettingsCategoryView => Boolean(c));
              if (items.length === 0) return null;
              return (
                <SettingsSection key={group.keys.join("-")} title={group.title}>
                  {items.map((category, index) => (
                    <SettingsRow
                      accessory={<DisclosureChevron />}
                      isFirst={index === 0}
                      isLast={index === items.length - 1}
                      key={category.key}
                      onPress={() => onSelect(category.key)}
                      selected={category.key === selected}
                      title={category.title}
                    />
                  ))}
                </SettingsSection>
              );
            })}

            {onReturnToOnboarding ? (
              <SettingsSection footer="Re-run the setup flow to reset your baseline preferences.">
                <SettingsRow
                  accessory={<DisclosureChevron />}
                  isFirst
                  isLast={!onOpenKitchenSink}
                  onPress={onReturnToOnboarding}
                  title="Return to onboarding"
                />
                {onOpenKitchenSink ? (
                  <SettingsRow
                    accessory={<DisclosureChevron />}
                    isLast
                    onPress={onOpenKitchenSink}
                    title="Open kitchen sink"
                  />
                ) : null}
              </SettingsSection>
            ) : null}
          </>
        )}
      </ScrollView>
    </Screen>
  );
}

function SettingsSection({
  children,
  footer,
  title,
}: {
  children: ReactNode;
  footer?: string;
  title?: string;
}) {
  return (
    <View className="gap-2">
      {title ? <Text className="px-4 text-[13px] font-normal text-muted">{title}</Text> : null}
      <View
        className="overflow-hidden rounded-3xl bg-surface"
        style={{ borderCurve: "continuous" }}
      >
        {children}
      </View>
      {footer ? <Text className="px-4 text-[13px] leading-[18px] text-muted">{footer}</Text> : null}
    </View>
  );
}

function SettingsRow({
  accessory,
  isLast,
  onPress,
  selected,
  title,
}: {
  accessory?: ReactNode;
  isFirst?: boolean;
  isLast?: boolean;
  onPress?: () => void;
  selected?: boolean;
  title: string;
}) {
  const interactive = typeof onPress === "function";
  const content = (
    <View className="min-h-[60px] flex-row items-center gap-3 px-6 py-4">
      <View className="min-w-0 flex-1">
        <Text className="text-[17px] font-normal text-foreground" numberOfLines={1}>
          {title}
        </Text>
      </View>
      {accessory ? <View className="ml-2">{accessory}</View> : null}
    </View>
  );

  return (
    <View>
      {interactive ? (
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ selected }}
          android_ripple={{ color: "rgba(0,0,0,0.06)" }}
          onPress={onPress}
        >
          {({ pressed }) => (
            <View
              style={{
                backgroundColor: pressed ? "rgba(0,0,0,0.04)" : "transparent",
              }}
            >
              {content}
            </View>
          )}
        </Pressable>
      ) : (
        content
      )}
      {isLast ? null : <View className="ml-6 h-px bg-separator" />}
    </View>
  );
}

function DisclosureChevron() {
  return <Ionicons color="#C7C7CC" name="chevron-forward" size={18} />;
}
