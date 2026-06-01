import type { ComponentProps } from "react";

import {
  CalendarYearPickerCell,
  CalendarYearPickerGrid,
  CalendarYearPickerGridBody,
  CalendarYearPickerProvider,
  CalendarYearPickerRoot,
  CalendarYearPickerTrigger,
  CalendarYearPickerTriggerHeading,
  CalendarYearPickerTriggerIndicator,
  calendarYearPickerVariants,
  useYearPicker,
  useYearPickerState,
  YearPickerContext,
  YearPickerStateContext,
} from "./calendar-year-picker";

export const CalendarYearPicker = Object.assign(CalendarYearPickerRoot, {
  Cell: CalendarYearPickerCell,
  Grid: CalendarYearPickerGrid,
  GridBody: CalendarYearPickerGridBody,
  Provider: CalendarYearPickerProvider,
  Root: CalendarYearPickerRoot,
  Trigger: CalendarYearPickerTrigger,
  TriggerHeading: CalendarYearPickerTriggerHeading,
  TriggerIndicator: CalendarYearPickerTriggerIndicator,
});

export type CalendarYearPicker = {
  CellProps: ComponentProps<typeof CalendarYearPickerCell>;
  GridBodyProps: ComponentProps<typeof CalendarYearPickerGridBody>;
  GridProps: ComponentProps<typeof CalendarYearPickerGrid>;
  Props: ComponentProps<typeof CalendarYearPickerRoot>;
  ProviderProps: ComponentProps<typeof CalendarYearPickerProvider>;
  RootProps: ComponentProps<typeof CalendarYearPickerRoot>;
  TriggerHeadingProps: ComponentProps<typeof CalendarYearPickerTriggerHeading>;
  TriggerIndicatorProps: ComponentProps<typeof CalendarYearPickerTriggerIndicator>;
  TriggerProps: ComponentProps<typeof CalendarYearPickerTrigger>;
};

export type {
  CalendarYearPickerCellProps,
  CalendarYearPickerCellRenderProps,
  CalendarYearPickerGridBodyProps,
  CalendarYearPickerGridProps,
  CalendarYearPickerRootProps,
  CalendarYearPickerTriggerHeadingProps,
  CalendarYearPickerTriggerIndicatorProps,
  CalendarYearPickerTriggerProps,
  CalendarYearPickerTriggerRenderProps,
  CalendarYearPickerVariants,
  YearPickerContextValue,
  YearPickerStateContextValue,
} from "./calendar-year-picker";

export {
  CalendarYearPickerCell,
  CalendarYearPickerGrid,
  CalendarYearPickerGridBody,
  CalendarYearPickerProvider,
  CalendarYearPickerRoot,
  CalendarYearPickerTrigger,
  CalendarYearPickerTriggerHeading,
  CalendarYearPickerTriggerIndicator,
  calendarYearPickerVariants,
  useYearPicker,
  useYearPickerState,
  YearPickerContext,
  YearPickerStateContext,
};
