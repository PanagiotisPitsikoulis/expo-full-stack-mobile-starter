import AsyncStorage from "@react-native-async-storage/async-storage";
import { Uniwind } from "uniwind";

const THEME_STORAGE_KEY = "ainnb.theme";
const ROOT_BACKGROUND_BY_THEME = {
  light: "#F7F7F8",
  dark: "#0C0C0E",
} as const;

export type ThemePref = "light" | "dark";
type SystemUiModule = typeof import("expo-system-ui");

let systemUiModulePromise: Promise<SystemUiModule | null> | null = null;

async function loadSystemUi(): Promise<SystemUiModule | null> {
  if (!systemUiModulePromise) {
    try {
      systemUiModulePromise = Promise.resolve(require("expo-system-ui") as SystemUiModule);
    } catch {
      systemUiModulePromise = Promise.resolve(null);
    }
  }
  return systemUiModulePromise;
}

void setSystemBackground("dark");

async function setSystemBackground(theme: ThemePref): Promise<void> {
  try {
    const systemUi = await loadSystemUi();
    await systemUi?.setBackgroundColorAsync(ROOT_BACKGROUND_BY_THEME[theme]);
  } catch {
    // Native module availability can lag JS after dependency changes.
  }
}

/** Read the saved theme and apply it. Call once on launch before first paint. */
export async function restorePersistedTheme(): Promise<void> {
  let theme: ThemePref = "dark";
  try {
    const stored = await AsyncStorage.getItem(THEME_STORAGE_KEY);
    if (stored === "light" || stored === "dark") {
      theme = stored;
      Uniwind.setTheme(theme);
    }
  } catch {
    // Ignore read failures and keep the default theme.
  }
  await setSystemBackground(theme);
}

/** Apply a theme and persist it so it survives app restarts. */
export function setPersistedTheme(theme: ThemePref): void {
  Uniwind.setTheme(theme);
  void setSystemBackground(theme);
  void AsyncStorage.setItem(THEME_STORAGE_KEY, theme).catch(() => {});
}
