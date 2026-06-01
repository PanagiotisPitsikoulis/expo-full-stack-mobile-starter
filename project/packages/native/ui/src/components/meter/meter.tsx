import type { ComponentProps, ElementRef, ForwardRefExoticComponent, RefAttributes } from "react";

import {
  ProgressBarFill,
  type ProgressBarFillProps,
  ProgressBarOutput,
  type ProgressBarOutputProps,
  ProgressBarRoot,
  type ProgressBarRootProps,
  ProgressBarTrack,
  type ProgressBarTrackProps,
  type ProgressBarVariants,
  progressBarVariants,
} from "../progress-bar";

export interface MeterRootProps extends Omit<ProgressBarRootProps, "isIndeterminate"> {}
export interface MeterTrackProps extends ProgressBarTrackProps {}
export interface MeterFillProps extends ProgressBarFillProps {}
export interface MeterOutputProps extends ProgressBarOutputProps {}
export type MeterVariants = ProgressBarVariants;

const MeterRoot = ProgressBarRoot as ForwardRefExoticComponent<
  MeterRootProps & RefAttributes<ElementRef<typeof ProgressBarRoot>>
>;
const MeterTrack = ProgressBarTrack;
const MeterFill = ProgressBarFill;
const MeterOutput = ProgressBarOutput;
const meterVariants = progressBarVariants;

export const Meter = Object.assign(MeterRoot, {
  Fill: MeterFill,
  Output: MeterOutput,
  Root: MeterRoot,
  Track: MeterTrack,
});

export type Meter = {
  FillProps: ComponentProps<typeof MeterFill>;
  OutputProps: ComponentProps<typeof MeterOutput>;
  Props: ComponentProps<typeof MeterRoot>;
  RootProps: ComponentProps<typeof MeterRoot>;
  TrackProps: ComponentProps<typeof MeterTrack>;
};

export { MeterFill, MeterOutput, MeterRoot, MeterTrack, meterVariants };
