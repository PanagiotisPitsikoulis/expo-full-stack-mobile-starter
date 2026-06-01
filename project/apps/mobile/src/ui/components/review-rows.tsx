import { Text } from "@pitsi-ui/native/text";
import { View } from "react-native";

/**
 * Plain "Summary" / "Review" row list: label on the left, value on the
 * right, in a stack of rounded rows. Used as a confirmation step or a
 * read-only summary panel.
 */
export function ReviewRows({ rows }: { rows: { label: string; value: string }[] }) {
  return (
    <View className="mx-auto w-full max-w-md gap-2 px-4">
      {rows.map((row) => (
        <View
          className="flex-row items-center justify-between rounded-2xl bg-default px-5 py-4"
          key={row.label}
          style={{ borderCurve: "continuous" }}
        >
          <Text className="text-[14px] font-medium text-muted">{row.label}</Text>
          <Text className="text-[15px] font-semibold text-foreground" numberOfLines={1}>
            {row.value}
          </Text>
        </View>
      ))}
    </View>
  );
}
