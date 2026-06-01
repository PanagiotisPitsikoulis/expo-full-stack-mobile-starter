import type { ComponentProps } from "react";

import { ListBoxItem, ListBoxItemIndicator } from "../list-box-item";
import { ListBoxSection } from "../list-box-section";
import { ListBoxRoot } from "./list-box";

export const ListBox = Object.assign(ListBoxRoot, {
  Item: ListBoxItem,
  ItemIndicator: ListBoxItemIndicator,
  Root: ListBoxRoot,
  Section: ListBoxSection,
});

export type ListBox = {
  ItemProps: ComponentProps<typeof ListBoxItem>;
  Props: ComponentProps<typeof ListBoxRoot>;
  RootProps: ComponentProps<typeof ListBoxRoot>;
  SectionProps: ComponentProps<typeof ListBoxSection>;
};

export type {
  ListBoxContextValue,
  ListBoxKey,
  ListBoxRootProps,
  ListBoxRootProps as ListBoxProps,
  ListBoxSelectionMode,
  ListBoxVariants,
} from "./list-box";

export { ListBoxContext, ListBoxRoot, listboxVariants } from "./list-box";
