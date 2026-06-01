import { View } from "react-native";

import { Avatar, Badge, Separator, Text } from "../..";

const AVATAR_URL = "https://pitsiui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/green.jpg";
const colors = ["default", "accent", "success", "warning", "danger"] as const;

function AvatarBadge({
  children,
  color = "danger",
  label = "John Doe",
  placement = "top-right",
  size = "sm",
  variant = "primary",
}: {
  children?: React.ReactNode;
  color?: "accent" | "danger" | "default" | "success" | "warning";
  label?: string;
  placement?: "bottom-left" | "bottom-right" | "top-left" | "top-right";
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary" | "soft";
}) {
  return (
    <Badge.Anchor>
      <Avatar alt={label} size={size}>
        <Avatar.Image source={{ uri: AVATAR_URL }} />
        <Avatar.Fallback>JD</Avatar.Fallback>
      </Avatar>
      <Badge color={color} placement={placement} size={size} variant={variant}>
        {children}
      </Badge>
    </Badge.Anchor>
  );
}

export function Basic() {
  return (
    <View className="flex-row flex-wrap items-center gap-6">
      <AvatarBadge color="danger">5</AvatarBadge>
      <AvatarBadge color="accent">New</AvatarBadge>
      <AvatarBadge color="success" placement="bottom-right" />
    </View>
  );
}

export function Colors() {
  return (
    <View className="flex-row flex-wrap items-center gap-6">
      {colors.map((color) => (
        <AvatarBadge color={color} key={color} />
      ))}
    </View>
  );
}

export function Dot() {
  return (
    <View className="flex-row flex-wrap items-center gap-6">
      {colors
        .filter((color) => color !== "default")
        .map((color) => (
          <AvatarBadge color={color} key={color} placement="bottom-right" />
        ))}
    </View>
  );
}

export function Placements() {
  const placements = ["top-right", "top-left", "bottom-right", "bottom-left"] as const;

  return (
    <View className="flex-row flex-wrap items-center gap-8">
      {placements.map((placement) => (
        <View className="items-center gap-2" key={placement}>
          <AvatarBadge color="accent" placement={placement} />
          <Text className="text-xs text-muted">{placement}</Text>
        </View>
      ))}
    </View>
  );
}

export function Sizes() {
  return (
    <View className="flex-row flex-wrap items-center gap-6">
      {(["sm", "md", "lg"] as const).map((size) => (
        <AvatarBadge color="danger" key={size} size={size}>
          5
        </AvatarBadge>
      ))}
    </View>
  );
}

export function Variants() {
  const variants = ["primary", "secondary", "soft"] as const;

  return (
    <View className="gap-8">
      {variants.map((variant, index) => (
        <View className="gap-4" key={variant}>
          <Text className="text-sm font-semibold text-muted">{variant}</Text>
          <View className="flex-row flex-wrap items-center gap-6">
            {colors.map((color) => (
              <AvatarBadge color={color} key={color} variant={variant}>
                5
              </AvatarBadge>
            ))}
          </View>
          {index < variants.length - 1 ? <Separator /> : null}
        </View>
      ))}
    </View>
  );
}

export function WithContent() {
  return (
    <View className="flex-row flex-wrap items-center gap-6">
      <AvatarBadge color="danger">5</AvatarBadge>
      <AvatarBadge color="danger">New</AvatarBadge>
      <AvatarBadge color="danger">99+</AvatarBadge>
      <AvatarBadge color="accent">
        <Text className="text-[10px] text-accent-foreground">!</Text>
      </AvatarBadge>
    </View>
  );
}
