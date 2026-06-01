import {
  Children,
  cloneElement,
  createContext,
  forwardRef,
  isValidElement,
  type ReactElement,
  type ReactNode,
  useContext,
  useMemo,
} from "react";
import { View, type ViewProps } from "react-native";
import { tv, type VariantProps } from "tailwind-variants";

import type { ButtonRootProps } from "../button";

const buttonGroupVariants = tv({
  defaultVariants: {
    fullWidth: false,
    orientation: "horizontal",
  },
  slots: {
    base: "items-center justify-center gap-0 overflow-hidden rounded-3xl",
    separator: "bg-current opacity-15",
  },
  variants: {
    fullWidth: {
      false: {},
      true: {
        base: "w-full",
      },
    },
    orientation: {
      horizontal: {
        base: "flex-row",
        separator: "h-1/2 w-hairline",
      },
      vertical: {
        base: "flex-col",
        separator: "h-hairline w-1/2",
      },
    },
  },
});

export type ButtonGroupVariants = VariantProps<typeof buttonGroupVariants>;

type ButtonGroupContextValue = {
  fullWidth?: boolean;
  isDisabled?: boolean;
  orientation: "horizontal" | "vertical";
  size?: ButtonRootProps["size"];
  slots: ReturnType<typeof buttonGroupVariants>;
  variant?: ButtonRootProps["variant"];
};

export const ButtonGroupContext = createContext<ButtonGroupContextValue | null>(null);
export const BUTTON_GROUP_CHILD = "__button_group_child";

export interface ButtonGroupRootProps
  extends Omit<ViewProps, "children">,
    Pick<ButtonRootProps, "size" | "variant">,
    ButtonGroupVariants {
  children?: ReactNode;
  className?: string;
  isDisabled?: boolean;
  orientation?: "horizontal" | "vertical";
}

const ButtonGroupRoot = forwardRef<View, ButtonGroupRootProps>(
  (
    {
      children,
      className,
      fullWidth,
      isDisabled,
      orientation = "horizontal",
      size,
      variant,
      ...props
    },
    ref,
  ) => {
    const slots = useMemo(
      () => buttonGroupVariants({ fullWidth, orientation }),
      [fullWidth, orientation],
    );
    const context = useMemo(
      () => ({ fullWidth, isDisabled, orientation, size, slots, variant }),
      [fullWidth, isDisabled, orientation, size, slots, variant],
    );
    const wrappedChildren = Children.map(children, (child) => {
      if (!isValidElement(child)) return child;

      return cloneElement(child as ReactElement<Record<string, unknown>>, {
        [BUTTON_GROUP_CHILD]: true,
      });
    });

    return (
      <ButtonGroupContext.Provider value={context}>
        <View className={slots.base({ className })} ref={ref} {...props}>
          {wrappedChildren}
        </View>
      </ButtonGroupContext.Provider>
    );
  },
);

ButtonGroupRoot.displayName = "PitsiUINative.ButtonGroup";

export interface ButtonGroupSeparatorProps extends ViewProps {
  [BUTTON_GROUP_CHILD]?: boolean;
  className?: string;
}

const ButtonGroupSeparator = forwardRef<View, ButtonGroupSeparatorProps>(
  ({ className, ...props }, ref) => {
    const context = useContext(ButtonGroupContext);
    const slots = context?.slots ?? buttonGroupVariants();

    return (
      <View
        accessibilityElementsHidden
        className={slots.separator({ className })}
        ref={ref}
        {...props}
      />
    );
  },
);

ButtonGroupSeparator.displayName = "PitsiUINative.ButtonGroup.Separator";

export { ButtonGroupRoot, ButtonGroupSeparator, buttonGroupVariants };
