import type { ComponentProps } from "react";

import {
  EmptyStateContent,
  EmptyStateDescription,
  EmptyStateHeader,
  EmptyStateMedia,
  EmptyStateRoot,
  EmptyStateTitle,
} from "./empty-state";

export const EmptyState = Object.assign(EmptyStateRoot, {
  Content: EmptyStateContent,
  Description: EmptyStateDescription,
  Header: EmptyStateHeader,
  Media: EmptyStateMedia,
  Root: EmptyStateRoot,
  Title: EmptyStateTitle,
});

export type EmptyState = {
  ContentProps: ComponentProps<typeof EmptyStateContent>;
  DescriptionProps: ComponentProps<typeof EmptyStateDescription>;
  HeaderProps: ComponentProps<typeof EmptyStateHeader>;
  MediaProps: ComponentProps<typeof EmptyStateMedia>;
  Props: ComponentProps<typeof EmptyStateRoot>;
  RootProps: ComponentProps<typeof EmptyStateRoot>;
  TitleProps: ComponentProps<typeof EmptyStateTitle>;
};

export type {
  EmptyStateContentProps,
  EmptyStateDescriptionProps,
  EmptyStateHeaderProps,
  EmptyStateMediaProps,
  EmptyStateRootProps,
  EmptyStateRootProps as EmptyStateProps,
  EmptyStateTitleProps,
  EmptyStateVariants,
} from "./empty-state";
export {
  EmptyStateContent,
  EmptyStateDescription,
  EmptyStateHeader,
  EmptyStateMedia,
  EmptyStateRoot,
  EmptyStateTitle,
  emptyStateVariants,
} from "./empty-state";
