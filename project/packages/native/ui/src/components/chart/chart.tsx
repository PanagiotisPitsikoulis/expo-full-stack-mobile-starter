import { type ComponentType, forwardRef, type ReactNode } from "react";
import { View, type ViewProps } from "react-native";
import { tv, type VariantProps } from "tailwind-variants";

import { Text } from "../text";

export const chartVariants = tv({
  slots: {
    container: "min-h-48 w-full gap-3 rounded-2xl border border-border bg-background p-4",
    legend: "text-xs text-muted",
    legendContent: "flex-row flex-wrap gap-2",
    root: "w-full",
    tooltip: "rounded-xl border border-border bg-background p-3",
    tooltipContent: "gap-1",
  },
});

export type ChartVariants = VariantProps<typeof chartVariants>;

export type ChartConfig = Record<
  string,
  {
    color?: string;
    icon?: ComponentType;
    label?: ReactNode;
    theme?: Record<string, string>;
  }
>;

export interface ChartContainerProps extends ViewProps {
  children?: ReactNode;
  className?: string;
  config?: ChartConfig;
  initialDimension?: { height: number; width: number };
}

const ChartContainer = forwardRef<View, ChartContainerProps>(
  (
    { children, className, config: _config, initialDimension: _initialDimension, ...props },
    ref,
  ) => {
    const slots = chartVariants();

    return (
      <View ref={ref} className={slots.container({ className })} {...props}>
        {children}
      </View>
    );
  },
);

ChartContainer.displayName = "PitsiUINative.ChartContainer";

export interface ChartLegendContentProps extends ViewProps {
  children?: ReactNode;
  className?: string;
  hideIcon?: boolean;
  nameKey?: string;
  payload?: Array<{ color?: string; dataKey?: string; value?: ReactNode }>;
  verticalAlign?: "bottom" | "top";
}

const ChartLegendContent = forwardRef<View, ChartLegendContentProps>(
  ({ children, className, hideIcon = false, payload, ...props }, ref) => {
    const slots = chartVariants();

    return (
      <View ref={ref} className={slots.legendContent({ className })} {...props}>
        {children ??
          payload?.map((item, index) => (
            <View className="flex-row items-center gap-1.5" key={`${item.dataKey ?? index}`}>
              {!hideIcon ? (
                <View
                  className="h-2 w-2 rounded-[2px]"
                  style={{ backgroundColor: item.color ?? "#8a8a8a" }}
                />
              ) : null}
              <Text className={slots.legend()}>{item.value ?? item.dataKey}</Text>
            </View>
          ))}
      </View>
    );
  },
);

ChartLegendContent.displayName = "PitsiUINative.ChartLegendContent";

export interface ChartTooltipContentProps extends ViewProps {
  children?: ReactNode;
  className?: string;
  hideIndicator?: boolean;
  hideLabel?: boolean;
  indicator?: "dashed" | "dot" | "line";
  label?: ReactNode;
  payload?: Array<{ color?: string; name?: ReactNode; value?: ReactNode }>;
}

const ChartTooltipContent = forwardRef<View, ChartTooltipContentProps>(
  (
    {
      children,
      className,
      hideIndicator = false,
      hideLabel = false,
      indicator: _indicator = "dot",
      label,
      payload,
      ...props
    },
    ref,
  ) => {
    const slots = chartVariants();

    return (
      <View ref={ref} className={slots.tooltipContent({ className })} {...props}>
        {children ?? (
          <>
            {!hideLabel && label ? (
              <Text className="text-sm font-medium text-foreground">{label}</Text>
            ) : null}
            {payload?.map((item, index) => (
              <View className="flex-row items-center justify-between gap-3" key={index}>
                <View className="flex-row items-center gap-2">
                  {!hideIndicator ? (
                    <View
                      className="h-2.5 w-2.5 rounded-[2px]"
                      style={{ backgroundColor: item.color ?? "#8a8a8a" }}
                    />
                  ) : null}
                  <Text className="text-xs text-muted">{item.name}</Text>
                </View>
                <Text className="text-xs font-medium text-foreground">{item.value}</Text>
              </View>
            ))}
          </>
        )}
      </View>
    );
  },
);

ChartTooltipContent.displayName = "PitsiUINative.ChartTooltipContent";

function ChartLegend({ className, ...props }: ViewProps & { className?: string }) {
  const slots = chartVariants();
  return <Text className={slots.legend({ className })} {...props} />;
}

function ChartStyle(_props: ViewProps & { config?: ChartConfig; id?: string }) {
  return null;
}

function ChartTooltip({ className, ...props }: ViewProps & { className?: string }) {
  const slots = chartVariants();
  return <View className={slots.tooltip({ className })} {...props} />;
}

const Chart = Object.assign(
  forwardRef<View, ViewProps & { className?: string }>(({ className, ...props }, ref) => {
    const slots = chartVariants();
    return <View ref={ref} className={slots.root({ className })} {...props} />;
  }),
  {
    Container: ChartContainer,
    Legend: ChartLegend,
    LegendContent: ChartLegendContent,
    Style: ChartStyle,
    Tooltip: ChartTooltip,
    TooltipContent: ChartTooltipContent,
  },
);

export {
  Chart,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
};
