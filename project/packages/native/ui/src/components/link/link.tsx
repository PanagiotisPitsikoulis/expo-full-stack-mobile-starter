import { createContext, forwardRef, type ReactNode, useContext, useMemo } from "react";
import {
  Linking,
  type Text as NativeText,
  Pressable,
  type PressableProps,
  type TextProps,
} from "react-native";
import { tv, type VariantProps } from "tailwind-variants";

import { ExternalLinkIcon } from "../icons";
import { Text } from "../text";

export const linkVariants = tv({
  slots: {
    base: "flex-row items-center rounded-xl",
    icon: "ml-1 opacity-70",
    text: "text-sm font-medium text-link underline",
  },
});

export type LinkVariants = VariantProps<typeof linkVariants>;

type LinkContextValue = {
  slots: ReturnType<typeof linkVariants>;
};

const LinkContext = createContext<LinkContextValue | null>(null);

export interface LinkRootProps extends Omit<PressableProps, "children">, LinkVariants {
  children?: ReactNode;
  className?: string;
  href?: string;
  isDisabled?: boolean;
}

function openHref(href: string | undefined) {
  if (!href || href.startsWith("#") || href.startsWith("/")) return;
  void Linking.openURL(href);
}

function renderLinkChild(value: ReactNode) {
  if (typeof value === "string" || typeof value === "number") {
    return <Text className={linkVariants().text()}>{value}</Text>;
  }

  return value;
}

const LinkRoot = forwardRef<React.ElementRef<typeof Pressable>, LinkRootProps>(
  ({ children, className, href, isDisabled = false, onPress, ...props }, ref) => {
    const slots = useMemo(() => linkVariants(), []);

    return (
      <LinkContext.Provider value={{ slots }}>
        <Pressable
          accessibilityRole="link"
          accessibilityState={{ disabled: isDisabled }}
          className={slots.base({ className })}
          disabled={isDisabled}
          onPress={(event) => {
            onPress?.(event);
            if (!event.defaultPrevented) openHref(href);
          }}
          ref={ref}
          {...props}
        >
          {renderLinkChild(children)}
        </Pressable>
      </LinkContext.Provider>
    );
  },
);

LinkRoot.displayName = "PitsiUINative.Link";

export interface LinkIconProps extends TextProps {
  children?: ReactNode;
  className?: string;
}

const LinkIcon = forwardRef<NativeText, LinkIconProps>(({ children, className, ...props }, ref) => {
  const context = useContext(LinkContext);

  return (
    <Text className={context?.slots.icon({ className }) ?? className} ref={ref} {...props}>
      {children ?? <ExternalLinkIcon size={10} />}
    </Text>
  );
});

LinkIcon.displayName = "PitsiUINative.Link.Icon";

export { LinkIcon, LinkRoot };
