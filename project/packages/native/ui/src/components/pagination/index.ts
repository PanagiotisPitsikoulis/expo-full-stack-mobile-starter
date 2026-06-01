import type { ComponentProps } from "react";

import {
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationNextIcon,
  PaginationPrevious,
  PaginationPreviousIcon,
  PaginationRoot,
  PaginationSummary,
} from "./pagination";

export const Pagination = Object.assign(PaginationRoot, {
  Content: PaginationContent,
  Ellipsis: PaginationEllipsis,
  Item: PaginationItem,
  Link: PaginationLink,
  Next: PaginationNext,
  NextIcon: PaginationNextIcon,
  Previous: PaginationPrevious,
  PreviousIcon: PaginationPreviousIcon,
  Root: PaginationRoot,
  Summary: PaginationSummary,
});

export type Pagination = {
  ContentProps: ComponentProps<typeof PaginationContent>;
  EllipsisProps: ComponentProps<typeof PaginationEllipsis>;
  ItemProps: ComponentProps<typeof PaginationItem>;
  LinkProps: ComponentProps<typeof PaginationLink>;
  NextIconProps: ComponentProps<typeof PaginationNextIcon>;
  NextProps: ComponentProps<typeof PaginationNext>;
  PreviousIconProps: ComponentProps<typeof PaginationPreviousIcon>;
  PreviousProps: ComponentProps<typeof PaginationPrevious>;
  Props: ComponentProps<typeof PaginationRoot>;
  RootProps: ComponentProps<typeof PaginationRoot>;
  SummaryProps: ComponentProps<typeof PaginationSummary>;
};

export type {
  PaginationContentProps,
  PaginationEllipsisProps,
  PaginationItemProps,
  PaginationLinkProps,
  PaginationNextIconProps,
  PaginationNextProps,
  PaginationPreviousIconProps,
  PaginationPreviousProps,
  PaginationRootProps,
  PaginationRootProps as PaginationProps,
  PaginationSummaryProps,
  PaginationVariants,
} from "./pagination";
export {
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationNextIcon,
  PaginationPrevious,
  PaginationPreviousIcon,
  PaginationRoot,
  PaginationSummary,
  paginationVariants,
} from "./pagination";
