import { CalendarYearPicker } from "@pitsi-ui/native/calendar-year-picker";

const years = Array.from({ length: 12 }, (_, index) => 2021 + index);

export function Basic() {
  return (
    <CalendarYearPicker className="w-[292px] rounded-2xl border border-border bg-background p-3">
      <CalendarYearPicker.Trigger>
        <CalendarYearPicker.TriggerHeading>2026</CalendarYearPicker.TriggerHeading>
        <CalendarYearPicker.TriggerIndicator />
      </CalendarYearPicker.Trigger>
      <CalendarYearPicker.Grid>
        <CalendarYearPicker.GridBody>
          {years.map((year) => (
            <CalendarYearPicker.Cell key={year} selected={year === 2026} year={year}>
              {year}
            </CalendarYearPicker.Cell>
          ))}
        </CalendarYearPicker.GridBody>
      </CalendarYearPicker.Grid>
    </CalendarYearPicker>
  );
}
