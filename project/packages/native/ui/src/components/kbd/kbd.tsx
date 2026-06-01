import { createContext, forwardRef, type ReactNode, useContext, useMemo } from "react";
import { type Text as NativeText, type TextProps, View, type ViewProps } from "react-native";
import { tv, type VariantProps } from "tailwind-variants";

import { Text } from "../text";
import { type KbdKey, kbdKeysLabelMap, kbdKeysMap } from "./kbd.constants";

export const kbdVariants = tv({
  slots: {
    abbr: "text-sm font-medium text-muted",
    base: "h-6 flex-row items-center gap-0.5 rounded-lg bg-default px-2",
    content: "text-sm font-medium text-muted",
  },
  variants: {
    variant: {
      default: {},
      light: {
        base: "bg-transparent",
      },
    },
  },
});

export type KbdVariants = VariantProps<typeof kbdVariants>;

type KbdContextValue = {
  slots: ReturnType<typeof kbdVariants>;
};

const KbdContext = createContext<KbdContextValue | null>(null);

export interface KbdRootProps extends ViewProps {
  children: ReactNode;
  className?: string;
  variant?: KbdVariants["variant"];
}

const KbdRoot = forwardRef<View, KbdRootProps>(
  ({ children, className, variant = "default", ...props }, ref) => {
    const slots = useMemo(() => kbdVariants({ variant }), [variant]);

    return (
      <KbdContext.Provider value={{ slots }}>
        <View
          accessibilityRole="keyboardkey"
          className={slots.base({ className })}
          ref={ref}
          {...props}
        >
          {children}
        </View>
      </KbdContext.Provider>
    );
  },
);

KbdRoot.displayName = "PitsiUINative.Kbd";

export interface KbdAbbrProps extends TextProps {
  className?: string;
  keyValue: KbdKey;
}

const KbdAbbr = forwardRef<NativeText, KbdAbbrProps>(({ className, keyValue, ...props }, ref) => {
  const context = useContext(KbdContext);

  return (
    <Text
      accessibilityLabel={kbdKeysLabelMap[keyValue]}
      className={context?.slots.abbr({ className }) ?? className}
      ref={ref}
      {...props}
    >
      {kbdKeysMap[keyValue]}
    </Text>
  );
});

KbdAbbr.displayName = "PitsiUINative.Kbd.Abbr";

export interface KbdContentProps extends TextProps {
  children: ReactNode;
  className?: string;
}

const KbdContent = forwardRef<NativeText, KbdContentProps>(
  ({ children, className, ...props }, ref) => {
    const context = useContext(KbdContext);

    return (
      <Text className={context?.slots.content({ className }) ?? className} ref={ref} {...props}>
        {children}
      </Text>
    );
  },
);

KbdContent.displayName = "PitsiUINative.Kbd.Content";

export { KbdAbbr, KbdContent, KbdRoot };
