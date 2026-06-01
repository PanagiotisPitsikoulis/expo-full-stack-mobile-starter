import { forwardRef, type ReactNode } from "react";
import { View, type ViewProps, type ViewStyle } from "react-native";

export interface AspectRatioRootProps extends ViewProps {
  children?: ReactNode;
  className?: string;
  ratio?: number | string;
}

function resolveAspectRatio(ratio: number | string | undefined) {
  if (typeof ratio === "number" && Number.isFinite(ratio) && ratio > 0) {
    return ratio;
  }

  if (typeof ratio === "string") {
    const parts = ratio.split("/");
    const width = Number(parts[0]?.trim());
    const height = Number(parts[1]?.trim());

    if (Number.isFinite(width) && Number.isFinite(height) && width > 0 && height > 0) {
      return width / height;
    }

    const parsed = Number(ratio);

    if (Number.isFinite(parsed) && parsed > 0) {
      return parsed;
    }
  }

  return 1;
}

const AspectRatioRoot = forwardRef<View, AspectRatioRootProps>(
  ({ children, className, ratio, style, ...props }, ref) => {
    const aspectRatio = resolveAspectRatio(ratio);
    const ratioStyle: ViewStyle = { aspectRatio };

    return (
      <View className={className} ref={ref} style={[ratioStyle, style]} {...props}>
        {children}
      </View>
    );
  },
);

AspectRatioRoot.displayName = "PitsiUINative.AspectRatio";

export { AspectRatioRoot };
