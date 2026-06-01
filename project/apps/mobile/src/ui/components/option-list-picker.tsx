import { Text } from "@pitsi-ui/native/text";
import { Pressable, View } from "react-native";

export type OptionListItem = {
  description?: string;
  id: string;
  meta?: string;
  title: string;
};

/**
 * Single-select option list. Stacked tall pills, current selection
 * fills with `foreground`. Pass `selected: null` to highlight the first
 * option as the preview.
 */
export function OptionListPicker({
  onSelect,
  options,
  selected,
}: {
  onSelect: (id: string) => void;
  options: OptionListItem[];
  selected: string | null;
}) {
  const previewId = selected ?? options[0]?.id ?? null;

  return (
    <View className="mx-auto w-full max-w-lg gap-2">
      {options.map((option) => {
        const active = option.id === previewId;
        return (
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            className={
              active
                ? "h-14 items-center justify-center rounded-2xl bg-foreground px-8"
                : "h-14 items-center justify-center rounded-2xl bg-default px-8"
            }
            key={option.id}
            onPress={() => onSelect(option.id)}
            style={{ borderCurve: "continuous" }}
          >
            <Text
              className={
                active
                  ? "text-[16px] font-semibold text-background"
                  : "text-[16px] font-medium text-foreground"
              }
            >
              {option.title}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
