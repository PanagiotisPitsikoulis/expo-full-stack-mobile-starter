import type { ComponentProps } from "react";

import { ListBoxSectionRoot } from "./list-box-section";

export const ListBoxSection = ListBoxSectionRoot;

export type ListBoxSection = {
  Props: ComponentProps<typeof ListBoxSectionRoot>;
};

export type {
  ListBoxSectionRootProps,
  ListBoxSectionRootProps as ListBoxSectionProps,
  ListBoxSectionVariants,
} from "./list-box-section";

export { ListBoxSectionRoot, listboxSectionVariants } from "./list-box-section";
