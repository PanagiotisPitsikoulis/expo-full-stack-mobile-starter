import type { ComponentProps } from "react";

import {
  DisclosureBody,
  DisclosureContent,
  DisclosureHeading,
  DisclosureIndicator,
  DisclosureRoot,
  DisclosureTrigger,
} from "./disclosure";

export const Disclosure = Object.assign(DisclosureRoot, {
  Body: DisclosureBody,
  Content: DisclosureContent,
  Heading: DisclosureHeading,
  Indicator: DisclosureIndicator,
  Root: DisclosureRoot,
  Trigger: DisclosureTrigger,
});

export type Disclosure = {
  BodyProps: ComponentProps<typeof DisclosureBody>;
  ContentProps: ComponentProps<typeof DisclosureContent>;
  HeadingProps: ComponentProps<typeof DisclosureHeading>;
  IndicatorProps: ComponentProps<typeof DisclosureIndicator>;
  Props: ComponentProps<typeof DisclosureRoot>;
  RootProps: ComponentProps<typeof DisclosureRoot>;
  TriggerProps: ComponentProps<typeof DisclosureTrigger>;
};

export type {
  DisclosureBodyContentProps,
  DisclosureContentProps,
  DisclosureHeadingProps,
  DisclosureIndicatorProps,
  DisclosureRootProps,
  DisclosureRootProps as DisclosureProps,
  DisclosureTriggerProps,
  DisclosureVariants,
} from "./disclosure";
export {
  DisclosureBody,
  DisclosureContent,
  DisclosureHeading,
  DisclosureIndicator,
  DisclosureRoot,
  DisclosureTrigger,
  disclosureVariants,
} from "./disclosure";
