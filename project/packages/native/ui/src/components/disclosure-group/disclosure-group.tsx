import { createContext, forwardRef, type ReactNode, useCallback, useMemo, useState } from "react";
import { View, type ViewProps } from "react-native";
import { tv, type VariantProps } from "tailwind-variants";

export type DisclosureKey = string | number;

export const disclosureGroupVariants = tv({
  base: "w-full",
});

export type DisclosureGroupVariants = VariantProps<typeof disclosureGroupVariants>;

export type DisclosureGroupContextValue = {
  expandedKeys: Set<DisclosureKey>;
  setExpanded: (key: DisclosureKey, isExpanded: boolean) => void;
};

export const DisclosureGroupContext = createContext<DisclosureGroupContextValue | undefined>(
  undefined,
);

export interface DisclosureGroupRootProps
  extends Omit<ViewProps, "children" | "onChange">,
    DisclosureGroupVariants {
  allowsMultipleExpanded?: boolean;
  children?: ReactNode | ((props: { expandedKeys: Set<DisclosureKey> }) => ReactNode);
  defaultExpandedKeys?: Iterable<DisclosureKey>;
  expandedKeys?: Set<DisclosureKey>;
  onExpandedChange?: (keys: Set<DisclosureKey>) => void;
}

const DisclosureGroupRoot = forwardRef<View, DisclosureGroupRootProps>(
  (
    {
      allowsMultipleExpanded = true,
      children,
      className,
      defaultExpandedKeys,
      expandedKeys,
      onExpandedChange,
      ...props
    },
    ref,
  ) => {
    const [internalKeys, setInternalKeys] = useState(
      () => new Set<DisclosureKey>(defaultExpandedKeys),
    );
    const selectedKeys = expandedKeys ?? internalKeys;
    const rootClassName = disclosureGroupVariants({ className });

    const setExpanded = useCallback(
      (key: DisclosureKey, isExpanded: boolean) => {
        const nextKeys = new Set(allowsMultipleExpanded ? selectedKeys : []);

        if (isExpanded) {
          nextKeys.add(key);
        } else {
          nextKeys.delete(key);
        }

        if (!expandedKeys) {
          setInternalKeys(nextKeys);
        }
        onExpandedChange?.(nextKeys);
      },
      [allowsMultipleExpanded, selectedKeys, expandedKeys, onExpandedChange],
    );

    const contextValue = useMemo<DisclosureGroupContextValue>(
      () => ({
        expandedKeys: selectedKeys,
        setExpanded,
      }),
      [selectedKeys, setExpanded],
    );

    return (
      <DisclosureGroupContext.Provider value={contextValue}>
        <View ref={ref} className={rootClassName} {...props}>
          {typeof children === "function" ? children({ expandedKeys: selectedKeys }) : children}
        </View>
      </DisclosureGroupContext.Provider>
    );
  },
);

DisclosureGroupRoot.displayName = "PitsiUINative.DisclosureGroupRoot";

export { DisclosureGroupRoot };
