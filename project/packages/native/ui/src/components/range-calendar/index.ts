import type { ComponentProps } from "react";

import {
  CalendarYearPickerCell,
  CalendarYearPickerGrid,
  CalendarYearPickerGridBody,
  CalendarYearPickerTrigger,
  CalendarYearPickerTriggerHeading,
  CalendarYearPickerTriggerIndicator,
  RangeCalendarCell,
  RangeCalendarCellIndicator,
  RangeCalendarGrid,
  RangeCalendarGridBody,
  RangeCalendarGridHeader,
  RangeCalendarHeader,
  RangeCalendarHeaderCell,
  RangeCalendarHeading,
  RangeCalendarNavButton,
  RangeCalendarRoot,
  rangeCalendarVariants,
  useYearPicker,
  useYearPickerState,
  YearPickerContext,
  YearPickerStateContext,
} from "./range-calendar";

export const RangeCalendar = Object.assign(RangeCalendarRoot, {
  Cell: RangeCalendarCell,
  CellIndicator: RangeCalendarCellIndicator,
  Grid: RangeCalendarGrid,
  GridBody: RangeCalendarGridBody,
  GridHeader: RangeCalendarGridHeader,
  Header: RangeCalendarHeader,
  HeaderCell: RangeCalendarHeaderCell,
  Heading: RangeCalendarHeading,
  NavButton: RangeCalendarNavButton,
  Root: RangeCalendarRoot,
  YearPickerCell: CalendarYearPickerCell,
  YearPickerGrid: CalendarYearPickerGrid,
  YearPickerGridBody: CalendarYearPickerGridBody,
  YearPickerTrigger: CalendarYearPickerTrigger,
  YearPickerTriggerHeading: CalendarYearPickerTriggerHeading,
  YearPickerTriggerIndicator: CalendarYearPickerTriggerIndicator,
});

export type RangeCalendar = {
  CellIndicatorProps: ComponentProps<typeof RangeCalendarCellIndicator>;
  CellProps: ComponentProps<typeof RangeCalendarCell>;
  GridBodyProps: ComponentProps<typeof RangeCalendarGridBody>;
  GridHeaderProps: ComponentProps<typeof RangeCalendarGridHeader>;
  GridProps: ComponentProps<typeof RangeCalendarGrid>;
  HeaderCellProps: ComponentProps<typeof RangeCalendarHeaderCell>;
  HeaderProps: ComponentProps<typeof RangeCalendarHeader>;
  HeadingProps: ComponentProps<typeof RangeCalendarHeading>;
  NavButtonProps: ComponentProps<typeof RangeCalendarNavButton>;
  Props: ComponentProps<typeof RangeCalendarRoot>;
  RootProps: ComponentProps<typeof RangeCalendarRoot>;
};

export type {
  RangeCalendarCellIndicatorProps,
  RangeCalendarCellProps,
  RangeCalendarGridBodyProps,
  RangeCalendarGridHeaderProps,
  RangeCalendarGridProps,
  RangeCalendarHeaderCellProps,
  RangeCalendarHeaderProps,
  RangeCalendarHeadingProps,
  RangeCalendarNavButtonProps,
  RangeCalendarRootProps,
  RangeCalendarRootProps as RangeCalendarProps,
  RangeCalendarVariants,
  YearPickerContextValue,
  YearPickerStateContextValue,
} from "./range-calendar";

export {
  RangeCalendarCell,
  RangeCalendarCellIndicator,
  RangeCalendarGrid,
  RangeCalendarGridBody,
  RangeCalendarGridHeader,
  RangeCalendarHeader,
  RangeCalendarHeaderCell,
  RangeCalendarHeading,
  RangeCalendarNavButton,
  RangeCalendarRoot,
  rangeCalendarVariants,
  useYearPicker,
  useYearPickerState,
  YearPickerContext,
  YearPickerStateContext,
};
