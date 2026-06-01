import { createContext, forwardRef, type ReactNode, useContext, useMemo } from "react";
import { View, type ViewProps } from "react-native";
import Svg, { Circle, type CircleProps, type SvgProps } from "react-native-svg";
import { tv, type VariantProps } from "tailwind-variants";

const progressCircleVariants = tv({
  defaultVariants: {
    color: "accent",
    size: "md",
  },
  slots: {
    base: "items-center justify-center",
    track: "items-center justify-center",
  },
  variants: {
    color: {
      accent: {},
      danger: {},
      default: {},
      success: {},
      warning: {},
    },
    size: {
      lg: {},
      md: {},
      sm: {},
    },
  },
});

export type ProgressCircleVariants = VariantProps<typeof progressCircleVariants>;
type ProgressCircleColor = NonNullable<ProgressCircleVariants["color"]>;
type ProgressCircleSize = NonNullable<ProgressCircleVariants["size"]>;

const STROKE_WIDTH = 4;
const CENTER = 18;
const RADIUS = CENTER - STROKE_WIDTH / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const SIZE_MAP: Record<ProgressCircleSize, number> = {
  lg: 36,
  md: 28,
  sm: 20,
};

const COLOR_MAP: Record<ProgressCircleColor, string> = {
  accent: "#2563eb",
  danger: "#dc2626",
  default: "#111827",
  success: "#16a34a",
  warning: "#d97706",
};

export interface ProgressCircleRenderState {
  color: ProgressCircleColor;
  isIndeterminate: boolean;
  maxValue: number;
  minValue: number;
  percentage: number;
  size: ProgressCircleSize;
  value: number | null | undefined;
}

const ProgressCircleContext = createContext<ProgressCircleRenderState | null>(null);

function progressPercentage(value: number | null | undefined, minValue = 0, maxValue = 100) {
  if (value == null) return 0;
  const range = Math.max(maxValue - minValue, 1);
  return Math.min(Math.max(((value - minValue) / range) * 100, 0), 100);
}

function useProgressCircleState() {
  return (
    useContext(ProgressCircleContext) ?? {
      color: "accent",
      isIndeterminate: false,
      maxValue: 100,
      minValue: 0,
      percentage: 0,
      size: "md",
      value: 0,
    }
  );
}

export interface ProgressCircleRootProps extends Omit<ViewProps, "children"> {
  children?: ReactNode | ((state: ProgressCircleRenderState) => ReactNode);
  className?: string;
  color?: ProgressCircleColor;
  isIndeterminate?: boolean;
  maxValue?: number;
  minValue?: number;
  size?: ProgressCircleSize;
  value?: number | null;
}

const ProgressCircleRoot = forwardRef<View, ProgressCircleRootProps>(
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
      }),
      [color, isIndeterminate, maxValue, minValue, percentage, size, value],
    );
    const slots = progressCircleVariants({ color, size });

    return (
      <ProgressCircleContext.Provider value={state}>
        <View
          accessibilityRole="progressbar"
          accessibilityValue={{
            max: maxValue,
            min: minValue,
            now: isIndeterminate || value == null ? undefined : value,
            text: isIndeterminate || value == null ? undefined : `${Math.round(percentage)}%`,
          }}
          className={slots.base({ className })}
          ref={ref}
          {...props}
        >
          {typeof children === "function" ? children(state) : children}
        </View>
      </ProgressCircleContext.Provider>
    );
  },
);

ProgressCircleRoot.displayName = "PitsiUINative.ProgressCircle";

export interface ProgressCircleTrackProps extends SvgProps {
  children?: ReactNode;
  className?: string;
}

const ProgressCircleTrack = forwardRef<React.ElementRef<typeof Svg>, ProgressCircleTrackProps>(
  ({ children, ...props }, ref) => {
    const state = useProgressCircleState();
    const size = SIZE_MAP[state.size];

    return (
      <Svg
        fill="none"
        height={size}
        ref={ref}
        viewBox={`0 0 ${CENTER * 2} ${CENTER * 2}`}
        width={size}
        {...props}
      >
        {children}
      </Svg>
    );
  },
);

ProgressCircleTrack.displayName = "PitsiUINative.ProgressCircle.Track";

export interface ProgressCircleTrackCircleProps extends CircleProps {}

const ProgressCircleTrackCircle = forwardRef<
  React.ElementRef<typeof Circle>,
  ProgressCircleTrackCircleProps
>((props, ref) => (
  <Circle
    cx={CENTER}
    cy={CENTER}
    r={RADIUS}
    ref={ref}
    stroke="#e5e7eb"
    strokeWidth={STROKE_WIDTH}
    {...props}
  />
));

ProgressCircleTrackCircle.displayName = "PitsiUINative.ProgressCircle.TrackCircle";

export interface ProgressCircleFillCircleProps extends CircleProps {}

const ProgressCircleFillCircle = forwardRef<
  React.ElementRef<typeof Circle>,
  ProgressCircleFillCircleProps
>((props, ref) => {
  const state = useProgressCircleState();
  const strokeDashoffset = state.isIndeterminate
    ? CIRCUMFERENCE * 0.75
    : CIRCUMFERENCE - (state.percentage / 100) * CIRCUMFERENCE;

  return (
    <Circle
      cx={CENTER}
      cy={CENTER}
      r={RADIUS}
      ref={ref}
      stroke={COLOR_MAP[state.color]}
      strokeDasharray={CIRCUMFERENCE}
      strokeDashoffset={strokeDashoffset}
      strokeLinecap="round"
      strokeWidth={STROKE_WIDTH}
      transform={`rotate(-90 ${CENTER} ${CENTER})`}
      {...props}
    />
  );
});

ProgressCircleFillCircle.displayName = "PitsiUINative.ProgressCircle.FillCircle";

export {
  ProgressCircleFillCircle,
  ProgressCircleRoot,
  ProgressCircleTrack,
  ProgressCircleTrackCircle,
  progressCircleVariants,
};
