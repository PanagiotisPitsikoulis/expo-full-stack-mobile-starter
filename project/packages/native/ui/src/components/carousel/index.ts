import type { ComponentProps } from "react";

import {
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselRoot,
} from "./carousel";

export const Carousel = Object.assign(CarouselRoot, {
  Content: CarouselContent,
  Item: CarouselItem,
  Next: CarouselNext,
  Previous: CarouselPrevious,
  Root: CarouselRoot,
});

export type Carousel = {
  ContentProps: ComponentProps<typeof CarouselContent>;
  ItemProps: ComponentProps<typeof CarouselItem>;
  NextProps: ComponentProps<typeof CarouselNext>;
  PreviousProps: ComponentProps<typeof CarouselPrevious>;
  Props: ComponentProps<typeof CarouselRoot>;
  RootProps: ComponentProps<typeof CarouselRoot>;
};

export type {
  CarouselApi,
  CarouselContentProps,
  CarouselItemProps,
  CarouselNextProps,
  CarouselPreviousProps,
  CarouselRootProps,
  CarouselRootProps as CarouselProps,
  CarouselVariants,
} from "./carousel";

export {
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselRoot,
  carouselVariants,
} from "./carousel";
