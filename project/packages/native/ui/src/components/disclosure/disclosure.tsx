import {
  createContext,
  forwardRef,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { Pressable, type PressableProps, View, type ViewProps } from "react-native";
import { tv, type VariantProps } from "tailwind-variants";
import { DisclosureGroupContext, type DisclosureKey } from "../disclosure-group";
import { IconChevronDown } from "../icons";
import { Text } from "../text";

export const disclosureVariants = tv({
  slots: {
    root: "relative",
    heading: "flex-row",
    trigger: "flex-row items-center gap-2",
    content: "overflow-hidden",
    body: "p-2",
    indicator: "ml-auto",
  },
});

export type DisclosureVariants = VariantProps<typeof disclosureVariants>;

type DisclosureContextValue = {
  isDisabled: boolean;
  isExpanded: boolean;
  slots: ReturnType<typeof disclosureVariants>;
  toggle: () => void;
};

const DisclosureContext = createContext<DisclosureContextValue | undefined>(undefined);

function useDisclosureContext() {
  const context = useContext(DisclosureContext);

  if (!context) {
    throw new Error("Disclosure compound components must be rendered inside Disclosure.Root.");
  }

  return context;
}

export interface DisclosureRootProps
  extends Omit<ViewProps, "children" | "id">,
    DisclosureVariants {
  children?: ReactNode | ((props: { isExpanded: boolean; isDisabled: boolean }) => ReactNode);
  defaultExpanded?: boolean;
  id?: DisclosureKey;
  isDisabled?: boolean;
  isExpanded?: boolean;
  onExpandedChange?: (isExpanded: boolean) => void;
}

const DisclosureRoot = forwardRef<View, DisclosureRootProps>(
  (
    {
      children,
      className,
      defaultExpanded = false,
      id,
      isDisabled = false,
      isExpanded,
      onExpandedChange,
      ...props
    },
    ref,
  ) => {
    const group = useContext(DisclosureGroupContext);
    const [internalExpanded, setInternalExpanded] = useState(defaultExpanded);
    const slots = useMemo(() => disclosureVariants(), []);
    const groupExpanded = id !== undefined ? group?.expandedKeys.has(id) : undefined;
    const expanded = isExpanded ?? groupExpanded ?? internalExpanded;

    const setExpanded = useCallback(
      (nextExpanded: boolean) => {
        if (isExpanded === undefined && groupExpanded === undefined) {
          setInternalExpanded(nextExpanded);
        }
        if (id !== undefined && group) {
          group.setExpanded(id, nextExpanded);
        }
        onExpandedChange?.(nextExpanded);
      },
      [isExpanded, groupExpanded, id, group, onExpandedChange],
    );

    const contextValue = useMemo<DisclosureContextValue>(
      () => ({
        isDisabled,
        isExpanded: expanded,
        slots,
        toggle: () => {
          if (!isDisabled) setExpanded(!expanded);
        },
      }),
      [expanded, isDisabled, slots, setExpanded],
    );

    const renderProps = {
      isDisabled,
      isExpanded: expanded,
    };

    return (
      <DisclosureContext.Provider value={contextValue}>
        <View ref={ref} className={slots.root({ className })} {...props}>
          {typeof children === "function" ? children(renderProps) : children}
        </View>
      </DisclosureContext.Provider>
    );
  },
);

DisclosureRoot.displayName = "PitsiUINative.DisclosureRoot";

export interface DisclosureHeadingProps extends ViewProps {
  children?: ReactNode;
  className?: string;
}

const DisclosureHeading = forwardRef<View, DisclosureHeadingProps>(
  ({ children, className, ...props }, ref) => {
    const { slots } = useDisclosureContext();

    return (
      <View ref={ref} className={slots.heading({ className })} {...props}>
        {children}
      </View>
    );
  },
);

DisclosureHeading.displayName = "PitsiUINative.DisclosureHeading";

export interface DisclosureTriggerProps extends Omit<PressableProps, "children" | "disabled"> {
  children?: ReactNode | ((props: { isExpanded: boolean; isDisabled: boolean }) => ReactNode);
  className?: string;
  isDisabled?: boolean;
}

const DisclosureTrigger = forwardRef<View, DisclosureTriggerProps>(
  ({ children, className, isDisabled, onPress, ...props }, ref) => {
    const disclosure = useDisclosureContext();
    const disabled = isDisabled ?? disclosure.isDisabled;

    return (
      <Pressable
        ref={ref}
        accessibilityRole="button"
        accessibilityState={{ disabled, expanded: disclosure.isExpanded }}
        className={disclosure.slots.trigger({ className })}
        disabled={disabled}
        onPress={(event) => {
          disclosure.toggle();
          onPress?.(event);
        }}
        {...props}
      >
        {typeof children === "function" ? (
          children({ isDisabled: disabled, isExpanded: disclosure.isExpanded })
        ) : typeof children === "string" || typeof children === "number" ? (
          <Text className="text-sm font-medium text-foreground">{children}</Text>
        ) : (
          children
        )}
      </Pressable>
    );
  },
);

DisclosureTrigger.displayName = "PitsiUINative.DisclosureTrigger";

export interface DisclosureContentProps extends ViewProps {
  children?: ReactNode;
  className?: string;
}

const DisclosureContent = forwardRef<View, DisclosureContentProps>(
  ({ children, className, ...props }, ref) => {
    const { isExpanded, slots } = useDisclosureContext();

    if (!isExpanded) return null;

    return (
      <View ref={ref} className={slots.content({ className })} {...props}>
        {children}
      </View>
    );
  },
);

DisclosureContent.displayName = "PitsiUINative.DisclosureContent";

export interface DisclosureBodyContentProps extends ViewProps {
  children?: ReactNode;
  className?: string;
}

const DisclosureBody = forwardRef<View, DisclosureBodyContentProps>(
  ({ children, className, ...props }, ref) => {
    const { slots } = useDisclosureContext();

    return (
      <View ref={ref} className={slots.body({ className })} {...props}>
        {children}
      </View>
    );
  },
);

DisclosureBody.displayName = "PitsiUINative.DisclosureBody";

export interface DisclosureIndicatorProps extends ViewProps {
  children?: ReactNode;
  className?: string;
}

const DisclosureIndicator = forwardRef<View, DisclosureIndicatorProps>(
  ({ children, className, ...props }, ref) => {
    const { isExpanded, slots } = useDisclosureContext();

    return (
      <View
        ref={ref}
        className={slots.indicator({
          className: `${isExpanded ? "rotate-180" : ""} ${className ?? ""}`,
        })}
        {...props}
      >
        {children ?? <IconChevronDown />}
      </View>
    );
  },
);

DisclosureIndicator.displayName = "PitsiUINative.DisclosureIndicator";

export {
  DisclosureBody,
  DisclosureContent,
  DisclosureHeading,
  DisclosureIndicator,
  DisclosureRoot,
  DisclosureTrigger,
};
