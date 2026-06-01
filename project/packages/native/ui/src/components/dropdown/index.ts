import type { ComponentProps } from "react";

import {
  DropdownItem,
  DropdownItemIndicator,
  DropdownMenu,
  DropdownPopover,
  DropdownRoot,
  DropdownSection,
  DropdownSubmenuIndicator,
  DropdownSubmenuTrigger,
  DropdownTrigger,
} from "./dropdown";

export const Dropdown = Object.assign(DropdownRoot, {
  Item: DropdownItem,
  ItemIndicator: DropdownItemIndicator,
  Menu: DropdownMenu,
  Popover: DropdownPopover,
  Root: DropdownRoot,
  Section: DropdownSection,
  SubmenuIndicator: DropdownSubmenuIndicator,
  SubmenuTrigger: DropdownSubmenuTrigger,
  Trigger: DropdownTrigger,
});

export type Dropdown = {
  ItemIndicatorProps: ComponentProps<typeof DropdownItemIndicator>;
  ItemProps: ComponentProps<typeof DropdownItem>;
  MenuProps: ComponentProps<typeof DropdownMenu>;
  PopoverProps: ComponentProps<typeof DropdownPopover>;
  Props: ComponentProps<typeof DropdownRoot>;
  RootProps: ComponentProps<typeof DropdownRoot>;
  SectionProps: ComponentProps<typeof DropdownSection>;
  SubmenuIndicatorProps: ComponentProps<typeof DropdownSubmenuIndicator>;
  SubmenuTriggerProps: ComponentProps<typeof DropdownSubmenuTrigger>;
  TriggerProps: ComponentProps<typeof DropdownTrigger>;
};

export type {
  DropdownItemIndicatorProps,
  DropdownItemProps,
  DropdownMenuProps,
  DropdownPopoverProps,
  DropdownRootProps,
  DropdownRootProps as DropdownProps,
  DropdownSectionProps,
  DropdownSubmenuIndicatorProps,
  DropdownSubmenuTriggerProps,
  DropdownTriggerProps,
  DropdownVariants,
} from "./dropdown";

export {
  DropdownItem,
  DropdownItemIndicator,
  DropdownMenu,
  DropdownPopover,
  DropdownRoot,
  DropdownSection,
  DropdownSubmenuIndicator,
  DropdownSubmenuTrigger,
  DropdownTrigger,
  dropdownVariants,
} from "./dropdown";
