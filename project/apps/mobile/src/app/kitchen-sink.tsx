/**
 * `/kitchen-sink` — auto-discovered preview gallery for every component file
 * in `src/ui/components`. Enumeration happens at build time via Metro's
 * `require.context`; the actual preview content lives in
 * `_meta/component-previews.tsx`. Adding a `.tsx` file to the components
 * folder makes it show up here automatically as either a real preview (if
 * an entry exists) or a "no preview yet" placeholder.
 */

import { Text } from "@pitsi-ui/native/text";
import { Stack } from "expo-router";
import { ScrollView, View } from "react-native";
import { Screen } from "../ui/components/screen";
import { componentPreviews, MissingPreview, PreviewSection } from "./_meta/component-previews";

// `require.context` is enabled in metro.config.js via
// `transformer.unstable_allowRequireContext = true`.
const componentsContext = (
  require as unknown as {
    context: (dir: string, deep?: boolean, pattern?: RegExp) => { keys: () => string[] };
  }
).context("../ui/components", false, /\.tsx$/);

const componentNames = componentsContext
  .keys()
  .map((key) => key.replace(/^\.\//, "").replace(/\.tsx$/, ""))
  .filter((name) => !name.startsWith("_"))
  .sort();

export default function KitchenSinkScreen() {
  return (
    <Screen>
      <Stack.Screen options={{ title: "Kitchen sink" }} />
      <ScrollView
        className="flex-1 bg-background"
        contentContainerClassName="gap-8 px-4 pb-20 pt-4"
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-1">
          <Text className="text-[22px] font-semibold tracking-tight text-foreground">
            Kitchen sink
          </Text>
          <Text className="text-[14px] text-muted">{componentNames.length} previews</Text>
        </View>

        {componentNames.map((name) => {
          const entry = componentPreviews[name];
          return (
            <PreviewSection key={name} name={name}>
              {entry ? entry.render() : <MissingPreview name={name} />}
            </PreviewSection>
          );
        })}
      </ScrollView>
    </Screen>
  );
}
