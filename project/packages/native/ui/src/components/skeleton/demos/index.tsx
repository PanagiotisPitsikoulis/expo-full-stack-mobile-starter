import { View } from "react-native";

import { Skeleton, Text } from "../..";

export function AnimationTypes() {
  return (
    <View className="w-full max-w-[320px] gap-4">
      <Skeleton className="h-4 w-full rounded-full" variant="shimmer" />
      <Skeleton className="h-4 w-4/5 rounded-full" variant="pulse" />
      <Skeleton className="h-4 w-3/5 rounded-full" variant="none" />
    </View>
  );
}

export function Basic() {
  return <Skeleton className="h-4 w-48 rounded-full" />;
}

export function Grid() {
  return (
    <View className="w-full max-w-[360px] flex-row flex-wrap gap-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <Skeleton className="h-24 w-[104px] rounded-2xl" key={index} />
      ))}
    </View>
  );
}

export function List() {
  return (
    <View className="w-full max-w-[360px] gap-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <View className="flex-row items-center gap-3" key={index}>
          <Skeleton className="h-10 w-10 rounded-full" />
          <View className="flex-1 gap-2">
            <Skeleton className="h-4 w-3/4 rounded-full" />
            <Skeleton className="h-3 w-1/2 rounded-full" />
          </View>
        </View>
      ))}
    </View>
  );
}

export function SingleShimmer() {
  return <Skeleton className="h-6 w-56 rounded-full" variant="shimmer" />;
}

export function TextContent() {
  return (
    <View className="w-full max-w-[360px] gap-3">
      <Skeleton className="h-5 w-2/3 rounded-full" />
      <Skeleton className="h-4 w-full rounded-full" />
      <Skeleton className="h-4 w-5/6 rounded-full" />
      <Skeleton isLoading={false} className="h-4 w-full rounded-full">
        <Text className="text-sm text-muted">Loaded text content</Text>
      </Skeleton>
    </View>
  );
}

export function UserProfile() {
  return (
    <View className="w-full max-w-[360px] gap-4 rounded-2xl bg-surface p-4">
      <View className="flex-row items-center gap-3">
        <Skeleton className="h-12 w-12 rounded-full" />
        <View className="flex-1 gap-2">
          <Skeleton className="h-4 w-3/4 rounded-full" />
          <Skeleton className="h-3 w-1/2 rounded-full" />
        </View>
      </View>
      <Skeleton className="h-24 w-full rounded-2xl" />
    </View>
  );
}
