import type { ComponentProps } from "react";

import { AspectRatioRoot } from "./aspect-ratio";

export const AspectRatio = Object.assign(AspectRatioRoot, {
  Root: AspectRatioRoot,
});

export type AspectRatio = {
  Props: ComponentProps<typeof AspectRatioRoot>;
  RootProps: ComponentProps<typeof AspectRatioRoot>;
};

export type {
  AspectRatioRootProps,
  AspectRatioRootProps as AspectRatioProps,
} from "./aspect-ratio";
export { AspectRatioRoot };
