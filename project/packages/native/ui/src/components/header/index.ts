import type { ComponentProps } from "react";

import { HeaderRoot } from "./header";

export const Header = HeaderRoot;

export type Header = {
  Props: ComponentProps<typeof HeaderRoot>;
};

export type { HeaderRootProps, HeaderRootProps as HeaderProps } from "./header";
export { HeaderRoot, headerVariants } from "./header";
