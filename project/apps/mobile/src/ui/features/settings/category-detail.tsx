import { Ionicons } from "@expo/vector-icons";
import { Switch } from "@pitsi-ui/native/switch";
import { Text } from "@pitsi-ui/native/text";
import {
  type AmenityOption,
  amenityLabels,
  type CurrencyCode,
  currencyLabels,
  type InterestOption,
  interestLabels,
  type LanguageCode,
  labelFor,
  labelsFor,
  languageLabels,
  type SearchRegionOption,
  type StayTypeOption,
  searchRegionLabels,
  stayTypeLabels,
  type ThemeOption,
  type TripPaceOption,
  type TripStyleOption,
  tripPaceLabels,
  tripStyleLabels,
  type UnitsOption,
  type UserPreferences,
  unitsLabels,
} from "@repo/airbnb-headless/preferences";
import { Stack } from "expo-router";
import type { ReactNode } from "react";
import { Pressable, ScrollView, View } from "react-native";
import type { SettingsKey } from "../../../lib/client/features/settings/provider";
import { LiquidGlassInput } from "../../components/liquid-glass-input";
import { Screen } from "../../components/screen";
import { AIRBNB_ACCENT } from "../../theme/airbnb-colors";

export type SettingsCategoryDetailProps = {
  categoryKey: SettingsKey;
  title: string;
  preferences: UserPreferences;
  isLoading: boolean;
  budgetPerNightText?: string;
  user: { name?: string; email?: string } | null;
  onBudgetPerNightBlur?: () => void;
  onBudgetPerNightFocus?: () => void;
  onBudgetPerNightTextChange?: (value: string) => void;
  onUpdate: <K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) => void;
  onReturnToOnboarding?: () => void;
  onThemeChange?: (theme: ThemeOption) => void;
};

export function SettingsCategoryDetail(props: SettingsCategoryDetailProps) {
  return (
    <Screen>
      <Stack.Screen options={{ title: props.title }} />
      <ScrollView
        className="flex-1 bg-background"
        contentContainerClassName="gap-7 px-4 pb-16 pt-3"
        contentInsetAdjustmentBehavior="automatic"
      >
        {renderCategory(props)}
      </ScrollView>
    </Screen>
  );
}

function renderCategory(props: SettingsCategoryDetailProps) {
  switch (props.categoryKey) {
    case "profile":
      return <ProfileSection {...props} />;
    case "travel":
      return <TravelSection {...props} />;
    case "notifications":
      return <NotificationsSection {...props} />;
    case "privacy":
      return <PrivacySection {...props} />;
    case "appearance":
      return <AppearanceSection {...props} />;
    case "payments":
      return <PaymentsSection />;
    case "data":
      return <DataSection {...props} />;
    default:
      return null;
  }
}

// ---------- sections ----------

function ProfileSection({ preferences, user, onReturnToOnboarding }: SettingsCategoryDetailProps) {
  return (
    <>
      <DetailGroup title="Account">
        <ReadOnlyRow label="Name" value={user?.name ?? "Not signed in"} />
        <ReadOnlyRow last label="Email" value={user?.email ?? "—"} />
      </DetailGroup>
      <DetailGroup title="Travel profile">
        <ReadOnlyRow
          label="Trip style"
          value={labelFor(tripStyleLabels, preferences.tripStyle) || "Not set"}
        />
        <ReadOnlyRow
          label="Interests"
          value={labelsFor(interestLabels, preferences.interests).join(", ") || "None"}
        />
        <ReadOnlyRow
          last
          label="Stay types"
          value={labelsFor(stayTypeLabels, preferences.stayTypes).join(", ") || "Any"}
        />
      </DetailGroup>
      {onReturnToOnboarding ? (
        <DetailGroup footer="Re-run onboarding to reset every preference.">
          <PressableRow last onPress={onReturnToOnboarding} title="Return to onboarding" />
        </DetailGroup>
      ) : null}
    </>
  );
}

function TravelSection({
  budgetPerNightText,
  onBudgetPerNightBlur,
  onBudgetPerNightFocus,
  onBudgetPerNightTextChange,
  preferences,
  onUpdate,
}: SettingsCategoryDetailProps) {
  return (
    <>
      <DetailGroup title="Style">
        <EnumPickerRow
          label="Trip style"
          options={tripStyleLabels}
          selected={preferences.tripStyle}
          onSelect={(value) => onUpdate("tripStyle", value as TripStyleOption)}
        />
        <EnumPickerRow
          last
          label="Pace"
          options={tripPaceLabels}
          selected={preferences.tripPace}
          onSelect={(value) => onUpdate("tripPace", value as TripPaceOption)}
        />
      </DetailGroup>
      <DetailGroup title="Budget">
        <NumberInputRow
          last
          label={`Per night (${preferences.currency})`}
          onBlur={onBudgetPerNightBlur}
          onChangeText={(value) => {
            if (onBudgetPerNightTextChange) {
              onBudgetPerNightTextChange(value);
              return;
            }
            const parsed = Number.parseInt(value, 10);
            if (Number.isFinite(parsed)) {
              onUpdate("budgetPerNight", Math.min(5000, Math.max(20, parsed)));
            }
          }}
          onFocus={onBudgetPerNightFocus}
          placeholder="180"
          value={budgetPerNightText ?? String(preferences.budgetPerNight)}
        />
      </DetailGroup>
      <DetailGroup title="Search">
        <EnumPickerRow
          label="Search region"
          options={searchRegionLabels}
          selected={preferences.searchRegion}
          onSelect={(value) => onUpdate("searchRegion", value as SearchRegionOption)}
        />
        <SwitchRow
          last
          label="Map recommendations"
          value={preferences.mapRecommendations}
          onChange={(value) => onUpdate("mapRecommendations", value)}
        />
      </DetailGroup>
      <DetailGroup title="Interests">
        <ChipMultiRow
          options={interestLabels}
          selected={preferences.interests}
          onToggle={(value) =>
            onUpdate(
              "interests",
              toggle(preferences.interests, value as InterestOption) as InterestOption[],
            )
          }
        />
      </DetailGroup>
      <DetailGroup title="Preferred stays">
        <ChipMultiRow
          options={stayTypeLabels}
          selected={preferences.stayTypes}
          onToggle={(value) =>
            onUpdate(
              "stayTypes",
              toggle(preferences.stayTypes, value as StayTypeOption) as StayTypeOption[],
            )
          }
        />
      </DetailGroup>
      <DetailGroup title="Must-have amenities">
        <ChipMultiRow
          options={amenityLabels}
          selected={preferences.amenities}
          onToggle={(value) =>
            onUpdate(
              "amenities",
              toggle(preferences.amenities, value as AmenityOption) as AmenityOption[],
            )
          }
        />
      </DetailGroup>
    </>
  );
}

function NotificationsSection({ preferences, onUpdate }: SettingsCategoryDetailProps) {
  return (
    <DetailGroup title="Alerts">
      <SwitchRow
        label="Trip alerts"
        value={preferences.notifTripAlerts}
        onChange={(value) => onUpdate("notifTripAlerts", value)}
      />
      <SwitchRow
        label="Price drops"
        value={preferences.notifPriceDrops}
        onChange={(value) => onUpdate("notifPriceDrops", value)}
      />
      <SwitchRow
        label="Nearby picks"
        value={preferences.notifNearby}
        onChange={(value) => onUpdate("notifNearby", value)}
      />
      <SwitchRow
        last
        label="Messages"
        value={preferences.notifMessages}
        onChange={(value) => onUpdate("notifMessages", value)}
      />
    </DetailGroup>
  );
}

function PrivacySection({ preferences, onUpdate }: SettingsCategoryDetailProps) {
  return (
    <>
      <DetailGroup title="Account">
        <SwitchRow
          last
          label="Two-factor authentication"
          value={preferences.twoFactor}
          onChange={(value) => onUpdate("twoFactor", value)}
        />
      </DetailGroup>
      <DetailGroup title="Location & memory">
        <SwitchRow
          label="Location sharing"
          value={preferences.locationSharing !== "never"}
          onChange={(value) => onUpdate("locationSharing", value ? "planning" : "never")}
        />
        <SwitchRow
          last
          label="AI memory"
          value={preferences.aiMemory !== "off"}
          onChange={(value) => onUpdate("aiMemory", value ? "trip_preferences" : "off")}
        />
      </DetailGroup>
    </>
  );
}

function AppearanceSection({ preferences, onUpdate, onThemeChange }: SettingsCategoryDetailProps) {
  return (
    <>
      <DetailGroup title="Display">
        <SwitchRow
          label="Dark mode"
          value={preferences.theme === "dark"}
          onChange={(value) => {
            const next: ThemeOption = value ? "dark" : "light";
            onUpdate("theme", next);
            onThemeChange?.(next);
          }}
        />
        <EnumPickerRow
          last
          label="Units"
          options={unitsLabels}
          selected={preferences.units}
          onSelect={(value) => onUpdate("units", value as UnitsOption)}
        />
      </DetailGroup>
      <DetailGroup title="Localization">
        <EnumPickerRow
          label="Language"
          options={languageLabels}
          selected={preferences.language}
          onSelect={(value) => onUpdate("language", value as LanguageCode)}
        />
        <EnumPickerRow
          last
          label="Currency"
          options={currencyLabels}
          selected={preferences.currency}
          onSelect={(value) => onUpdate("currency", value as CurrencyCode)}
        />
      </DetailGroup>
    </>
  );
}

function PaymentsSection() {
  return (
    <DetailGroup title="Wallet" footer="Payment methods are managed at checkout for now.">
      <ReadOnlyRow label="Default card" value="Not added yet" />
      <ReadOnlyRow last label="Travel credits" value="$0" />
    </DetailGroup>
  );
}

function DataSection(_props: SettingsCategoryDetailProps) {
  return (
    <DetailGroup title="Backups" footer="Data export and reset are coming soon.">
      <ReadOnlyRow label="Wishlist export" value="Coming soon" />
      <ReadOnlyRow last label="Trip data" value="Cloud synced" />
    </DetailGroup>
  );
}

// ---------- primitive rows ----------

function DetailGroup({
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

function Row({
  accessory,
  last,
  onPress,
  title,
  children,
}: {
  accessory?: ReactNode;
  last?: boolean;
  onPress?: () => void;
  title: ReactNode;
  children?: ReactNode;
}) {
  const interactive = typeof onPress === "function";
  const body = (
    <View className="min-h-[60px] flex-row items-center gap-3 px-6 py-4">
      <View className="min-w-0 flex-1">
        {typeof title === "string" ? (
          <Text className="text-[17px] font-normal text-foreground" numberOfLines={1}>
            {title}
          </Text>
        ) : (
          title
        )}
        {children}
      </View>
      {accessory ? <View className="ml-2">{accessory}</View> : null}
    </View>
  );

  return (
    <View>
      {interactive ? (
        <Pressable
          accessibilityRole="button"
          android_ripple={{ color: "rgba(0,0,0,0.06)" }}
          onPress={onPress}
        >
          {({ pressed }) => (
            <View style={{ backgroundColor: pressed ? "rgba(0,0,0,0.04)" : "transparent" }}>
              {body}
            </View>
          )}
        </Pressable>
      ) : (
        body
      )}
      {last ? null : <View className="ml-6 h-px bg-separator" />}
    </View>
  );
}

function ReadOnlyRow({ label, last, value }: { label: string; last?: boolean; value: string }) {
  return (
    <Row
      accessory={
        <Text className="text-right text-[15px] text-muted" numberOfLines={1}>
          {value}
        </Text>
      }
      last={last}
      title={label}
    />
  );
}

function PressableRow({
  last,
  onPress,
  title,
}: {
  last?: boolean;
  onPress: () => void;
  title: string;
}) {
  return (
    <Row
      accessory={<Ionicons color="#C7C7CC" name="chevron-forward" size={18} />}
      last={last}
      onPress={onPress}
      title={title}
    />
  );
}

function SwitchRow({
  label,
  last,
  onChange,
  value,
}: {
  label: string;
  last?: boolean;
  onChange: (value: boolean) => void;
  value: boolean;
}) {
  return (
    <Row
      accessory={<Switch isSelected={value} onSelectedChange={onChange} tint={AIRBNB_ACCENT} />}
      last={last}
      title={label}
    />
  );
}

function EnumPickerRow<T extends string>({
  label,
  last,
  onSelect,
  options,
  selected,
}: {
  label: string;
  last?: boolean;
  onSelect: (value: T) => void;
  options: { id: T; title: string; description?: string }[];
  selected: T;
}) {
  return (
    <View>
      <Row title={label} />
      <View>
        {options.map((option, index) => {
          const active = option.id === selected;
          return (
            <Row
              accessory={
                active ? <Ionicons color={AIRBNB_ACCENT} name="checkmark" size={20} /> : null
              }
              key={option.id}
              last={index === options.length - 1}
              onPress={() => onSelect(option.id)}
              title={option.title}
            />
          );
        })}
      </View>
      {last ? null : <View className="ml-6 h-px bg-separator" />}
    </View>
  );
}

function ChipMultiRow({
  onToggle,
  options,
  selected,
}: {
  onToggle: (id: string) => void;
  options: { id: string; title: string }[];
  selected: string[];
}) {
  return (
    <View>
      {options.map((option, index) => {
        const active = selected.includes(option.id);
        return (
          <Row
            accessory={
              active ? <Ionicons color={AIRBNB_ACCENT} name="checkmark" size={20} /> : null
            }
            key={option.id}
            last={index === options.length - 1}
            onPress={() => onToggle(option.id)}
            title={option.title}
          />
        );
      })}
    </View>
  );
}

function NumberInputRow({
  label,
  last,
  onBlur,
  onChangeText,
  onFocus,
  placeholder,
  value,
}: {
  label: string;
  last?: boolean;
  onBlur?: () => void;
  onChangeText: (value: string) => void;
  onFocus?: () => void;
  placeholder?: string;
  value: string;
}) {
  return (
    <Row
      accessory={
        <View className="w-32">
          <LiquidGlassInput
            keyboardType="numeric"
            onBlur={onBlur}
            onChangeText={onChangeText}
            onFocus={onFocus}
            placeholder={placeholder}
            returnKeyType="done"
            shape="roundedRectangle"
            value={value}
          />
        </View>
      }
      last={last}
      title={label}
    />
  );
}

function toggle<T extends string>(values: T[], value: T): T[] {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
}
