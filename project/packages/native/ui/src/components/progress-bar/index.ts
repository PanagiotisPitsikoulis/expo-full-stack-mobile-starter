import type { ComponentProps } from "react";

import {
  ProgressBarFill,
  ProgressBarOutput,
  ProgressBarRoot,
  ProgressBarTrack,
} from "./progress-bar";

export const ProgressBar = Object.assign(ProgressBarRoot, {
  Fill: ProgressBarFill,
  Output: ProgressBarOutput,
  Root: ProgressBarRoot,
  Track: ProgressBarTrack,
});

export type ProgressBar = {
  FillProps: ComponentProps<typeof ProgressBarFill>;
  OutputProps: ComponentProps<typeof ProgressBarOutput>;
  Props: ComponentProps<typeof ProgressBarRoot>;
  RootProps: ComponentProps<typeof ProgressBarRoot>;
  TrackProps: ComponentProps<typeof ProgressBarTrack>;
};

export type {
  ProgressBarFillProps,
  ProgressBarOutputProps,
  ProgressBarRootProps,
  ProgressBarRootProps as ProgressBarProps,
  ProgressBarTrackProps,
  ProgressBarVariants,
} from "./progress-bar";
export {
  ProgressBarFill,
  ProgressBarOutput,
  ProgressBarRoot,
  ProgressBarTrack,
  progressBarVariants,
} from "./progress-bar";
