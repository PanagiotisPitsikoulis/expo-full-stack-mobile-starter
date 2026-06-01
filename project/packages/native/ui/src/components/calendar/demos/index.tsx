import { Calendar } from "@pitsi-ui/native/calendar";

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const days = Array.from({ length: 35 }, (_, index) => index + 1);

export function Basic() {
  return (
    <Calendar className="w-[292px] border border-border">
      <Calendar.Header>
        <Calendar.NavButton slot="previous" />
        <Calendar.Heading>May 2026</Calendar.Heading>
        <Calendar.NavButton slot="next" />
      </Calendar.Header>
      <Calendar.Grid>
        <Calendar.GridHeader>
          {weekdays.map((day) => (
            <Calendar.HeaderCell key={day}>{day}</Calendar.HeaderCell>
          ))}
        </Calendar.GridHeader>
        <Calendar.GridBody>
          {days.map((day) => (
            <Calendar.Cell
              date={{ day, month: 5, toString: () => `2026-05-${day}`, year: 2026 }}
              key={day}
              selected={day === 27}
            />
          ))}
        </Calendar.GridBody>
      </Calendar.Grid>
    </Calendar>
  );
}

export function WithIndicators() {
  return (
    <Calendar className="w-[292px] border border-border">
      <Calendar.Header>
        <Calendar.Heading>May 2026</Calendar.Heading>
      </Calendar.Header>
      <Calendar.Grid>
        <Calendar.GridHeader>
          {weekdays.map((day) => (
            <Calendar.HeaderCell key={day}>{day}</Calendar.HeaderCell>
          ))}
        </Calendar.GridHeader>
        <Calendar.GridBody>
          {days.map((day) => (
            <Calendar.Cell
              date={{ day, month: 5, toString: () => `2026-05-${day}`, year: 2026 }}
              key={day}
              selected={day === 12 || day === 27}
            >
              {day}
              {(day === 12 || day === 27) && <Calendar.CellIndicator />}
            </Calendar.Cell>
          ))}
        </Calendar.GridBody>
      </Calendar.Grid>
    </Calendar>
  );
}
