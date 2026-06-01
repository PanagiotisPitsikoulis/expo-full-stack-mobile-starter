import { useCSSVariable, useUniwind } from "uniwind";

const useCustomHeaderStyles = process.env.EXPO_OS === "ios";
const useThemedDefaultHeaderStyles = process.env.EXPO_OS === "android";
const androidHeaderContentGap = 10;

/**
 * Native Stack header style shared by the tab stacks + pushed screens.
 * iOS keeps the custom frosted/transparent topbar styling. Other platforms use
 * the native-stack defaults so Android keeps its standard app bar behavior.
 */
export function useAirbnbHeaderOptions() {
  const { theme } = useUniwind();
  const [background] = useCSSVariable(["--background"]) as [string];
  const dark = theme === "dark";
  const tint = dark ? "#fafafa" : "#222222";

  if (useThemedDefaultHeaderStyles) {
    return {
      contentStyle: { backgroundColor: background, paddingTop: androidHeaderContentGap },
      headerShadowVisible: false,
      headerStyle: {
        backgroundColor: background,
        elevation: 0,
        shadowOpacity: 0,
      },
      headerTitleAlign: "center",
      headerTintColor: tint,
      headerTitleStyle: {
        color: tint,
      },
    } as const;
  }

  if (!useCustomHeaderStyles) {
    return {};
  }

  return {
    headerBackButtonDisplayMode: "minimal",
    // Default iOS frosted nav bar. `systemChromeMaterial` is the system chrome
    // material Apple uses for navigation bars and adapts to light/dark on its own.
    headerLargeTitle: false,
    // Show the native hairline separator under the blurred bar.
    headerShadowVisible: true,
    headerStyle: { backgroundColor: "transparent" },
    headerTintColor: tint,
    headerTitleStyle: {
      color: tint,
      fontSize: 16,
      fontWeight: "700",
    },
    headerTransparent: true,
  } as const;
}
