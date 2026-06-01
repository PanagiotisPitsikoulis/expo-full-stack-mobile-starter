import type { ComponentProps } from "react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandRoot,
  CommandSeparator,
  CommandShortcut,
} from "./command";

export const Command = Object.assign(CommandRoot, {
  Dialog: CommandDialog,
  Empty: CommandEmpty,
  Group: CommandGroup,
  Input: CommandInput,
  Item: CommandItem,
  List: CommandList,
  Root: CommandRoot,
  Separator: CommandSeparator,
  Shortcut: CommandShortcut,
});

export type Command = {
  DialogProps: ComponentProps<typeof CommandDialog>;
  EmptyProps: ComponentProps<typeof CommandEmpty>;
  GroupProps: ComponentProps<typeof CommandGroup>;
  InputProps: ComponentProps<typeof CommandInput>;
  ItemProps: ComponentProps<typeof CommandItem>;
  ListProps: ComponentProps<typeof CommandList>;
  Props: ComponentProps<typeof CommandRoot>;
  RootProps: ComponentProps<typeof CommandRoot>;
  SeparatorProps: ComponentProps<typeof CommandSeparator>;
  ShortcutProps: ComponentProps<typeof CommandShortcut>;
};

export type {
  CommandDialogProps,
  CommandEmptyProps,
  CommandGroupProps,
  CommandInputProps,
  CommandItemProps,
  CommandListProps,
  CommandRootProps,
  CommandRootProps as CommandProps,
  CommandSeparatorProps,
  CommandShortcutProps,
  CommandVariants,
} from "./command";

export {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandRoot,
  CommandSeparator,
  CommandShortcut,
  commandVariants,
} from "./command";
