import { View } from "react-native";

import { SkeletonGroup, Text } from "../..";

export function Basic() {
  return (
    <SkeletonGroup className="w-full max-w-[340px] gap-3" isLoading>
      <SkeletonGroup.Item className="h-5 w-48 rounded-full" />
      <SkeletonGroup.Item className="h-4 w-full rounded-full" />
      <SkeletonGroup.Item className="h-4 w-4/5 rounded-full" />
    </SkeletonGroup>
  );
}

export function SharedVariant() {
  return (
    <SkeletonGroup className="w-full max-w-[340px] gap-3" isLoading variant="pulse">
      <SkeletonGroup.Item className="h-12 w-12 rounded-full" />
      <SkeletonGroup.Item className="h-4 w-full rounded-full" />
      <SkeletonGroup.Item className="h-4 w-2/3 rounded-full" variant="shimmer" />
    </SkeletonGroup>
  );
}

export function LoadedState() {
  return (
    <SkeletonGroup className="gap-2" isLoading={false}>
      <SkeletonGroup.Item className="h-5 w-44 rounded-full">
        <Text className="text-base font-medium text-foreground">Loaded from cache</Text>
      </SkeletonGroup.Item>
    </SkeletonGroup>
  );
}

export function SkeletonOnly() {
  return (
    <View className="gap-3">
      <SkeletonGroup isLoading={false} isSkeletonOnly>
        <SkeletonGroup.Item className="h-4 w-40 rounded-full" />
      </SkeletonGroup>
      <Text className="text-sm text-muted">The group above hides itself when loading ends.</Text>
    </View>
  );
}
