import { Text } from "@pitsi-ui/native";
import {
  Collection,
  I18nProvider,
  ListBoxLoadMoreItem,
  RouterProvider,
  useLocale,
} from "@pitsi-ui/native/rac";
import { View } from "react-native";

function LocaleSummary() {
  const locale = useLocale();

  return (
    <Text className="text-xs text-muted">
      Locale: {locale.locale}, direction: {locale.direction}
    </Text>
  );
}

export function Basic() {
  return (
    <I18nProvider>
      <RouterProvider>
        <View className="w-full max-w-sm gap-3">
          <Collection className="max-h-48 rounded-2xl border border-border bg-background">
            {["Dashboard", "Reports", "Settings"].map((item) => (
              <Text className="border-border border-b px-4 py-3 text-sm text-foreground" key={item}>
                {item}
              </Text>
            ))}
          </Collection>
          <ListBoxLoadMoreItem />
          <LocaleSummary />
        </View>
      </RouterProvider>
    </I18nProvider>
  );
}
