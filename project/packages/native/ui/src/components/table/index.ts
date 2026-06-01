import type { ComponentProps } from "react";

import {
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
} from "./table";

export const Table = Object.assign(TableRoot, {
  Body: TableBody,
  Cell: TableCell,
  Collection: TableCollection,
  Column: TableColumn,
  ColumnResizer: TableColumnResizer,
  Content: TableContent,
  Footer: TableFooter,
  Header: TableHeader,
  LoadMore: TableLoadMoreItem,
  LoadMoreContent: TableLoadMoreContent,
  LoadMoreItem: TableLoadMoreItem,
  ResizableContainer: TableResizableContainer,
  Root: TableRoot,
  Row: TableRow,
  ScrollContainer: TableScrollContainer,
});

export type Table = {
  BodyProps: ComponentProps<typeof TableBody>;
  CellProps: ComponentProps<typeof TableCell>;
  CollectionProps: ComponentProps<typeof TableCollection>;
  ColumnProps: ComponentProps<typeof TableColumn>;
  ColumnResizerProps: ComponentProps<typeof TableColumnResizer>;
  ContentProps: ComponentProps<typeof TableContent>;
  FooterProps: ComponentProps<typeof TableFooter>;
  HeaderProps: ComponentProps<typeof TableHeader>;
  LoadMoreContentProps: ComponentProps<typeof TableLoadMoreContent>;
  LoadMoreProps: ComponentProps<typeof TableLoadMoreItem>;
  Props: ComponentProps<typeof TableRoot>;
  ResizableContainerProps: ComponentProps<typeof TableResizableContainer>;
  RootProps: ComponentProps<typeof TableRoot>;
  RowProps: ComponentProps<typeof TableRow>;
  ScrollContainerProps: ComponentProps<typeof TableScrollContainer>;
};

export type {
  TableBodyProps,
  TableCellProps,
  TableCollectionProps,
  TableColumnProps,
  TableColumnResizerProps,
  TableContentProps,
  TableFooterProps,
  TableHeaderProps,
  TableLoadMoreContentProps,
  TableLoadMoreItemProps,
  TableResizableContainerProps,
  TableRootProps,
  TableRootProps as TableProps,
  TableRowProps,
  TableScrollContainerProps,
  TableVariants,
} from "./table";

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
  tableVariants,
} from "./table";
