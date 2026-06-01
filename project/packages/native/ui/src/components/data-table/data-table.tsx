import { type ReactNode, useEffect, useMemo, useState } from "react";
import { Pressable, View, type ViewProps } from "react-native";
import { tv, type VariantProps } from "tailwind-variants";

import { Button } from "../button";
import { IconChevronDown } from "../icons";
import { Input } from "../input";
import { Table } from "../table";
import { Text } from "../text";

export const dataTableVariants = tv({
  slots: {
    base: "w-full gap-3 rounded-2xl bg-surface p-3",
    empty: "min-h-24 items-center justify-center px-4 py-6",
    emptyText: "text-center text-sm text-muted",
    footer: "flex-row items-center justify-between gap-3 px-1",
    pageActions: "flex-row items-center gap-2",
    pageInfo: "text-xs text-muted",
    sortIcon: "text-xs text-muted",
    thButton: "flex-row items-center justify-between gap-2",
    toolbar: "flex-row items-center justify-between gap-3",
    toolbarMain: "min-w-0 flex-1 flex-row items-center gap-2",
  },
});

export type DataTableVariants = VariantProps<typeof dataTableVariants>;

export type DataTableHeaderContext<TData, TValue> = {
  column: ColumnDef<TData, TValue>;
  columnId: string;
};

export type DataTableCellContext<TData, TValue> = {
  column: ColumnDef<TData, TValue>;
  columnId: string;
  getValue: <TValueOverride = TValue>() => TValueOverride | undefined;
  row: DataTableRowContext<TData>;
  value: TValue | undefined;
};

export type DataTableRowContext<TData> = {
  getValue: <TValueOverride = unknown>(columnId?: string) => TValueOverride | undefined;
  index: number;
  original: TData;
};

export type ColumnDef<TData = unknown, TValue = unknown> = Record<string, unknown> & {
  accessorFn?: (row: TData, index: number) => TValue;
  accessorKey?: keyof TData | string;
  cell?:
    | ReactNode
    | ((context: DataTableCellContext<TData, TValue>) => ReactNode)
    | ((value: TValue | undefined, row: TData) => ReactNode);
  enableSorting?: boolean;
  header?: ReactNode | ((context: DataTableHeaderContext<TData, TValue>) => ReactNode);
  id?: string;
  meta?: unknown;
};

type SortDirection = "asc" | "desc";

type SortingState = {
  direction: SortDirection;
  id: string;
};

export interface DataTableProps<TData, TValue = unknown>
  extends Omit<ViewProps, "children">,
    DataTableVariants {
  className?: string;
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  emptyMessage?: ReactNode;
  pageSize?: number;
  searchable?: boolean;
  searchPlaceholder?: string;
  toolbarLeft?: ReactNode;
  toolbarRight?: ReactNode;
}

function renderTextNode(value: ReactNode, className: string) {
  if (typeof value === "string" || typeof value === "number") {
    return <Text className={className}>{value}</Text>;
  }

  return value;
}

function getColumnId<TData, TValue>(column: ColumnDef<TData, TValue>, index: number) {
  return String(column.id ?? column.accessorKey ?? index);
}

function readPathValue(value: unknown, path: string) {
  return path.split(".").reduce<unknown>((currentValue, key) => {
    if (currentValue == null || typeof currentValue !== "object") {
      return undefined;
    }

    return (currentValue as Record<string, unknown>)[key];
  }, value);
}

function getColumnValue<TData, TValue>(
  row: TData,
  column: ColumnDef<TData, TValue>,
  rowIndex: number,
) {
  if (column.accessorFn) {
    return column.accessorFn(row, rowIndex);
  }

  if (!column.accessorKey) {
    return undefined;
  }

  return readPathValue(row, String(column.accessorKey)) as TValue | undefined;
}

function stringifyValue(value: unknown) {
  if (value == null) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (value instanceof Date) return value.toISOString();
  return "";
}

function renderHeader<TData, TValue>(
  column: ColumnDef<TData, TValue>,
  columnId: string,
): ReactNode {
  if (typeof column.header === "function") {
    return column.header({ column, columnId });
  }

  return column.header ?? columnId;
}

function createRowContext<TData, TValue>(
  row: TData,
  rowIndex: number,
  columns: ColumnDef<TData, TValue>[],
): DataTableRowContext<TData> {
  return {
    getValue: <TValueOverride = unknown>(columnId?: string) => {
      const targetColumn = columnId
        ? columns.find((column, index) => getColumnId(column, index) === columnId)
        : undefined;

      return (targetColumn ? getColumnValue(row, targetColumn, rowIndex) : undefined) as
        | TValueOverride
        | undefined;
    },
    index: rowIndex,
    original: row,
  };
}

function renderCell<TData, TValue>(
  row: TData,
  rowIndex: number,
  column: ColumnDef<TData, TValue>,
  columnIndex: number,
  columns: ColumnDef<TData, TValue>[],
) {
  const columnId = getColumnId(column, columnIndex);
  const value = getColumnValue(row, column, rowIndex);
  const rowContext = createRowContext(row, rowIndex, columns);
  const cellContext: DataTableCellContext<TData, TValue> = {
    column,
    columnId,
    getValue: <TValueOverride = TValue>() => value as TValueOverride | undefined,
    row: rowContext,
    value,
  };

  if (typeof column.cell === "function") {
    const renderer = column.cell as (...args: unknown[]) => ReactNode;
    return renderer.length >= 2 ? renderer(value, row) : renderer(cellContext);
  }

  return column.cell ?? stringifyValue(value);
}

function matchesFilter<TData, TValue>(
  row: TData,
  rowIndex: number,
  columns: ColumnDef<TData, TValue>[],
  filter: string,
) {
  if (!filter) return true;

  const needle = filter.toLocaleLowerCase();

  return columns.some((column) =>
    stringifyValue(getColumnValue(row, column, rowIndex))
      .toLocaleLowerCase()
      .includes(needle),
  );
}

function compareValues(a: unknown, b: unknown) {
  if (typeof a === "number" && typeof b === "number") {
    return a - b;
  }

  return stringifyValue(a).localeCompare(stringifyValue(b), undefined, {
    numeric: true,
    sensitivity: "base",
  });
}

function DataTable<TData, TValue = unknown>({
  className,
  columns,
  data,
  emptyMessage = "No results.",
  pageSize = 10,
  searchable = true,
  searchPlaceholder = "Search...",
  toolbarLeft,
  toolbarRight,
  ...props
}: DataTableProps<TData, TValue>) {
  const slots = useMemo(() => dataTableVariants(), []);
  const [filter, setFilter] = useState("");
  const [pageIndex, setPageIndex] = useState(0);
  const [sorting, setSorting] = useState<SortingState | undefined>();

  const rows = useMemo(() => {
    const filteredRows = data.filter((row, rowIndex) =>
      matchesFilter(row, rowIndex, columns, filter),
    );

    if (!sorting) {
      return filteredRows;
    }

    const sortingColumn = columns.find(
      (column, columnIndex) => getColumnId(column, columnIndex) === sorting.id,
    );

    if (!sortingColumn) {
      return filteredRows;
    }

    return [...filteredRows].sort((a, b) => {
      const aValue = getColumnValue(a, sortingColumn, data.indexOf(a));
      const bValue = getColumnValue(b, sortingColumn, data.indexOf(b));
      const comparison = compareValues(aValue, bValue);
      return sorting.direction === "asc" ? comparison : -comparison;
    });
  }, [columns, data, filter, sorting]);

  const safePageSize = Math.max(1, pageSize);
  const pageCount = Math.max(1, Math.ceil(rows.length / safePageSize));
  const safePageIndex = Math.min(pageIndex, pageCount - 1);
  const pageRows = rows.slice(safePageIndex * safePageSize, (safePageIndex + 1) * safePageSize);
  const showToolbar = Boolean(searchable || toolbarLeft || toolbarRight);

  useEffect(() => {
    if (pageIndex > pageCount - 1) {
      setPageIndex(pageCount - 1);
    }
  }, [pageCount, pageIndex]);

  const toggleSorting = (columnId: string) => {
    setSorting((current) => {
      if (current?.id !== columnId) {
        return { id: columnId, direction: "asc" };
      }

      if (current.direction === "asc") {
        return { id: columnId, direction: "desc" };
      }

      return undefined;
    });
  };

  return (
    <View className={slots.base({ className })} {...props}>
      {showToolbar ? (
        <View className={slots.toolbar()}>
          <View className={slots.toolbarMain()}>
            {toolbarLeft}
            {searchable ? (
              <Input
                accessibilityLabel="Search table"
                className="min-w-0 flex-1"
                onChangeText={(value) => {
                  setFilter(value);
                  setPageIndex(0);
                }}
                placeholder={searchPlaceholder}
                returnKeyType="search"
                value={filter}
              />
            ) : null}
          </View>
          {toolbarRight}
        </View>
      ) : null}

      <Table>
        <Table.ScrollContainer>
          <Table.Content>
            <Table.Header>
              <Table.Row>
                {columns.map((column, columnIndex) => {
                  const columnId = getColumnId(column, columnIndex);
                  const sortedDirection = sorting?.id === columnId ? sorting.direction : undefined;
                  const canSort =
                    column.enableSorting !== false &&
                    Boolean(column.accessorKey || column.accessorFn);

                  return (
                    <Table.Column key={columnId}>
                      {canSort ? (
                        <Pressable
                          accessibilityRole="button"
                          accessibilityState={{ selected: Boolean(sortedDirection) }}
                          className={slots.thButton()}
                          onPress={() => toggleSorting(columnId)}
                        >
                          {renderTextNode(
                            renderHeader(column, columnId),
                            "text-xs font-medium text-muted",
                          )}
                          {sortedDirection ? (
                            <IconChevronDown
                              className={slots.sortIcon({
                                className: sortedDirection === "asc" ? "rotate-180" : "",
                              })}
                            />
                          ) : null}
                        </Pressable>
                      ) : (
                        renderTextNode(
                          renderHeader(column, columnId),
                          "text-xs font-medium text-muted",
                        )
                      )}
                    </Table.Column>
                  );
                })}
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {pageRows.length ? (
                pageRows.map((row, rowIndex) => {
                  const absoluteRowIndex = safePageIndex * safePageSize + rowIndex;

                  return (
                    <Table.Row key={absoluteRowIndex}>
                      {columns.map((column, columnIndex) => (
                        <Table.Cell key={getColumnId(column, columnIndex)}>
                          {renderTextNode(
                            renderCell(row, absoluteRowIndex, column, columnIndex, columns),
                            "text-sm text-foreground",
                          )}
                        </Table.Cell>
                      ))}
                    </Table.Row>
                  );
                })
              ) : (
                <View className={slots.empty()}>
                  {renderTextNode(emptyMessage, slots.emptyText())}
                </View>
              )}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>

      <View className={slots.footer()}>
        <Text className={slots.pageInfo()}>
          Page {safePageIndex + 1} of {pageCount}
        </Text>
        <View className={slots.pageActions()}>
          <Button
            isDisabled={safePageIndex <= 0}
            onPress={() => setPageIndex((value) => Math.max(0, value - 1))}
            size="sm"
            variant="outline"
          >
            Previous
          </Button>
          <Button
            isDisabled={safePageIndex >= pageCount - 1}
            onPress={() => setPageIndex((value) => Math.min(pageCount - 1, value + 1))}
            size="sm"
            variant="outline"
          >
            Next
          </Button>
        </View>
      </View>
    </View>
  );
}

export { DataTable };
