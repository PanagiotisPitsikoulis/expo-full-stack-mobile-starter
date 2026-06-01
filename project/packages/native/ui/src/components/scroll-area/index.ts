import type { ComponentProps } from "react";

import { ScrollAreaRoot, ScrollAreaViewport } from "./scroll-area";

export const ScrollArea = Object.assign(ScrollAreaRoot, {
  Root: ScrollAreaRoot,
  Viewport: ScrollAreaViewport,
});

export type ScrollArea = {
  Props: ComponentProps<typeof ScrollAreaRoot>;
  RootProps: ComponentProps<typeof ScrollAreaRoot>;
  ViewportProps: ComponentProps<typeof ScrollAreaViewport>;
};

export type {
  ScrollAreaRootProps,
  ScrollAreaRootProps as ScrollAreaProps,
  ScrollAreaVariants,
  ScrollAreaViewportProps,
} from "./scroll-area";
export { ScrollAreaRoot, ScrollAreaViewport, scrollAreaVariants } from "./scroll-area";
