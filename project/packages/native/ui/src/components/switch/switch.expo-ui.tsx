import { Host, Toggle } from "@expo/ui/swift-ui";
import { labelsHidden, tint } from "@expo/ui/swift-ui/modifiers";
import type { SwitchProps } from "./switch";

export function IosToggleSwitch({
  isSelected,
  onSelectedChange,
  isDisabled,
  tint: tintColor,
}: Pick<SwitchProps, "isSelected" | "onSelectedChange" | "isDisabled" | "tint">) {
  const modifiers = tintColor ? [tint(tintColor), labelsHidden()] : [labelsHidden()];
  return (
    <Host matchContents>
      <Toggle
        isOn={!!isSelected}
        onIsOnChange={(next) => {
          if (isDisabled) return;
          onSelectedChange?.(next);
        }}
        label=""
        modifiers={modifiers}
      />
    </Host>
  );
}
