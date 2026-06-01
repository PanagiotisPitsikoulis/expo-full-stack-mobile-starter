import type { ComponentProps } from "react";

import { BreadcrumbsItem, BreadcrumbsRoot } from "./breadcrumbs";

export const Breadcrumbs = Object.assign(BreadcrumbsRoot, {
  Item: BreadcrumbsItem,
  Root: BreadcrumbsRoot,
});

export type Breadcrumbs = {
  ItemProps: ComponentProps<typeof BreadcrumbsItem>;
  Props: ComponentProps<typeof BreadcrumbsRoot>;
  RootProps: ComponentProps<typeof BreadcrumbsRoot>;
};

export type {
  BreadcrumbsItemProps,
  BreadcrumbsRootProps,
  BreadcrumbsRootProps as BreadcrumbsProps,
  BreadcrumbsVariants,
} from "./breadcrumbs";
export { BreadcrumbsItem, BreadcrumbsRoot, breadcrumbsVariants } from "./breadcrumbs";
