import type { ComponentProps } from "react";

import { DataTable as DataTableRoot } from "./data-table";

export const DataTable = Object.assign(DataTableRoot, {
  Root: DataTableRoot,
});

export type DataTable = {
  Props: ComponentProps<typeof DataTableRoot>;
  RootProps: ComponentProps<typeof DataTableRoot>;
};

export type {
  ColumnDef,
  DataTableCellContext,
  DataTableHeaderContext,
  DataTableProps,
  DataTableRowContext,
  DataTableVariants,
} from "./data-table";
export { DataTable as DataTableRoot, dataTableVariants } from "./data-table";
