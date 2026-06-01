import {
  createContext,
  Fragment,
  type ReactNode,
  type Ref,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { ScrollView, type ScrollViewProps } from "react-native";
import { tv, type VariantProps } from "tailwind-variants";

export const listboxVariants = tv({
  slots: {
    root: "w-full gap-1 overflow-hidden rounded-2xl border border-border bg-background p-1",
  },
  variants: {
    variant: {
      danger: "",
      default: "",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export type ListBoxVariants = VariantProps<typeof listboxVariants>;
export type ListBoxKey = string | number;
export type ListBoxSelectionMode = "multiple" | "single";

export type ListBoxItemRenderProps = {
  isDisabled: boolean;
  isFocused: boolean;
  isFocusVisible: boolean;
  isHovered: boolean;
  isPressed: boolean;
  isSelected: boolean;
};

export type ListBoxContextValue = {
  disabledKeys?: Iterable<ListBoxKey>;
  isDisabled?: boolean;
  isSelected: (key: ListBoxKey | undefined) => boolean;
  selectKey: (key: ListBoxKey | undefined) => void;
  selectionMode: ListBoxSelectionMode;
  slots: ReturnType<typeof listboxVariants>;
};

export const ListBoxContext = createContext<ListBoxContextValue | undefined>(undefined);

export function useListBoxContext() {
  return useContext(ListBoxContext);
}

type RenderFunction<TValue> = (item: TValue) => ReactNode;

function getItemKey(item: unknown, index: number): ListBoxKey {
  if (item && typeof item === "object") {
    const record = item as { id?: ListBoxKey; key?: ListBoxKey };
    return record.id ?? record.key ?? index;
  }

  return index;
}

function renderItems<TValue>(
  items: Iterable<TValue> | undefined,
  children: ReactNode | RenderFunction<TValue> | undefined,
): ReactNode {
  if (!items) {
    return typeof children === "function" ? null : children;
  }

  if (typeof children !== "function") {
    return children;
  }

  return Array.from(items).map((item, index) => (
    <Fragment key={getItemKey(item, index)}>{children(item)}</Fragment>
  ));
}

function toSelectionSet(keys: Iterable<ListBoxKey> | "all" | undefined) {
  if (!keys || keys === "all") {
    return new Set<ListBoxKey>();
  }

  return new Set(keys);
}

export interface ListBoxRootProps<TValue = object>
  extends Omit<ScrollViewProps, "children" | "horizontal">,
    ListBoxVariants {
  children?: ReactNode | RenderFunction<TValue>;
  className?: string;
  defaultSelectedKeys?: Iterable<ListBoxKey> | "all";
  disabledKeys?: Iterable<ListBoxKey>;
  horizontal?: boolean;
  isDisabled?: boolean;
  items?: Iterable<TValue>;
  onSelectionChange?: (keys: Set<ListBoxKey>) => void;
  orientation?: "horizontal" | "vertical";
  ref?: Ref<ScrollView>;
  selectedKeys?: Set<ListBoxKey>;
  selectionMode?: ListBoxSelectionMode;
}

function ListBoxRoot<TValue = object>({
  children,
  className,
  defaultSelectedKeys,
  disabledKeys,
  horizontal,
  isDisabled,
  items,
  onSelectionChange,
  orientation = "vertical",
  ref,
  selectedKeys,
  selectionMode = "single",
  variant,
  ...props
}: ListBoxRootProps<TValue>) {
  const slots = useMemo(() => listboxVariants({ variant }), [variant]);
  const [internalSelection, setInternalSelection] = useState(() =>
    toSelectionSet(defaultSelectedKeys),
  );
  const currentSelection = selectedKeys ?? internalSelection;
  const disabledSet = useMemo(() => toSelectionSet(disabledKeys), [disabledKeys]);

  const setSelection = useCallback(
    (nextSelection: Set<ListBoxKey>) => {
      if (!selectedKeys) {
        setInternalSelection(nextSelection);
      }
      onSelectionChange?.(nextSelection);
    },
    [selectedKeys, onSelectionChange],
  );

  const contextValue = useMemo<ListBoxContextValue>(
    () => ({
      disabledKeys,
      isDisabled,
      isSelected: (key) => (key === undefined ? false : currentSelection.has(key)),
      selectKey: (key) => {
        if (key === undefined || disabledSet.has(key)) return;

        const nextSelection =
          selectionMode === "single" ? new Set<ListBoxKey>() : new Set(currentSelection);

        if (selectionMode === "multiple" && nextSelection.has(key)) {
          nextSelection.delete(key);
        } else {
          nextSelection.add(key);
        }

        setSelection(nextSelection);
      },
      selectionMode,
      slots,
    }),
    [currentSelection, disabledKeys, disabledSet, isDisabled, selectionMode, slots, setSelection],
  );

  return (
    <ListBoxContext.Provider value={contextValue}>
      <ScrollView
        ref={ref}
        className={slots.root({ className })}
        horizontal={horizontal ?? orientation === "horizontal"}
        {...props}
      >
        {renderItems(items, children)}
      </ScrollView>
    </ListBoxContext.Provider>
  );
}

(ListBoxRoot as React.FC).displayName = "PitsiUINative.ListBoxRoot";

export { ListBoxRoot };
