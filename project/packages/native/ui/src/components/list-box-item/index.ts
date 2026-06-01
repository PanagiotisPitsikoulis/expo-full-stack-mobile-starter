import type { ComponentProps } from "react";

import { ListBoxItemIndicator, ListBoxItemRoot } from "./list-box-item";

export const ListBoxItem = Object.assign(ListBoxItemRoot, {
  Indicator: ListBoxItemIndicator,
  Root: ListBoxItemRoot,
});

export type ListBoxItem = {
  IndicatorProps: ComponentProps<typeof ListBoxItemIndicator>;
  Props: ComponentProps<typeof ListBoxItemRoot>;
  RootProps: ComponentProps<typeof ListBoxItemRoot>;
};

export type {
  ListBoxItemContextValue,
  ListBoxItemIndicatorProps,
  ListBoxItemRootProps,
  ListBoxItemRootProps as ListBoxItemProps,
  ListBoxItemVariants,
} from "./list-box-item";

export {
  ListBoxItemContext,
  ListBoxItemIndicator,
  ListBoxItemRoot,
  listboxItemVariants,
} from "./list-box-item";
