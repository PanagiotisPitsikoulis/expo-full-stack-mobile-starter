import type { ComponentProps } from "react";

import { ItemActions, ItemContent, ItemDescription, ItemMedia, ItemRoot, ItemTitle } from "./item";

export const Item = Object.assign(ItemRoot, {
  Actions: ItemActions,
  Content: ItemContent,
  Description: ItemDescription,
  Media: ItemMedia,
  Root: ItemRoot,
  Title: ItemTitle,
});

export type Item = {
  ActionsProps: ComponentProps<typeof ItemActions>;
  ContentProps: ComponentProps<typeof ItemContent>;
  DescriptionProps: ComponentProps<typeof ItemDescription>;
  MediaProps: ComponentProps<typeof ItemMedia>;
  Props: ComponentProps<typeof ItemRoot>;
  RootProps: ComponentProps<typeof ItemRoot>;
  TitleProps: ComponentProps<typeof ItemTitle>;
};

export type {
  ItemActionsProps,
  ItemContentProps,
  ItemDescriptionProps,
  ItemMediaProps,
  ItemRootProps,
  ItemRootProps as ItemProps,
  ItemTitleProps,
  ItemVariants,
} from "./item";
export {
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemRoot,
  ItemTitle,
  itemVariants,
} from "./item";
