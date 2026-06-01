import { createContext, forwardRef, type ReactNode, useContext, useMemo } from "react";
import { type Text as NativeText, type TextProps, View, type ViewProps } from "react-native";
import { tv, type VariantProps } from "tailwind-variants";

import { Text } from "../text";

export const fieldsetVariants = tv({
  slots: {
    actions: "flex-row items-center gap-2 pt-1",
    base: "flex-1 flex-col gap-6",
    fieldGroup: "w-full gap-4",
    legend: "text-base font-medium text-foreground",
  },
});

export type FieldsetVariants = VariantProps<typeof fieldsetVariants>;

interface FieldsetContextValue {
  slots: ReturnType<typeof fieldsetVariants>;
}

const FieldsetContext = createContext<FieldsetContextValue | null>(null);

export interface FieldsetRootProps extends ViewProps {
  children?: ReactNode;
  className?: string;
}

const FieldsetRoot = forwardRef<View, FieldsetRootProps>(
  ({ children, className, ...props }, ref) => {
    const slots = useMemo(() => fieldsetVariants({}), []);

    return (
      <FieldsetContext.Provider value={{ slots }}>
        <View className={slots.base({ className })} ref={ref} {...props}>
          {children}
        </View>
      </FieldsetContext.Provider>
    );
  },
);

FieldsetRoot.displayName = "PitsiUINative.Fieldset";

export interface FieldsetLegendProps extends TextProps {
  children?: ReactNode;
  className?: string;
}

const FieldsetLegend = forwardRef<NativeText, FieldsetLegendProps>(
  ({ children, className, ...props }, ref) => {
    const context = useContext(FieldsetContext);

    return (
      <Text className={context?.slots.legend({ className }) ?? className} ref={ref} {...props}>
        {children}
      </Text>
    );
  },
);

FieldsetLegend.displayName = "PitsiUINative.Fieldset.Legend";

export interface FieldGroupProps extends ViewProps {
  children?: ReactNode;
  className?: string;
}

const FieldGroup = forwardRef<View, FieldGroupProps>(({ children, className, ...props }, ref) => {
  const context = useContext(FieldsetContext);

  return (
    <View className={context?.slots.fieldGroup({ className }) ?? className} ref={ref} {...props}>
      {children}
    </View>
  );
});

FieldGroup.displayName = "PitsiUINative.Fieldset.Group";

export interface FieldsetActionsProps extends ViewProps {
  children?: ReactNode;
  className?: string;
}

const FieldsetActions = forwardRef<View, FieldsetActionsProps>(
  ({ children, className, ...props }, ref) => {
    const context = useContext(FieldsetContext);

    return (
      <View className={context?.slots.actions({ className }) ?? className} ref={ref} {...props}>
        {children}
      </View>
    );
  },
);

FieldsetActions.displayName = "PitsiUINative.Fieldset.Actions";

export { FieldGroup, FieldsetActions, FieldsetLegend, FieldsetRoot };
