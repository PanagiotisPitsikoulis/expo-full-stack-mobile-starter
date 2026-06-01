import { Ionicons } from "@expo/vector-icons";
import { Card } from "@pitsi-ui/native/card";
import { Text } from "@pitsi-ui/native/text";
import type { ReactNode } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { Screen } from "./screen";
import { SeedAvatar } from "./seed-avatar";

type AccountLink = { destructive?: boolean; label: string; onPress: () => void };

export function AccountSurface({
  email,
  links = [],
  loading,
  name,
  seed,
  stats,
}: {
  email: string;
  links?: AccountLink[];
  loading?: boolean;
  name: string;
  seed: string;
  stats?: string;
}) {
  if (loading) {
    return (
      <Screen>
        <View className="flex-1" />
      </Screen>
    );
  }

  const navLinks = links.filter((link) => !link.destructive);
  const authLinks = links.filter((link) => link.destructive);

  return (
    <Screen>
      <ScrollView
        className="flex-1 bg-background"
        contentContainerClassName="gap-7 px-4 pb-16 pt-3"
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
      >
        <Card className="flex-row items-center gap-4 p-4">
          <SeedAvatar seed={seed} size={72} />
          <Card.Body className="flex-1">
            <Card.Title className="text-[18px] font-semibold text-foreground">{name}</Card.Title>
            <Card.Description className="mt-1 text-[14px] text-muted">{email}</Card.Description>
          </Card.Body>
        </Card>

        {stats ? (
          <Text className="-mt-4 px-2 text-left text-[13px] text-muted">{stats}</Text>
        ) : null}

        {navLinks.length > 0 ? (
          <AccountSection>
            {navLinks.map((link, index) => (
              <AccountRow
                accessory={<DisclosureChevron />}
                isLast={index === navLinks.length - 1}
                key={link.label}
                onPress={link.onPress}
                title={link.label}
              />
            ))}
          </AccountSection>
        ) : null}

        {authLinks.length > 0 ? (
          <AccountSection>
            {authLinks.map((link, index) => (
              <AccountRow
                isLast={index === authLinks.length - 1}
                key={link.label}
                onPress={link.onPress}
                title={link.label}
              />
            ))}
          </AccountSection>
        ) : null}
      </ScrollView>
    </Screen>
  );
}

function AccountSection({ children }: { children: ReactNode }) {
  return (
    <View className="overflow-hidden rounded-3xl bg-surface" style={{ borderCurve: "continuous" }}>
      {children}
    </View>
  );
}

function AccountRow({
  accessory,
  isLast,
  onPress,
  title,
}: {
  accessory?: ReactNode;
  isLast?: boolean;
  onPress?: () => void;
  title: string;
}) {
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
      <Pressable
        accessibilityRole="button"
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
      {isLast ? null : <View className="ml-6 h-px bg-separator" />}
    </View>
  );
}

function DisclosureChevron() {
  return <Ionicons color="#C7C7CC" name="chevron-forward" size={18} />;
}
