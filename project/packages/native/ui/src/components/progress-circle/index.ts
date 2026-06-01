import type { ComponentProps } from "react";

import {
  ProgressCircleFillCircle,
  ProgressCircleRoot,
  ProgressCircleTrack,
  ProgressCircleTrackCircle,
} from "./progress-circle";

export const ProgressCircle = Object.assign(ProgressCircleRoot, {
  FillCircle: ProgressCircleFillCircle,
  Root: ProgressCircleRoot,
  Track: ProgressCircleTrack,
  TrackCircle: ProgressCircleTrackCircle,
});

export type ProgressCircle = {
  FillCircleProps: ComponentProps<typeof ProgressCircleFillCircle>;
  Props: ComponentProps<typeof ProgressCircleRoot>;
  RootProps: ComponentProps<typeof ProgressCircleRoot>;
  TrackCircleProps: ComponentProps<typeof ProgressCircleTrackCircle>;
  TrackProps: ComponentProps<typeof ProgressCircleTrack>;
};

export type {
  ProgressCircleFillCircleProps,
  ProgressCircleRootProps,
  ProgressCircleRootProps as ProgressCircleProps,
  ProgressCircleTrackCircleProps,
  ProgressCircleTrackProps,
  ProgressCircleVariants,
} from "./progress-circle";
export {
  ProgressCircleFillCircle,
  ProgressCircleRoot,
  ProgressCircleTrack,
  ProgressCircleTrackCircle,
  progressCircleVariants,
} from "./progress-circle";
