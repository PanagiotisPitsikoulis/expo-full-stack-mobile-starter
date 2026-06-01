import { useState } from "react";
import { View } from "react-native";

import { Button, ButtonGroup, Spinner, Text } from "../..";

function IconLabel({ children }: { children: string }) {
  return <Text className="text-base font-semibold">{children}</Text>;
}

export function Basic() {
  return <Button onPress={() => console.log("Button pressed")}>Click me</Button>;
}

export function CustomRenderFunction() {
  return (
    <Button feedbackVariant="scale" variant="secondary">
      Press me
    </Button>
  );
}

export function CustomVariants() {
  return (
    <Button className="rounded-full shadow-md" size="lg">
      Custom Button
    </Button>
  );
}

export function Disabled() {
  return (
    <View className="flex-row flex-wrap gap-3">
      <Button isDisabled>Primary</Button>
      <Button isDisabled variant="secondary">
        Secondary
      </Button>
      <Button isDisabled variant="tertiary">
        Tertiary
      </Button>
      <Button isDisabled variant="outline">
        Outline
      </Button>
      <Button isDisabled variant="ghost">
        Ghost
      </Button>
      <Button isDisabled variant="danger">
        Danger
      </Button>
    </View>
  );
}

export function FullWidth() {
  return (
    <View className="w-full max-w-[400px] gap-3">
      <Button className="w-full">Primary Button</Button>
      <Button className="w-full">
        <IconLabel>+</IconLabel>
        With Icon
      </Button>
    </View>
  );
}

export function IconOnly() {
  return (
    <View className="flex-row gap-3">
      <Button isIconOnly variant="tertiary">
        <IconLabel>...</IconLabel>
      </Button>
      <Button isIconOnly variant="secondary">
        <IconLabel>*</IconLabel>
      </Button>
      <Button isIconOnly variant="danger">
        <IconLabel>x</IconLabel>
      </Button>
    </View>
  );
}

export function Loading() {
  return (
    <Button isDisabled>
      <Spinner color="current" size="sm" />
      Uploading...
    </Button>
  );
}

export function LoadingState() {
  const [isLoading, setLoading] = useState(false);

  const handlePress = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <Button isDisabled={isLoading} onPress={handlePress}>
      {isLoading ? <Spinner color="current" size="sm" /> : <IconLabel>^</IconLabel>}
      {isLoading ? "Uploading..." : "Upload File"}
    </Button>
  );
}

export function OutlineVariant() {
  return (
    <View className="gap-6">
      <View className="gap-2">
        <Text className="text-sm text-muted">Button</Text>
        <View className="flex-row flex-wrap gap-3">
          <Button variant="outline">Outline</Button>
        </View>
      </View>
      <View className="gap-2">
        <Text className="text-sm text-muted">ButtonGroup</Text>
        <ButtonGroup variant="outline">
          <Button>First</Button>
          <Button>Second</Button>
          <Button>Third</Button>
        </ButtonGroup>
      </View>
    </View>
  );
}

export function RippleEffect() {
  return (
    <Button feedbackVariant="scale-ripple" variant="secondary">
      Click me
    </Button>
  );
}

export function Sizes() {
  return (
    <View className="flex-row items-center gap-3">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </View>
  );
}

export function Social() {
  return (
    <View className="w-full max-w-xs gap-3">
      <Button className="w-full" variant="tertiary">
        <IconLabel>G</IconLabel>
        Sign in with Google
      </Button>
      <Button className="w-full" variant="tertiary">
        <IconLabel>#</IconLabel>
        Sign in with GitHub
      </Button>
      <Button className="w-full" variant="tertiary">
        <IconLabel>A</IconLabel>
        Sign in with Apple
      </Button>
    </View>
  );
}

export function Variants() {
  return (
    <View className="flex-row flex-wrap gap-3">
      <Button>Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="tertiary">Tertiary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Danger</Button>
      <Button variant="danger-soft">Danger Soft</Button>
    </View>
  );
}

export function WithIcons() {
  return (
    <View className="flex-row flex-wrap gap-3">
      <Button>
        <IconLabel>?</IconLabel>
        Search
      </Button>
      <Button variant="secondary">
        <IconLabel>+</IconLabel>
        Add Member
      </Button>
      <Button variant="tertiary">
        <IconLabel>@</IconLabel>
        Email
      </Button>
      <Button variant="danger">
        <IconLabel>x</IconLabel>
        Delete
      </Button>
    </View>
  );
}
