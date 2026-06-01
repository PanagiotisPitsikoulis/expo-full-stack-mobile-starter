import { View } from "react-native";

import { LinkButton, Text } from "../..";

export function Basic() {
  return <LinkButton>Learn more</LinkButton>;
}

export function InlineText() {
  return (
    <View className="max-w-sm flex-row flex-wrap items-center gap-x-1 gap-y-2">
      <Text className="text-base text-muted">By continuing you agree to the</Text>
      <LinkButton size="sm">
        <LinkButton.Label>Terms</LinkButton.Label>
      </LinkButton>
      <Text className="text-base text-muted">and</Text>
      <LinkButton size="sm">
        <LinkButton.Label>Privacy Policy</LinkButton.Label>
      </LinkButton>
      <Text className="text-base text-muted">.</Text>
    </View>
  );
}

export function Disabled() {
  return <LinkButton isDisabled>Invite pending</LinkButton>;
}
