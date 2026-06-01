import { View } from "react-native";

import { ProgressBar, Text } from "../..";

export function Basic() {
  return (
    <View className="w-72">
      <ProgressBar className="gap-2" value={48}>
        <View className="flex-row items-center justify-between">
          <Text className="text-sm font-medium text-foreground">Uploading</Text>
          <ProgressBar.Output />
        </View>
        <ProgressBar.Track>
          <ProgressBar.Fill />
        </ProgressBar.Track>
      </ProgressBar>
    </View>
  );
}

export function Sizes() {
  return (
    <View className="w-72 gap-4">
      {(["sm", "md", "lg"] as const).map((size) => (
        <ProgressBar key={size} size={size} value={66}>
          <ProgressBar.Track>
            <ProgressBar.Fill />
          </ProgressBar.Track>
        </ProgressBar>
      ))}
    </View>
  );
}
