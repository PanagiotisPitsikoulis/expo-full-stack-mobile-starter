import { View } from "react-native";

import { Separator, Surface, Text } from "../..";

const items = [
  {
    color: "#7c3aed",
    subtitle: "Receive account activity updates",
    title: "Set Up Notifications",
  },
  {
    color: "#0891b2",
    subtitle: "Connect your browser to your account",
    title: "Set up Browser Extension",
  },
  {
    color: "#16a34a",
    subtitle: "Create your first collectible",
    title: "Mint Collectible",
  },
];

function LinkRow() {
  return (
    <View className="h-5 flex-row items-center gap-4">
      <Text className="text-sm">Blog</Text>
      <Separator orientation="vertical" />
      <Text className="text-sm">Docs</Text>
      <Separator orientation="vertical" />
      <Text className="text-sm">Source</Text>
    </View>
  );
}

export function Basic() {
  return (
    <View className="max-w-md">
      <View className="gap-1">
        <Text className="text-base font-medium">PitsiUI Components</Text>
        <Text className="text-sm text-muted">Beautiful, fast and modern React UI library.</Text>
      </View>
      <Separator className="my-4" />
      <LinkRow />
    </View>
  );
}

export function CustomRenderFunction() {
  return (
    <View className="max-w-md">
      <View className="gap-1">
        <Text className="text-base font-medium">PitsiUI Components</Text>
        <Text className="text-sm text-muted">Beautiful, fast and modern React UI library.</Text>
      </View>
      <Separator className="my-4 bg-accent" thickness={2} />
      <LinkRow />
    </View>
  );
}

export function ManualVariantOverride() {
  return (
    <View className="gap-8">
      <View className="gap-2">
        <Text className="text-sm font-medium text-muted">Separator on default surface</Text>
        <Surface className="min-w-[320px] gap-3 rounded-3xl p-6" variant="default">
          <Text className="text-base font-semibold text-foreground">Surface Content</Text>
          <Separator />
          <Text className="text-sm text-muted">
            The separator adapts to the surface background.
          </Text>
        </Surface>
      </View>

      <View className="gap-2">
        <Text className="text-sm font-medium text-muted">Separator on secondary surface</Text>
        <Surface className="min-w-[320px] gap-3 rounded-3xl p-6" variant="secondary">
          <Text className="text-base font-semibold text-foreground">Surface Content</Text>
          <Separator className="bg-muted" />
          <Text className="text-sm text-muted">
            The separator adapts to the surface background.
          </Text>
        </Surface>
      </View>
    </View>
  );
}

export function Variants() {
  return (
    <View className="max-w-md items-center gap-3">
      <Text>Default Variant</Text>
      <Separator />
      <Text>Secondary Variant</Text>
      <Separator className="bg-muted" />
      <Text>Tertiary Variant</Text>
      <Separator variant="thick" />
    </View>
  );
}

export function Vertical() {
  return <LinkRow />;
}

export function WithContent() {
  return (
    <View className="max-w-md gap-4">
      {items.map((item, index) => (
        <View key={item.title}>
          <View className="flex-row items-center gap-3">
            <View
              accessibilityLabel={item.title}
              accessibilityRole="image"
              className="size-12 rounded-2xl"
              style={{ backgroundColor: item.color }}
            />
            <View className="flex-1">
              <Text className="text-sm font-medium">{item.title}</Text>
              <Text className="text-sm text-muted">{item.subtitle}</Text>
            </View>
          </View>
          {index < items.length - 1 ? <Separator className="my-4" /> : null}
        </View>
      ))}
    </View>
  );
}

export function WithSurface() {
  return (
    <View className="gap-8">
      <Surface className="min-w-[320px] gap-3 rounded-3xl p-6" variant="default">
        <Text className="text-base font-semibold text-foreground">Default Surface</Text>
        <Separator />
        <Text className="text-sm text-muted">Surface Content</Text>
      </Surface>

      <Surface className="min-w-[320px] gap-3 rounded-3xl p-6" variant="secondary">
        <Text className="text-base font-semibold text-foreground">Secondary Surface</Text>
        <Separator className="bg-muted" />
        <Text className="text-sm text-muted">Surface Content</Text>
      </Surface>

      <Surface className="min-w-[320px] gap-3 rounded-3xl p-6" variant="tertiary">
        <Text className="text-base font-semibold text-foreground">Tertiary Surface</Text>
        <Separator variant="thick" />
        <Text className="text-sm text-muted">Surface Content</Text>
      </Surface>

      <Surface className="min-w-[320px] gap-3 rounded-3xl border p-6" variant="transparent">
        <Text className="text-base font-semibold text-foreground">Transparent Surface</Text>
        <Separator />
        <Text className="text-sm text-muted">Surface Content</Text>
      </Surface>
    </View>
  );
}
