import type { Home, ListingItem, ListingSection, NearbyActivity } from "@repo/airbnb-core/domain";
import { homeToListingItem, isHomeAvailableForRange } from "@repo/airbnb-core/domain";
import type { RealEventPayload, SearchForm, TravelMapEvent } from "@repo/airbnb-core/store";

export type CustomerTripTab = "country" | "city" | "checkIn" | "checkOut" | "who";

export type CalendarView = {
  month1: number;
  year: number;
};

export const CUSTOMER_TRIP_TABS: Array<[CustomerTripTab, string]> = [
  ["country", "Country"],
  ["city", "City"],
  ["checkIn", "Check in"],
  ["checkOut", "Check out"],
  ["who", "Who"],
];

export const CUSTOMER_TRIP_TAB_TITLES: Record<CustomerTripTab, string> = {
  country: "Where",
  city: "Where",
  checkIn: "When",
  checkOut: "When",
  who: "Who",
};

export const CUSTOMER_TRIP_TAB_LABELS: Record<CustomerTripTab, string> = {
  country: "Country",
  city: "City",
  checkIn: "Check in",
  checkOut: "Check out",
  who: "Who",
};

export const FLEXIBLE_DESTINATION = "I'm flexible";

export function regionOptions(countries: readonly string[]): string[] {
  return [FLEXIBLE_DESTINATION, ...countries];
}

export function isRegionActive(destination: string, region: string): boolean {
  return destination.trim().toLowerCase() === region.toLowerCase();
}

export function tabSummary(
  tab: CustomerTripTab,
  form: { checkIn: string; checkOut: string; destination: string; guests: number },
): string {
  switch (tab) {
    case "country":
      return "Pick country";
    case "city":
      return form.destination.trim() || "Anywhere";
    case "checkIn":
      return form.checkIn ? formatShortDate(form.checkIn) : "Add date";
    case "checkOut":
      return form.checkOut ? formatShortDate(form.checkOut) : "Add date";
    case "who":
      return form.guests > 0 ? `${form.guests} guest${form.guests === 1 ? "" : "s"}` : "Add guests";
  }
}

const SHORT_MONTHS = [
  "jan",
  "feb",
  "mar",
  "apr",
  "may",
  "jun",
  "jul",
  "aug",
  "sep",
  "oct",
  "nov",
  "dec",
];

function parseIso(iso: string): { day: number; month1: number; year: number } | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) return null;
  return { day: Number(match[3]), month1: Number(match[2]), year: Number(match[1]) };
}

export function formatShortDate(iso: string): string {
  const parsed = parseIso(iso);
  if (!parsed) return iso;
  return `${parsed.day} / ${SHORT_MONTHS[parsed.month1 - 1]}`;
}

export function formatShortRange(checkIn: string, checkOut: string): string {
  const start = parseIso(checkIn);
  const end = parseIso(checkOut);
  if (start && end) {
    if (start.month1 === end.month1 && start.year === end.year) {
      return `${start.day} - ${end.day} / ${SHORT_MONTHS[start.month1 - 1]}`;
    }
    return `${formatShortDate(checkIn)} - ${formatShortDate(checkOut)}`;
  }
  if (start) return formatShortDate(checkIn);
  if (end) return formatShortDate(checkOut);
  return "";
}

export function tabUnlocked(
  target: CustomerTripTab,
  form: { checkIn: string; checkOut: string; destination: string; guests: number },
): boolean {
  if (target === "country" || target === "city") return true;
  if (target === "checkIn") return form.destination.trim().length > 0;
  if (target === "checkOut") return form.destination.trim().length > 0 && Boolean(form.checkIn);
  return form.destination.trim().length > 0 && Boolean(form.checkIn) && Boolean(form.checkOut);
}

export function nextTab(tab: CustomerTripTab): CustomerTripTab | null {
  const index = CUSTOMER_TRIP_TABS.findIndex(([id]) => id === tab);
  const next = CUSTOMER_TRIP_TABS[index + 1];
  return next ? next[0] : null;
}

function isoFromDate(date: Date): string {
  return toIso(date.getFullYear(), date.getMonth() + 1, date.getDate());
}

function addDaysToDate(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export function defaultCustomerTripForm(): {
  checkIn: string;
  checkOut: string;
  destination: string;
  guests: number;
} {
  const today = new Date();
  return {
    checkIn: isoFromDate(today),
    checkOut: isoFromDate(addDaysToDate(today, 3)),
    destination: FLEXIBLE_DESTINATION,
    guests: 1,
  };
}

export function tabIndex(tab: CustomerTripTab): number {
  return CUSTOMER_TRIP_TABS.findIndex(([id]) => id === tab);
}

export const CUSTOMER_TRIP_WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const MONTH_LABELS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export type CalendarDay = {
  day: number;
  iso: string;
  month: number;
  toString: () => string;
  year: number;
};

export function addMonths(
  year: number,
  month1: number,
  delta: number,
): { month1: number; year: number } {
  const zeroBased = month1 - 1 + delta;
  const nextYear = year + Math.floor(zeroBased / 12);
  const nextMonth = ((zeroBased % 12) + 12) % 12;
  return { month1: nextMonth + 1, year: nextYear };
}

export function monthLabel(year: number, month1: number): string {
  return `${MONTH_LABELS[month1 - 1]} ${year}`;
}

export function leadingBlanks(year: number, month1: number): number {
  return new Date(year, month1 - 1, 1).getDay();
}

function toIso(year: number, month1: number, day: number): string {
  const mm = String(month1).padStart(2, "0");
  const dd = String(day).padStart(2, "0");
  return `${year}-${mm}-${dd}`;
}

function daysInMonth(year: number, month1: number): number {
  return new Date(year, month1, 0).getDate();
}

export function monthDays(year: number, month1: number): CalendarDay[] {
  const count = daysInMonth(year, month1);
  return Array.from({ length: count }, (_, index) => {
    const day = index + 1;
    const iso = toIso(year, month1, day);
    return { day, iso, month: month1, toString: () => iso, year };
  });
}

export function nextRange(
  current: { checkIn: string; checkOut: string },
  iso: string,
): { checkIn: string; checkOut: string } {
  const { checkIn, checkOut } = current;
  if (!checkIn || (checkIn && checkOut)) {
    return { checkIn: iso, checkOut: "" };
  }
  if (iso < checkIn) {
    return { checkIn: iso, checkOut: "" };
  }
  if (iso === checkIn) {
    return { checkIn, checkOut: "" };
  }
  return { checkIn, checkOut: iso };
}

export function isRangeStart(iso: string, checkIn: string): boolean {
  return Boolean(checkIn) && iso === checkIn;
}

export function isRangeEnd(iso: string, checkOut: string): boolean {
  return Boolean(checkOut) && iso === checkOut;
}

export function isWithinRange(iso: string, checkIn: string, checkOut: string): boolean {
  if (!checkIn || !checkOut) return false;
  return iso > checkIn && iso < checkOut;
}

export function hasDestination(form: SearchForm | null | undefined): form is SearchForm {
  return Boolean(form?.destination.trim());
}

function normalize(value: string | null | undefined): string {
  return value?.trim().toLowerCase() ?? "";
}

const destinationAliases: Record<string, string[]> = {
  bali: ["ubud", "canggu", "nusa penida", "nusa lembongan", "indonesia"],
};

function destinationAreas(destination: string): string[] {
  return [destination, ...(destinationAliases[destination] ?? [])];
}

function includesArea(value: string | null | undefined, area: string): boolean {
  const normalized = normalize(value);
  return Boolean(normalized) && (normalized.includes(area) || area.includes(normalized));
}

function matchesAnyArea(value: string | null | undefined, areas: string[]): boolean {
  return areas.some((area) => includesArea(value, area));
}

export function homeMatchesTrip(home: Home, form: SearchForm): boolean {
  const area = normalize(form.destination);
  if (!area) return false;
  if (form.guests && home.guests < form.guests) return false;
  if (!isHomeAvailableForRange(home, form.checkIn, form.checkOut)) return false;

  if (area === normalize(FLEXIBLE_DESTINATION)) return true;
  const areas = destinationAreas(area);

  return (
    matchesAnyArea(home.city, areas) ||
    matchesAnyArea(home.country, areas) ||
    matchesAnyArea(home.neighborhood, areas)
  );
}

export function homeMatchesDestination(home: Home, form: SearchForm): boolean {
  const area = normalize(form.destination);
  if (!area) return false;
  if (area === normalize(FLEXIBLE_DESTINATION)) return true;
  const areas = destinationAreas(area);

  return (
    matchesAnyArea(home.city, areas) ||
    matchesAnyArea(home.country, areas) ||
    matchesAnyArea(home.neighborhood, areas)
  );
}

export function filterHomesForTrip(homes: Home[], form: SearchForm | null): Home[] {
  if (!hasDestination(form)) return [];
  return homes.filter((home) => homeMatchesTrip(home, form));
}

export function filterHomesForDestination(homes: Home[], form: SearchForm | null): Home[] {
  if (!hasDestination(form)) return [];
  return homes.filter((home) => homeMatchesDestination(home, form));
}

function scopedCitySet(homes: Home[]): Set<string> {
  return new Set(homes.map((home) => normalize(home.city)).filter(Boolean));
}

export function activityMatchesTrip(
  activity: NearbyActivity,
  scopedHomes: Home[],
  form: SearchForm | null,
): boolean {
  if (!hasDestination(form)) return false;
  const area = normalize(form.destination);
  if (area === normalize(FLEXIBLE_DESTINATION)) return true;
  const cities = scopedCitySet(scopedHomes);
  const areas = destinationAreas(area);

  return (
    cities.has(normalize(activity.city)) ||
    matchesAnyArea(activity.city, areas) ||
    matchesAnyArea(activity.area, areas) ||
    matchesAnyArea(activity.title, areas)
  );
}

export function filterActivitiesForTrip(
  activities: NearbyActivity[],
  scopedHomes: Home[],
  form: SearchForm | null,
): NearbyActivity[] {
  return activities.filter((activity) => activityMatchesTrip(activity, scopedHomes, form));
}

export function eventMatchesTrip(
  event: RealEventPayload,
  scopedHomes: Home[],
  form: SearchForm | null,
): boolean {
  if (!hasDestination(form)) return false;
  const area = normalize(form.destination);
  if (area === normalize(FLEXIBLE_DESTINATION)) return true;
  const cities = scopedCitySet(scopedHomes);
  const areas = destinationAreas(area);

  return (
    cities.has(normalize(event.city)) ||
    matchesAnyArea(event.city, areas) ||
    matchesAnyArea(event.country, areas) ||
    matchesAnyArea(event.venue, areas) ||
    matchesAnyArea(event.address, areas) ||
    matchesAnyArea(event.title, areas)
  );
}

export function filterEventsForTrip(
  events: RealEventPayload[],
  scopedHomes: Home[],
  form: SearchForm | null,
): RealEventPayload[] {
  return events.filter((event) => eventMatchesTrip(event, scopedHomes, form));
}

export function rowsForHomes(homes: Home[]): ListingSection[] {
  const cityOrder = Array.from(new Set(homes.map((home) => home.city)));
  return cityOrder.map((city) => ({
    title: `Stays in ${city}`,
    items: homes.filter((home) => home.city === city).map((home) => homeToListingItem(home)),
  }));
}

export function filterActivityRowsForTrip({
  activities,
  events,
  rows,
}: {
  activities: NearbyActivity[];
  events: RealEventPayload[];
  rows: ListingSection[];
}): ListingSection[] {
  const activityIds = new Set(activities.map((activity) => activity.id));
  const eventIds = new Set(events.map((event) => event.id));

  return rows
    .map((section) => ({
      ...section,
      items: section.items.filter((item: ListingItem) => {
        const id = item[4];
        return Boolean(id && (activityIds.has(id) || eventIds.has(id)));
      }),
    }))
    .filter((section) => section.items.length > 0);
}

export function countRows(rows: ListingSection[]): number {
  return rows.reduce((total, row) => total + row.items.length, 0);
}

export function routeHasTripResults({
  activityRows,
  homes,
  mapEvents,
  route,
}: {
  activityRows: ListingSection[];
  homes: Home[];
  mapEvents: TravelMapEvent[];
  route: "ai" | "homes" | "activities" | "map";
}): boolean {
  if (route === "activities") return countRows(activityRows) > 0;
  if (route === "map") return homes.length + mapEvents.length > 0;
  if (route === "ai") return homes.length + countRows(activityRows) > 0;
  return homes.length > 0;
}
