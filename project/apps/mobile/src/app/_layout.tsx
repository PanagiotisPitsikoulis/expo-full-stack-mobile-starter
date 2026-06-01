import "react-native-gesture-handler";
import "../global.css";

import { PitsiUINativeProvider } from "@pitsi-ui/native/provider";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { StatusBar } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useCSSVariable, useUniwind } from "uniwind";
import { AppDataProvider, UserPreferencesProvider } from "../lib/client";
import { ReactQueryProvider } from "../lib/client/global/react-query-provider";
import { restorePersistedTheme } from "../lib/client/global/theme";
import { AndroidMaterialYouTheme } from "../ui/theme/material-you-theme";

const pitsiUIConfig = {
  devInfo: { stylingPrinciples: false },
  textProps: { maxFontSizeMultiplier: 1.2 },
} as const;

function ThemedStatusBar() {
  const { theme } = useUniwind();
  const [background] = useCSSVariable(["--background"]) as [string];
  const dark = theme === "dark";

  return (
    <StatusBar backgroundColor={background} barStyle={dark ? "light-content" : "dark-content"} />
  );
}

export default function Layout() {
  const [themeReady, setThemeReady] = useState(false);
  useEffect(() => {
    restorePersistedTheme().finally(() => setThemeReady(true));
  }, []);

  if (!themeReady) {
    return <GestureHandlerRootView className="flex-1 bg-background" />;
  }

  return (
    <GestureHandlerRootView className="flex-1 bg-background">
      <AndroidMaterialYouTheme />
      <ReactQueryProvider>
        <PitsiUINativeProvider config={pitsiUIConfig}>
          <AppDataProvider>
            <UserPreferencesProvider>
              <ThemedStatusBar />
              <Stack
                screenOptions={{
                  headerShown: false,
                }}
              />
            </UserPreferencesProvider>
          </AppDataProvider>
        </PitsiUINativeProvider>
      </ReactQueryProvider>
    </GestureHandlerRootView>
  );
}
