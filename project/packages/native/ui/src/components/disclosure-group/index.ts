import type { ComponentProps } from "react";

import { DisclosureGroupRoot } from "./disclosure-group";

export const DisclosureGroup = Object.assign(DisclosureGroupRoot, {
  Root: DisclosureGroupRoot,
});

export type DisclosureGroup = {
  Props: ComponentProps<typeof DisclosureGroupRoot>;
  RootProps: ComponentProps<typeof DisclosureGroupRoot>;
};

export type {
  DisclosureGroupContextValue,
  DisclosureGroupRootProps,
  DisclosureGroupRootProps as DisclosureGroupProps,
  DisclosureGroupVariants,
  DisclosureKey,
} from "./disclosure-group";
export {
  DisclosureGroupContext,
  DisclosureGroupRoot,
  disclosureGroupVariants,
} from "./disclosure-group";
export type {
  UseDisclosureGroupNavigationProps,
  UseDisclosureGroupNavigationReturn,
} from "./use-disclosure-group-navigation";
export { useDisclosureGroupNavigation } from "./use-disclosure-group-navigation";
