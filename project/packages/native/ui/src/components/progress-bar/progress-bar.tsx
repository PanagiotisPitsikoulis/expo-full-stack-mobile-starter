import { createContext, forwardRef, type ReactNode, useContext, useMemo } from "react";
import {
  type DimensionValue,
  type Text as NativeText,
  type StyleProp,
  type TextProps,
  View,
  type ViewProps,
  type ViewStyle,
} from "react-native";
import { tv, type VariantProps } from "tailwind-variants";

import { Text } from "../text";

const progressBarVariants = tv({
  defaultVariants: {
    color: "accent",
    size: "md",
  },
  slots: {
    base: "w-full gap-1",
    fill: "h-full rounded-full",
    output: "text-sm font-medium tabular-nums text-muted",
    track: "w-full overflow-hidden rounded-full bg-default",
  },
  variants: {
    color: {
      accent: {
        fill: "bg-accent",
      },
      danger: {
        fill: "bg-danger",
      },
      default: {
        fill: "bg-default-foreground",
      },
      success: {
        fill: "bg-success",
      },
      warning: {
        fill: "bg-warning",
      },
    },
    size: {
      lg: {
        track: "h-3",
      },
      md: {
        track: "h-2",
      },
      sm: {
        track: "h-1.5",
      },
    },
  },
});

export type ProgressBarVariants = VariantProps<typeof progressBarVariants>;
export type ProgressBarColor = NonNullable<ProgressBarVariants["color"]>;
export type ProgressBarSize = NonNullable<ProgressBarVariants["size"]>;

export interface ProgressBarRenderState {
  color: ProgressBarColor;
  isIndeterminate: boolean;
  maxValue: number;
  minValue: number;
  percentage: number;
  size: ProgressBarSize;
  value: number | null | undefined;
  valueText: string;
}

const ProgressBarContext = createContext<ProgressBarRenderState | null>(null);

function progressPercentage(value: number | null | undefined, minValue = 0, maxValue = 100) {
  if (value == null) return 0;
  const range = Math.max(maxValue - minValue, 1);
  return Math.min(Math.max(((value - minValue) / range) * 100, 0), 100);
}

function progressValueText(
  value: number | null | undefined,
  percentage: number,
  isIndeterminate: boolean,
) {
  if (isIndeterminate || value == null) return "";
  return `${Math.round(percentage)}%`;
}

export interface ProgressBarRootProps extends Omit<ViewProps, "children"> {
  children?: ReactNode | ((state: ProgressBarRenderState) => ReactNode);
  className?: string;
  color?: ProgressBarColor;
  isIndeterminate?: boolean;
  maxValue?: number;
  minValue?: number;
  size?: ProgressBarSize;
  value?: number | null;
}

const ProgressBarRoot = forwardRef<View, ProgressBarRootProps>(
  (
    {
      children,
      className,
      color = "accent",
      isIndeterminate = false,
      maxValue = 100,
      minValue = 0,
      size = "md",
      value = 0,
      ...props
    },
    ref,
  ) => {
    const percentage = progressPercentage(value, minValue, maxValue);
    const state = useMemo(
      () => ({
        color,
        isIndeterminate,
        maxValue,
        minValue,
        percentage,
        size,
        value,
        valueText: progressValueText(value, percentage, isIndeterminate),
      }),
      [color, isIndeterminate, maxValue, minValue, percentage, size, value],
    );
    const slots = progressBarVariants({ color, size });

    return (
      <ProgressBarContext.Provider value={state}>
        <View
          accessibilityRole="progressbar"
          accessibilityValue={{
            max: maxValue,
            min: minValue,
            now: isIndeterminate || value == null ? undefined : value,
            text: state.valueText,
          }}
          className={slots.base({ className })}
          ref={ref}
          {...props}
        >
          {typeof children === "function" ? children(state) : children}
        </View>
      </ProgressBarContext.Provider>
    );
  },
);

ProgressBarRoot.displayName = "PitsiUINative.ProgressBar";

function useProgressBarState() {
  return (
    useContext(ProgressBarContext) ?? {
      color: "accent",
      isIndeterminate: false,
      maxValue: 100,
      minValue: 0,
      percentage: 0,
      size: "md",
      value: 0,
      valueText: "0%",
    }
  );
}

export interface ProgressBarTrackProps extends ViewProps {
  children?: ReactNode;
  className?: string;
}

const ProgressBarTrack = forwardRef<View, ProgressBarTrackProps>(
  ({ children, className, ...props }, ref) => {
    const state = useProgressBarState();
    const slots = progressBarVariants({ color: state.color, size: state.size });

    return (
      <View className={slots.track({ className })} ref={ref} {...props}>
        {children}
      </View>
    );
  },
);

ProgressBarTrack.displayName = "PitsiUINative.ProgressBar.Track";

export interface ProgressBarFillProps extends ViewProps {
  children?: ReactNode;
  className?: string;
}

const ProgressBarFill = forwardRef<View, ProgressBarFillProps>(
  ({ className, style, ...props }, ref) => {
    const state = useProgressBarState();
    const slots = progressBarVariants({ color: state.color, size: state.size });
    const width = (state.isIndeterminate ? "40%" : `${state.percentage}%`) as DimensionValue;
    const fillWidthStyle: ViewStyle = { width };
    const fillStyle: StyleProp<ViewStyle> = [fillWidthStyle, style];

    return <View className={slots.fill({ className })} ref={ref} style={fillStyle} {...props} />;
  },
);

ProgressBarFill.displayName = "PitsiUINative.ProgressBar.Fill";

export interface ProgressBarOutputProps extends TextProps {
  children?: ReactNode;
  className?: string;
}

const ProgressBarOutput = forwardRef<NativeText, ProgressBarOutputProps>(
  ({ children, className, ...props }, ref) => {
    const state = useProgressBarState();
    const slots = progressBarVariants({ color: state.color, size: state.size });

    return (
      <Text className={slots.output({ className })} ref={ref} {...props}>
        {children ?? state.valueText}
      </Text>
    );
  },
);

ProgressBarOutput.displayName = "PitsiUINative.ProgressBar.Output";

export {
  ProgressBarFill,
  ProgressBarOutput,
  ProgressBarRoot,
  ProgressBarTrack,
  progressBarVariants,
};
