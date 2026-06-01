import {
  CalendarCell,
  CalendarCellIndicator,
  type CalendarCellIndicatorProps,
  type CalendarCellProps,
  CalendarGrid,
  CalendarGridBody,
  type CalendarGridBodyProps,
  CalendarGridHeader,
  type CalendarGridHeaderProps,
  type CalendarGridProps,
  CalendarHeader,
  CalendarHeaderCell,
  type CalendarHeaderCellProps,
  type CalendarHeaderProps,
  CalendarHeading,
  type CalendarHeadingProps,
  CalendarNavButton,
  type CalendarNavButtonProps,
  CalendarRoot,
  type CalendarRootProps,
  type CalendarVariants,
  CalendarYearPickerCell,
  CalendarYearPickerGrid,
  CalendarYearPickerGridBody,
  CalendarYearPickerTrigger,
  CalendarYearPickerTriggerHeading,
  CalendarYearPickerTriggerIndicator,
  calendarVariants,
  useYearPicker,
  useYearPickerState,
  YearPickerContext,
  type YearPickerContextValue,
  YearPickerStateContext,
  type YearPickerStateContextValue,
} from "../calendar";

export type RangeCalendarRootProps = CalendarRootProps;
export type RangeCalendarHeaderProps = CalendarHeaderProps;
export type RangeCalendarHeadingProps = CalendarHeadingProps;
export type RangeCalendarNavButtonProps = CalendarNavButtonProps;
export type RangeCalendarGridProps = CalendarGridProps;
export type RangeCalendarGridHeaderProps = CalendarGridHeaderProps;
export type RangeCalendarGridBodyProps = CalendarGridBodyProps;
export type RangeCalendarHeaderCellProps = CalendarHeaderCellProps;
export type RangeCalendarCellProps = CalendarCellProps;
export type RangeCalendarCellIndicatorProps = CalendarCellIndicatorProps;
export type RangeCalendarVariants = CalendarVariants;

export const RangeCalendarRoot = CalendarRoot;
export const RangeCalendarHeader = CalendarHeader;
export const RangeCalendarHeading = CalendarHeading;
export const RangeCalendarNavButton = CalendarNavButton;
export const RangeCalendarGrid = CalendarGrid;
export const RangeCalendarGridHeader = CalendarGridHeader;
export const RangeCalendarGridBody = CalendarGridBody;
export const RangeCalendarHeaderCell = CalendarHeaderCell;
export const RangeCalendarCell = CalendarCell;
export const RangeCalendarCellIndicator = CalendarCellIndicator;
export const rangeCalendarVariants = calendarVariants;

export type { YearPickerContextValue, YearPickerStateContextValue };
export {
  CalendarYearPickerCell,
  CalendarYearPickerGrid,
  CalendarYearPickerGridBody,
  CalendarYearPickerTrigger,
  CalendarYearPickerTriggerHeading,
  CalendarYearPickerTriggerIndicator,
  useYearPicker,
  useYearPickerState,
  YearPickerContext,
  YearPickerStateContext,
};
