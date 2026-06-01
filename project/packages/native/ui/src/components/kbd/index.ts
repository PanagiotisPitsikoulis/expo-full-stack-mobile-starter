import type { ComponentProps } from "react";

import { KbdAbbr, KbdContent, KbdRoot } from "./kbd";

export const Kbd = Object.assign(KbdRoot, {
  Abbr: KbdAbbr,
  Content: KbdContent,
  Root: KbdRoot,
});

export type Kbd = {
  AbbrProps: ComponentProps<typeof KbdAbbr>;
  ContentProps: ComponentProps<typeof KbdContent>;
  Props: ComponentProps<typeof KbdRoot>;
  RootProps: ComponentProps<typeof KbdRoot>;
};

export type {
  KbdAbbrProps,
  KbdContentProps,
  KbdRootProps,
  KbdRootProps as KbdProps,
  KbdVariants,
} from "./kbd";
export { KbdAbbr, KbdContent, KbdRoot, kbdVariants } from "./kbd";
export type { KbdKey } from "./kbd.constants";
export { kbdKeysLabelMap, kbdKeysMap } from "./kbd.constants";
