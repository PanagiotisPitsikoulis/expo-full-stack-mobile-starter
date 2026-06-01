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
  useState,
} from "react";
import { View, type ViewProps } from "react-native";
import { tv, type VariantProps } from "tailwind-variants";

import { ToggleButton, type ToggleButtonRootProps } from "../toggle-button";

export type ToggleButtonKey = string | number;

export const toggleButtonGroupVariants = tv({
  slots: {
    base: "flex-row items-center justify-center",
    separator: "bg-foreground/15",
  },
  variants: {
    fullWidth: {
      false: {},
      true: {
        base: "w-full",
      },
    },
    isDetached: {
      false: {
        base: "gap-0",
      },
      true: {
        base: "gap-1",
      },
    },
    orientation: {
      horizontal: {
        base: "flex-row",
        separator: "mx-0.5 h-6 w-px",
      },
      vertical: {
        base: "flex-col",
        separator: "my-0.5 h-px w-8",
      },
    },
  },
  defaultVariants: {
    fullWidth: false,
    isDetached: false,
    orientation: "horizontal",
  },
});

export type ToggleButtonGroupVariants = VariantProps<typeof toggleButtonGroupVariants>;

export type ToggleButtonGroupContextValue = {
  isDisabled?: boolean;
  size?: ToggleButtonRootProps["size"];
  slots: ReturnType<typeof toggleButtonGroupVariants>;
};

export const ToggleButtonGroupContext = createContext<ToggleButtonGroupContextValue | undefined>(
  undefined,
);

export const TOGGLE_BUTTON_GROUP_CHILD = "__toggle_button_group_child";

type SelectionMode = "multiple" | "single";

export interface ToggleButtonGroupRootProps
  extends Omit<ViewProps, "children" | "onChange">,
    ToggleButtonGroupVariants {
  children?: ReactNode;
  defaultSelectedKeys?: Iterable<ToggleButtonKey>;
  isDisabled?: boolean;
  isDetached?: boolean;
  onSelectionChange?: (keys: Set<ToggleButtonKey>) => void;
  selectedKeys?: Set<ToggleButtonKey>;
  selectionMode?: SelectionMode;
  size?: ToggleButtonRootProps["size"];
}

type ToggleButtonElementProps = ToggleButtonRootProps & {
  id?: ToggleButtonKey;
  value?: ToggleButtonKey;
};

function wireToggleChildren(
  children: ReactNode,
  selectedKeys: Set<ToggleButtonKey>,
  setSelectedKeys: (keys: Set<ToggleButtonKey>) => void,
  options: {
    isDisabled?: boolean;
    selectionMode: SelectionMode;
    size?: ToggleButtonRootProps["size"];
  },
): ReactNode {
  return Children.map(children, (child) => {
    if (!isValidElement(child)) {
      return child;
    }

    if (child.type !== ToggleButton) {
      return child;
    }

    const toggle = child as ReactElement<ToggleButtonElementProps>;
    const key = toggle.props.id ?? toggle.props.value;

    if (key === undefined) {
      return child;
    }

    const isSelected = selectedKeys.has(key);

    return cloneElement(toggle, {
      isDisabled: toggle.props.isDisabled ?? options.isDisabled,
      isSelected,
      onChange: (nextSelected: boolean) => {
        const nextKeys = new Set(
          options.selectionMode === "single" && nextSelected ? [] : selectedKeys,
        );

        if (nextSelected) {
          nextKeys.add(key);
        } else {
          nextKeys.delete(key);
        }

        setSelectedKeys(nextKeys);
        toggle.props.onChange?.(nextSelected);
      },
      size: toggle.props.size ?? options.size,
    });
  });
}

const ToggleButtonGroupRoot = forwardRef<View, ToggleButtonGroupRootProps>(
  (
    {
      children,
      className,
      defaultSelectedKeys,
      fullWidth,
      isDetached = false,
      isDisabled,
      onSelectionChange,
      orientation = "horizontal",
      selectedKeys,
      selectionMode = "multiple",
      size,
      ...props
    },
    ref,
  ) => {
    const [internalKeys, setInternalKeys] = useState(
      () => new Set<ToggleButtonKey>(defaultSelectedKeys),
    );
    const currentKeys = selectedKeys ?? internalKeys;
    const slots = useMemo(
      () => toggleButtonGroupVariants({ fullWidth, isDetached, orientation }),
      [fullWidth, isDetached, orientation],
    );

    const setKeys = (nextKeys: Set<ToggleButtonKey>) => {
      if (!selectedKeys) {
        setInternalKeys(nextKeys);
      }
      onSelectionChange?.(nextKeys);
    };

    const contextValue = useMemo<ToggleButtonGroupContextValue>(
      () => ({
        isDisabled,
        size,
        slots,
      }),
      [isDisabled, size, slots],
    );

    return (
      <ToggleButtonGroupContext.Provider value={contextValue}>
        <View ref={ref} className={slots.base({ className })} {...props}>
          {wireToggleChildren(children, currentKeys, setKeys, {
            isDisabled,
            selectionMode,
            size,
          })}
        </View>
      </ToggleButtonGroupContext.Provider>
    );
  },
);

ToggleButtonGroupRoot.displayName = "PitsiUINative.ToggleButtonGroupRoot";

export interface ToggleButtonGroupSeparatorProps extends ViewProps {
  className?: string;
}

const ToggleButtonGroupSeparator = forwardRef<View, ToggleButtonGroupSeparatorProps>(
  ({ className, ...props }, ref) => {
    const context = useContext(ToggleButtonGroupContext);

    return (
      <View ref={ref} className={context?.slots.separator({ className }) ?? className} {...props} />
    );
  },
);

ToggleButtonGroupSeparator.displayName = "PitsiUINative.ToggleButtonGroupSeparator";

export { ToggleButtonGroupRoot, ToggleButtonGroupSeparator };
