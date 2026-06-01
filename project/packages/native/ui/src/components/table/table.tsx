import {
  Children,
  createContext,
  Fragment,
  forwardRef,
  type ReactNode,
  useContext,
  useMemo,
} from "react";
import {
  Pressable,
  type PressableProps,
  ScrollView,
  type ScrollViewProps,
  View,
  type ViewProps,
} from "react-native";
import { tv, type VariantProps } from "tailwind-variants";

import { Text } from "../text";

export const tableVariants = tv({
  slots: {
    body: "min-w-full",
    cell: "min-w-32 flex-1 justify-center border-separator-tertiary/40 border-b bg-surface px-4 py-3",
    cellText: "text-sm text-foreground",
    column:
      "min-w-32 flex-1 flex-row items-center justify-between gap-2 border-separator-tertiary/40 border-b px-4 py-2.5",
    columnResizer: "w-px self-stretch bg-separator",
    columnText: "text-xs font-medium text-muted",
    content: "min-w-full overflow-hidden rounded-2xl",
    footer: "min-w-full flex-row items-center px-4 py-2.5",
    header: "min-w-full bg-surface-secondary",
    loadMore: "min-h-11 items-center justify-center px-4 py-3",
    loadMoreContent: "items-center justify-center gap-2",
    resizableContainer: "w-full",
    root: "relative w-full overflow-hidden rounded-2xl bg-surface-secondary p-1",
    row: "min-w-full flex-row border-separator-tertiary/40 border-b last:border-b-0",
    scrollContainer: "w-full",
  },
  variants: {
    variant: {
      primary: {},
      secondary: {
        cell: "bg-transparent",
        column: "rounded-2xl bg-surface-secondary",
        content: "rounded-none",
        header: "bg-transparent",
        root: "bg-transparent p-0",
        row: "border-separator-tertiary/50",
      },
    },
  },
  defaultVariants: {
    variant: "primary",
  },
});

export type TableVariants = VariantProps<typeof tableVariants>;

type TableSlots = ReturnType<typeof tableVariants>;

type TableContextValue = {
  slots: TableSlots;
};

const TableContext = createContext<TableContextValue | undefined>(undefined);

function useTableSlots() {
  return useContext(TableContext)?.slots ?? tableVariants();
}

type RenderFunction<TValue> = (value: TValue) => ReactNode;
type KeyLike = string | number;

function renderTextChildren(children: ReactNode, className: string) {
  return Children.map(children, (child) => {
    if (typeof child === "string" || typeof child === "number") {
      return <Text className={className}>{child}</Text>;
    }

    return child;
  });
}

function getItemKey(item: unknown, index: number): KeyLike {
  if (item && typeof item === "object") {
    const record = item as { id?: KeyLike; key?: KeyLike };
    return record.id ?? record.key ?? index;
  }

  return index;
}

function renderCollection<TValue>(
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

export interface TableRootProps extends Omit<ViewProps, "children">, TableVariants {
  children?: ReactNode;
  className?: string;
}

const TableRoot = forwardRef<View, TableRootProps>(
  ({ children, className, variant, ...props }, ref) => {
    const slots = useMemo(() => tableVariants({ variant }), [variant]);

    return (
      <TableContext.Provider value={{ slots }}>
        <View ref={ref} className={slots.root({ className })} {...props}>
          {children}
        </View>
      </TableContext.Provider>
    );
  },
);

TableRoot.displayName = "PitsiUINative.TableRoot";

export interface TableScrollContainerProps extends ScrollViewProps {
  children?: ReactNode;
  className?: string;
}

const TableScrollContainer = forwardRef<ScrollView, TableScrollContainerProps>(
  (
    { children, className, horizontal = true, showsHorizontalScrollIndicator = false, ...props },
    ref,
  ) => {
    const slots = useTableSlots();

    return (
      <ScrollView
        ref={ref}
        className={slots.scrollContainer({ className })}
        horizontal={horizontal}
        showsHorizontalScrollIndicator={showsHorizontalScrollIndicator}
        {...props}
      >
        {children}
      </ScrollView>
    );
  },
);

TableScrollContainer.displayName = "PitsiUINative.TableScrollContainer";

export interface TableContentProps extends ViewProps {
  children?: ReactNode;
  className?: string;
}

const TableContent = forwardRef<View, TableContentProps>(
  ({ children, className, ...props }, ref) => {
    const slots = useTableSlots();

    return (
      <View ref={ref} className={slots.content({ className })} {...props}>
        {children}
      </View>
    );
  },
);

TableContent.displayName = "PitsiUINative.TableContent";

export interface TableHeaderProps<TValue = object> extends Omit<ViewProps, "children"> {
  children?: ReactNode | RenderFunction<TValue>;
  className?: string;
  columns?: Iterable<TValue>;
}

function TableHeaderInner<TValue = object>(
  { children, className, columns, ...props }: TableHeaderProps<TValue>,
  ref: React.ForwardedRef<View>,
) {
  // biome-ignore lint/correctness/useHookAtTopLevel: forwardRef generic render function is the component body.
  const slots = useTableSlots();

  return (
    <View ref={ref} className={slots.header({ className })} {...props}>
      {renderCollection(columns, children)}
    </View>
  );
}

const TableHeader = forwardRef(TableHeaderInner) as <TValue = object>(
  props: TableHeaderProps<TValue> & { ref?: React.ForwardedRef<View> },
) => React.ReactElement | null;

(TableHeader as React.FC).displayName = "PitsiUINative.TableHeader";

export interface TableColumnProps extends Omit<PressableProps, "children" | "disabled" | "id"> {
  allowsSorting?: boolean;
  children?: ReactNode | ((props: { allowsSorting: boolean; isPressed: boolean }) => ReactNode);
  className?: string;
  id?: KeyLike;
  isDisabled?: boolean;
  onAction?: () => void;
  onClick?: () => void;
  textValue?: string;
}

const TableColumn = forwardRef<View, TableColumnProps>(
  (
    {
      allowsSorting = false,
      children,
      className,
      id: _id,
      isDisabled = false,
      onAction,
      onClick,
      onPress,
      textValue,
      ...props
    },
    ref,
  ) => {
    const slots = useTableSlots();
    const isInteractive = Boolean(allowsSorting || onAction || onClick || onPress);

    return (
      <Pressable
        ref={ref}
        accessibilityRole={isInteractive ? "button" : "text"}
        accessibilityState={{ disabled: isDisabled }}
        className={slots.column({ className })}
        disabled={isDisabled}
        onPress={(event) => {
          onPress?.(event);
          onAction?.();
          onClick?.();
        }}
        {...props}
      >
        {({ pressed }) =>
          renderTextChildren(
            typeof children === "function"
              ? children({ allowsSorting, isPressed: pressed })
              : (children ?? textValue),
            slots.columnText(),
          )
        }
      </Pressable>
    );
  },
);

TableColumn.displayName = "PitsiUINative.TableColumn";

export interface TableColumnResizerProps extends ViewProps {
  className?: string;
}

const TableColumnResizer = forwardRef<View, TableColumnResizerProps>(
  ({ className, ...props }, ref) => {
    const slots = useTableSlots();

    return <View ref={ref} className={slots.columnResizer({ className })} {...props} />;
  },
);

TableColumnResizer.displayName = "PitsiUINative.TableColumnResizer";

export interface TableBodyProps<TValue = object> extends Omit<ViewProps, "children"> {
  children?: ReactNode | RenderFunction<TValue>;
  className?: string;
  items?: Iterable<TValue>;
  renderEmptyState?: ReactNode | (() => ReactNode);
}

function TableBodyInner<TValue = object>(
  { children, className, items, renderEmptyState, ...props }: TableBodyProps<TValue>,
  ref: React.ForwardedRef<View>,
) {
  // biome-ignore lint/correctness/useHookAtTopLevel: forwardRef generic render function is the component body.
  const slots = useTableSlots();
  const itemArray = items ? Array.from(items) : undefined;
  const isEmptyCollection = itemArray !== undefined && itemArray.length === 0;
  const emptyState = typeof renderEmptyState === "function" ? renderEmptyState() : renderEmptyState;

  return (
    <View ref={ref} className={slots.body({ className })} {...props}>
      {isEmptyCollection && emptyState
        ? renderTextChildren(emptyState, slots.cellText())
        : renderCollection(itemArray, children)}
    </View>
  );
}

const TableBody = forwardRef(TableBodyInner) as <TValue = object>(
  props: TableBodyProps<TValue> & { ref?: React.ForwardedRef<View> },
) => React.ReactElement | null;

(TableBody as React.FC).displayName = "PitsiUINative.TableBody";

export interface TableRowProps<TValue = object> extends Omit<ViewProps, "children" | "id"> {
  children?: ReactNode | RenderFunction<TValue>;
  className?: string;
  id?: KeyLike;
  isDisabled?: boolean;
  isSelected?: boolean;
  item?: TValue;
}

function TableRowInner<TValue = object>(
  { children, className, id: _id, isDisabled, isSelected, item, ...props }: TableRowProps<TValue>,
  ref: React.ForwardedRef<View>,
) {
  // biome-ignore lint/correctness/useHookAtTopLevel: forwardRef generic render function is the component body.
  const slots = useTableSlots();

  return (
    <View
      ref={ref}
      accessibilityState={{ disabled: isDisabled, selected: isSelected }}
      className={slots.row({
        className: `${isDisabled ? "opacity-disabled" : ""} ${className ?? ""}`,
      })}
      {...props}
    >
      {typeof children === "function" ? children(item as TValue) : children}
    </View>
  );
}

const TableRow = forwardRef(TableRowInner) as <TValue = object>(
  props: TableRowProps<TValue> & { ref?: React.ForwardedRef<View> },
) => React.ReactElement | null;

(TableRow as React.FC).displayName = "PitsiUINative.TableRow";

export interface TableCellProps extends Omit<ViewProps, "children" | "id"> {
  children?: ReactNode;
  className?: string;
  colSpan?: number;
  id?: KeyLike;
  isRowHeader?: boolean;
  textValue?: string;
}

const TableCell = forwardRef<View, TableCellProps>(
  (
    {
      children,
      className,
      colSpan: _colSpan,
      id: _id,
      isRowHeader: _isRowHeader,
      textValue,
      ...props
    },
    ref,
  ) => {
    const slots = useTableSlots();

    return (
      <View ref={ref} className={slots.cell({ className })} {...props}>
        {renderTextChildren(children ?? textValue, slots.cellText())}
      </View>
    );
  },
);

TableCell.displayName = "PitsiUINative.TableCell";

export interface TableFooterProps extends ViewProps {
  children?: ReactNode;
  className?: string;
}

const TableFooter = forwardRef<View, TableFooterProps>(({ children, className, ...props }, ref) => {
  const slots = useTableSlots();

  return (
    <View ref={ref} className={slots.footer({ className })} {...props}>
      {children}
    </View>
  );
});

TableFooter.displayName = "PitsiUINative.TableFooter";

export interface TableResizableContainerProps extends TableScrollContainerProps {}

const TableResizableContainer = forwardRef<ScrollView, TableResizableContainerProps>(
  (
    { children, className, horizontal = true, showsHorizontalScrollIndicator = false, ...props },
    ref,
  ) => {
    const slots = useTableSlots();

    return (
      <ScrollView
        ref={ref}
        className={slots.resizableContainer({ className })}
        horizontal={horizontal}
        showsHorizontalScrollIndicator={showsHorizontalScrollIndicator}
        {...props}
      >
        {children}
      </ScrollView>
    );
  },
);

TableResizableContainer.displayName = "PitsiUINative.TableResizableContainer";

export interface TableLoadMoreItemProps
  extends Omit<PressableProps, "children" | "disabled" | "id"> {
  children?: ReactNode;
  className?: string;
  id?: KeyLike;
  isDisabled?: boolean;
  onAction?: () => void;
  onClick?: () => void;
}

const TableLoadMoreItem = forwardRef<View, TableLoadMoreItemProps>(
  (
    { children, className, id: _id, isDisabled = false, onAction, onClick, onPress, ...props },
    ref,
  ) => {
    const slots = useTableSlots();

    return (
      <Pressable
        ref={ref}
        accessibilityRole="button"
        accessibilityState={{ disabled: isDisabled }}
        className={slots.loadMore({ className })}
        disabled={isDisabled}
        onPress={(event) => {
          onPress?.(event);
          onAction?.();
          onClick?.();
        }}
        {...props}
      >
        {renderTextChildren(children, slots.cellText())}
      </Pressable>
    );
  },
);

TableLoadMoreItem.displayName = "PitsiUINative.TableLoadMoreItem";

export interface TableLoadMoreContentProps extends ViewProps {
  children?: ReactNode;
  className?: string;
}

const TableLoadMoreContent = forwardRef<View, TableLoadMoreContentProps>(
  ({ children, className, ...props }, ref) => {
    const slots = useTableSlots();

    return (
      <View ref={ref} className={slots.loadMoreContent({ className })} {...props}>
        {renderTextChildren(children, slots.cellText())}
      </View>
    );
  },
);

TableLoadMoreContent.displayName = "PitsiUINative.TableLoadMoreContent";

export interface TableCollectionProps<TValue = object> extends Omit<ViewProps, "children"> {
  children?: ReactNode | RenderFunction<TValue>;
  className?: string;
  items?: Iterable<TValue>;
}

function TableCollectionInner<TValue = object>(
  { children, className, items, ...props }: TableCollectionProps<TValue>,
  ref: React.ForwardedRef<View>,
) {
  // biome-ignore lint/correctness/useHookAtTopLevel: forwardRef generic render function is the component body.
  const slots = useTableSlots();

  return (
    <View ref={ref} className={className} {...props}>
      {renderCollection(items, children) ??
        (typeof children === "function"
          ? null
          : children
            ? renderTextChildren(children, slots.cellText())
            : null)}
    </View>
  );
}

const TableCollection = forwardRef(TableCollectionInner) as <TValue = object>(
  props: TableCollectionProps<TValue> & { ref?: React.ForwardedRef<View> },
) => React.ReactElement | null;

(TableCollection as React.FC).displayName = "PitsiUINative.TableCollection";

export {
  TableBody,
  TableCell,
  TableCollection,
  TableColumn,
  TableColumnResizer,
  TableContent,
  TableFooter,
  TableHeader,
  TableLoadMoreContent,
  TableLoadMoreItem,
  TableResizableContainer,
  TableRoot,
  TableRow,
  TableScrollContainer,
};
