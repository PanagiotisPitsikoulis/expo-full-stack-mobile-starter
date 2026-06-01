import type { ComponentProps } from "react";

import { TagRemoveButton, TagRoot } from "./tag";

export const Tag = Object.assign(TagRoot, {
  RemoveButton: TagRemoveButton,
  Root: TagRoot,
});

export type Tag = {
  Props: ComponentProps<typeof TagRoot>;
  RemoveButtonProps: ComponentProps<typeof TagRemoveButton>;
  RootProps: ComponentProps<typeof TagRoot>;
};

export type { TagRemoveButtonProps, TagRootProps, TagVariants } from "./tag";
export { TagRemoveButton, TagRoot, tagVariants } from "./tag";
