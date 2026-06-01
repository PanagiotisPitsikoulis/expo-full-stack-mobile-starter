import { RangeCalendar } from "@pitsi-ui/native/range-calendar";

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const days = Array.from({ length: 35 }, (_, index) => index + 1);

export function Basic() {
  return (
    <RangeCalendar className="w-[292px] border border-border">
      <RangeCalendar.Header>
        <RangeCalendar.NavButton slot="previous" />
        <RangeCalendar.Heading>May 2026</RangeCalendar.Heading>
        <RangeCalendar.NavButton slot="next" />
      </RangeCalendar.Header>
      <RangeCalendar.Grid>
        <RangeCalendar.GridHeader>
          {weekdays.map((day) => (
            <RangeCalendar.HeaderCell key={day}>{day}</RangeCalendar.HeaderCell>
          ))}
        </RangeCalendar.GridHeader>
        <RangeCalendar.GridBody>
          {days.map((day) => (
            <RangeCalendar.Cell
              date={{ day, month: 5, toString: () => `2026-05-${day}`, year: 2026 }}
              key={day}
              selected={day >= 12 && day <= 18}
            />
          ))}
        </RangeCalendar.GridBody>
      </RangeCalendar.Grid>
    </RangeCalendar>
  );
}

export function WithYearPicker() {
  return (
    <RangeCalendar className="w-[292px] border border-border">
      <RangeCalendar.Header>
        <RangeCalendar.YearPickerTrigger>
          <RangeCalendar.YearPickerTriggerHeading>2026</RangeCalendar.YearPickerTriggerHeading>
          <RangeCalendar.YearPickerTriggerIndicator />
        </RangeCalendar.YearPickerTrigger>
      </RangeCalendar.Header>
      <RangeCalendar.YearPickerGrid>
        <RangeCalendar.YearPickerGridBody>
          {({ year }) => (
            <RangeCalendar.YearPickerCell selected={year === 2026} year={year}>
              {year}
            </RangeCalendar.YearPickerCell>
          )}
        </RangeCalendar.YearPickerGridBody>
      </RangeCalendar.YearPickerGrid>
    </RangeCalendar>
  );
}
