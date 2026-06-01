import { View } from "react-native";

import { Separator, Text } from "../..";

const scale = [
  {
    className: "text-4xl font-semibold",
    label: "h1",
    meta: "36px / 600 / 1.11 / tight",
    sample: "Build better interfaces",
  },
  {
    className: "text-3xl font-semibold",
    label: "h2",
    meta: "30px / 600 / 1.17 / tight",
    sample: "Built for the intelligence age",
  },
  {
    className: "text-2xl font-semibold",
    label: "h3",
    meta: "24px / 600 / 1.25 / tight",
    sample: "Pricing on your terms",
  },
  {
    className: "text-xl font-semibold",
    label: "h4",
    meta: "20px / 600 / 1.33 / tight",
    sample: "Apply to the startup program",
  },
  {
    className: "text-lg font-semibold",
    label: "h5",
    meta: "18px / 600 / 1.39 / tight",
    sample: "Card titles",
  },
  {
    className: "text-base font-semibold",
    label: "h6",
    meta: "16px / 600 / 1.50",
    sample: "Smaller feature headers",
  },
  {
    className: "text-base",
    label: "body",
    meta: "16px / 400 / 1.75",
    sample: "Primary body text used across documentation, marketing copy, and descriptions.",
  },
  {
    className: "text-sm",
    label: "body-sm",
    meta: "14px / 400 / 1.50",
    sample: "Secondary body, table cells, navigation, and sidebar items.",
  },
  {
    className: "text-xs",
    label: "body-xs",
    meta: "12px / 400 / 1.25",
    sample: "Captions, badges, helper text, and fine print.",
  },
  {
    className: "text-sm font-mono",
    label: "code",
    meta: "14px / mono",
    sample: "bun add @pitsi-ui/native",
  },
];

export function Basic() {
  return (
    <View className="max-w-md gap-2">
      <Text className="text-3xl font-semibold">Semantic typography</Text>
      <Text className="text-base text-muted">
        One primitive maps visual styles to native text while keeping headings, body copy, inline
        code, and prose readable.
      </Text>
    </View>
  );
}

export function CompoundApi() {
  return (
    <View className="gap-3">
      <Text className="text-4xl font-semibold">Heading via Text.Heading level=1</Text>
      <Text className="text-2xl font-semibold">Heading via Text.Heading level=3</Text>
      <Text className="text-base">Paragraph (base) via Text.Paragraph.</Text>
      <Text className="text-sm">Paragraph (sm) via Text.Paragraph.</Text>
      <Text className="text-xs">Paragraph (xs) via Text.Paragraph.</Text>
      <Text className="text-foreground">
        Inline <Text className="font-mono">code()</Text> rendered via Text.Code.
      </Text>
    </View>
  );
}

export function Modifiers() {
  return (
    <View className="w-full max-w-md gap-3">
      <Text className="text-base font-bold">Body - weight=&quot;bold&quot;</Text>
      <Text className="text-base font-semibold">Body - weight=&quot;semibold&quot;</Text>
      <Text className="text-base text-muted">Body - color=&quot;muted&quot;</Text>
      <Text className="text-center text-base">Body - align=&quot;center&quot;</Text>
      <Text className="text-base" numberOfLines={1}>
        Truncated text - this is intentionally a very long single line so the ellipsis behaviour is
        visible.
      </Text>
    </View>
  );
}

export function Prose() {
  return (
    <View className="max-w-xl gap-4">
      <Text className="text-3xl font-semibold">Pellentesque habitant morbi</Text>
      <Text className="text-base text-foreground">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut purus elit, vestibulum ut,
        placerat ac, adipiscing vitae, felis. Curabitur dictum gravida mauris - nam arcu libero,
        nonummy eget, consectetuer id, vulputate a, magna.
      </Text>
      <View className="gap-2">
        <Text className="text-base">- A bullet with an inline link.</Text>
        <Text className="text-base">- A bullet with inline-code.</Text>
        <Text className="text-base">- One more bullet to round out the list.</Text>
      </View>
      <View className="border-l-4 border-muted pl-4">
        <Text className="text-base text-muted">Quotes pick up a left border and muted color.</Text>
      </View>
      <Separator />
      <Text className="text-base">
        Following content sits below the divider with the same spacing.
      </Text>
    </View>
  );
}

export function TypographyScale() {
  return (
    <View className="w-full">
      {scale.map((row, index) => (
        <View className="gap-4 py-5" key={row.label}>
          <View className="gap-0.5">
            <Text className="text-sm font-semibold text-foreground">{row.label}</Text>
            <Text className="text-xs text-muted">{row.meta}</Text>
          </View>
          <Text className={row.className}>{row.sample}</Text>
          {index < scale.length - 1 ? <Separator /> : null}
        </View>
      ))}
    </View>
  );
}
