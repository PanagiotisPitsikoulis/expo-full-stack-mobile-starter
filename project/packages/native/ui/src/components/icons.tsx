import { forwardRef } from "react";
import { Text as NativeText, type TextProps, type TextStyle } from "react-native";

export interface IconProps extends TextProps {
  color?: string;
  height?: number;
  size?: number;
  width?: number;
}

function createTextIcon(displayName: string, glyph: string) {
  const Icon = forwardRef<NativeText, IconProps>(
    ({ color, height, size, style, width, ...props }, ref) => {
      const resolvedSize = size ?? height ?? width ?? 16;
      const iconStyle: TextStyle = {
        color: color ?? "currentColor",
        fontSize: resolvedSize,
        lineHeight: resolvedSize,
        textAlign: "center",
      };

      return (
        <NativeText
          accessibilityLabel={displayName}
          ref={ref}
          style={[iconStyle, style]}
          {...props}
        >
          {glyph}
        </NativeText>
      );
    },
  );

  Icon.displayName = `PitsiUINative.${displayName}`;

  return Icon;
}

export const IconChevronDown = createTextIcon("IconChevronDown", "v");
export const IconChevronLeft = createTextIcon("IconChevronLeft", "<");
export const IconChevronRight = createTextIcon("IconChevronRight", ">");
export const ExternalLinkIcon = createTextIcon("ExternalLinkIcon", "^");
export const CircleDashedIcon = createTextIcon("CircleDashedIcon", "o");
export const CloseIcon = createTextIcon("CloseIcon", "x");
export const InfoIcon = createTextIcon("InfoIcon", "i");
export const WarningIcon = createTextIcon("WarningIcon", "!");
export const DangerIcon = createTextIcon("DangerIcon", "!");
export const SuccessIcon = createTextIcon("SuccessIcon", "ok");
export const IconMinus = createTextIcon("IconMinus", "-");
export const IconPlus = createTextIcon("IconPlus", "+");
export const IconSearch = createTextIcon("IconSearch", "?");
export const IconCalendar = createTextIcon("IconCalendar", "#");
