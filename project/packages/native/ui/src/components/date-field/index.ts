import type { ComponentProps } from "react";

import {
  DateInputGroupInput,
  DateInputGroupInputContainer,
  DateInputGroupPrefix,
  DateInputGroupRoot,
  DateInputGroupSegment,
  DateInputGroupSuffix,
} from "../date-input-group";
import { DateFieldRoot, dateFieldVariants } from "./date-field";

export const DateField = Object.assign(DateFieldRoot, {
  Group: DateInputGroupRoot,
  Input: DateInputGroupInput,
  InputContainer: DateInputGroupInputContainer,
  Prefix: DateInputGroupPrefix,
  Root: DateFieldRoot,
  Segment: DateInputGroupSegment,
  Suffix: DateInputGroupSuffix,
});

export type DateField = {
  GroupProps: ComponentProps<typeof DateInputGroupRoot>;
  InputContainerProps: ComponentProps<typeof DateInputGroupInputContainer>;
  InputProps: ComponentProps<typeof DateInputGroupInput>;
  PrefixProps: ComponentProps<typeof DateInputGroupPrefix>;
  Props: ComponentProps<typeof DateFieldRoot>;
  RootProps: ComponentProps<typeof DateFieldRoot>;
  SegmentProps: ComponentProps<typeof DateInputGroupSegment>;
  SuffixProps: ComponentProps<typeof DateInputGroupSuffix>;
};

export type {
  DateFieldRootProps,
  DateFieldRootProps as DateFieldProps,
  DateFieldVariants,
} from "./date-field";

export { DateFieldRoot, dateFieldVariants };
