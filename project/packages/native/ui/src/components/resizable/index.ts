import type { ComponentProps } from "react";

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "./resizable";

export const Resizable = Object.assign(ResizablePanelGroup, {
  Group: ResizablePanelGroup,
  Handle: ResizableHandle,
  Panel: ResizablePanel,
});

export type Resizable = {
  GroupProps: ComponentProps<typeof ResizablePanelGroup>;
  HandleProps: ComponentProps<typeof ResizableHandle>;
  PanelProps: ComponentProps<typeof ResizablePanel>;
  Props: ComponentProps<typeof ResizablePanelGroup>;
};

export type {
  ResizableHandleProps,
  ResizablePanelGroupProps,
  ResizablePanelGroupProps as ResizableProps,
  ResizablePanelProps,
  ResizableVariants,
} from "./resizable";
export {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
  resizableVariants,
} from "./resizable";
