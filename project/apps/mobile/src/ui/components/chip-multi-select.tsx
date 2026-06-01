import { Text } from "@pitsi-ui/native/text";
import { Pressable, View } from "react-native";
import type { OptionListItem } from "./option-list-picker";

/**
 * Multi-select chip row. Wraps onto multiple lines, centered. Selected
 * chips fill with `foreground`. Pass current ids via `selected` and a
 * toggle callback.
 */
export function ChipMultiSelect({
  onToggle,
  options,
  selected,
}: {
  onToggle: (id: string) => void;
  options: OptionListItem[];
  selected: string[];
}) {
  return (
    <View className="mx-auto w-full max-w-lg flex-row flex-wrap justify-center gap-2 px-4">
      {options.map((option) => {
        const active = selected.includes(option.id);
        return (
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            className={
              active
                ? "h-11 items-center justify-center rounded-full bg-foreground px-5"
                : "h-11 items-center justify-center rounded-full bg-default px-5"
            }
            key={option.id}
            onPress={() => onToggle(option.id)}
            style={{ borderCurve: "continuous" }}
          >
            <Text
              className={
                active
                  ? "text-[14px] font-semibold text-background"
                  : "text-[14px] font-medium text-foreground"
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
