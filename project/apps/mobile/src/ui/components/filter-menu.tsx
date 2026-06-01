import type { ReactNode } from "react";
import type { HomeTag, StayFilters, StayPlaceType } from "../../lib/api/travel";
import { ActionMenu, type ActionMenuAction } from "./action-menu";

const PLACE_TYPES: Array<[StayPlaceType, string]> = [
  ["any", "Any type"],
  ["room", "Room"],
  ["entire", "Entire home"],
];

type PricePreset = {
  id: string;
  priceMax: number | null;
  priceMin: number | null;
  title: string;
};

const PRICE_PRESETS: PricePreset[] = [
  { id: "any", priceMax: null, priceMin: null, title: "Any price" },
  { id: "under-100", priceMax: 100, priceMin: null, title: "Under $100" },
  { id: "100-200", priceMax: 200, priceMin: 100, title: "$100 – $200" },
  { id: "200-500", priceMax: 500, priceMin: 200, title: "$200 – $500" },
  { id: "500-plus", priceMax: null, priceMin: 500, title: "$500+" },
];

type CountPreset = { id: string; title: string; value: number };

const GUEST_PRESETS: CountPreset[] = [
  { id: "any", title: "Any", value: 0 },
  { id: "1", title: "1+", value: 1 },
  { id: "2", title: "2+", value: 2 },
  { id: "4", title: "4+", value: 4 },
  { id: "6", title: "6+", value: 6 },
  { id: "8", title: "8+", value: 8 },
];

const BED_PRESETS: CountPreset[] = [
  { id: "any", title: "Any", value: 0 },
  { id: "1", title: "1+", value: 1 },
  { id: "2", title: "2+", value: 2 },
  { id: "3", title: "3+", value: 3 },
  { id: "4", title: "4+", value: 4 },
];

const BATH_PRESETS: CountPreset[] = [
  { id: "any", title: "Any", value: 0 },
  { id: "1", title: "1+", value: 1 },
  { id: "2", title: "2+", value: 2 },
  { id: "3", title: "3+", value: 3 },
];

const TAG_OPTIONS: Array<[HomeTag, string]> = [
  ["beach", "Beach"],
  ["mountain", "Mountain"],
  ["city", "City"],
  ["countryside", "Countryside"],
  ["pool", "Pool"],
  ["family", "Family"],
  ["romantic", "Romantic"],
  ["remote-work", "Remote work"],
  ["budget", "Budget"],
  ["luxury", "Luxury"],
  ["pet-friendly", "Pet friendly"],
  ["design", "Design"],
];

const AMENITY_OPTIONS = ["Kitchen", "Wifi", "TV", "Washer", "Iron", "Free parking"] as const;

function activePricePreset(filters: StayFilters): PricePreset {
  return (
    PRICE_PRESETS.find(
      (preset) => preset.priceMin === filters.priceMin && preset.priceMax === filters.priceMax,
    ) ?? PRICE_PRESETS[0]
  );
}

function activeCountPreset(presets: CountPreset[], current: number): CountPreset {
  return presets.find((preset) => preset.value === current) ?? presets[0];
}

function toggleInArray<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

type FilterMenuAction =
  | { kind: "place"; value: StayPlaceType }
  | { kind: "price"; preset: PricePreset }
  | { kind: "guests"; preset: CountPreset }
  | { kind: "beds"; preset: CountPreset }
  | { kind: "baths"; preset: CountPreset }
  | { kind: "tag"; value: HomeTag }
  | { kind: "amenity"; value: string }
  | { kind: "instantBook" }
  | { kind: "clear" };

function buildActionIds(): Record<string, FilterMenuAction> {
  const entries: Array<[string, FilterMenuAction]> = [
    ...PLACE_TYPES.map(
      ([value]) =>
        [`filter-place-${value}`, { kind: "place" as const, value }] as [string, FilterMenuAction],
    ),
    ...PRICE_PRESETS.map(
      (preset) =>
        [`filter-price-${preset.id}`, { kind: "price" as const, preset }] as [
          string,
          FilterMenuAction,
        ],
    ),
    ...GUEST_PRESETS.map(
      (preset) =>
        [`filter-guests-${preset.id}`, { kind: "guests" as const, preset }] as [
          string,
          FilterMenuAction,
        ],
    ),
    ...BED_PRESETS.map(
      (preset) =>
        [`filter-beds-${preset.id}`, { kind: "beds" as const, preset }] as [
          string,
          FilterMenuAction,
        ],
    ),
    ...BATH_PRESETS.map(
      (preset) =>
        [`filter-baths-${preset.id}`, { kind: "baths" as const, preset }] as [
          string,
          FilterMenuAction,
        ],
    ),
    ...TAG_OPTIONS.map(
      ([value]) =>
        [`filter-tag-${value}`, { kind: "tag" as const, value }] as [string, FilterMenuAction],
    ),
    ...AMENITY_OPTIONS.map(
      (value) =>
        [`filter-amenity-${value}`, { kind: "amenity" as const, value }] as [
          string,
          FilterMenuAction,
        ],
    ),
    ["filter-instant-book", { kind: "instantBook" }],
    ["filter-clear", { kind: "clear" }],
  ];
  return Object.fromEntries(entries);
}

const ACTION_IDS = buildActionIds();

export function FilterMenu({
  children,
  count,
  filters,
  onChange,
  onClear,
}: {
  children: ReactNode;
  count: number;
  filters: StayFilters;
  onChange: (next: Partial<StayFilters>) => void;
  onClear: () => void;
}) {
  const price = activePricePreset(filters);
  const guests = activeCountPreset(GUEST_PRESETS, filters.minGuests);
  const beds = activeCountPreset(BED_PRESETS, filters.minBeds);
  const baths = activeCountPreset(BATH_PRESETS, filters.minBaths);
  const tagCount = filters.tags.length;
  const amenityCount = filters.amenities.length;

  const actions: ActionMenuAction[] = [
    {
      displayInline: true,
      id: "filter-place-section",
      subactions: PLACE_TYPES.map(([value, label]) => ({
        id: `filter-place-${value}`,
        state: filters.placeType === value ? "on" : "off",
        title: label,
      })),
      title: "Type of place",
    },
    {
      id: "filter-price",
      subactions: PRICE_PRESETS.map((preset) => ({
        id: `filter-price-${preset.id}`,
        state: price.id === preset.id ? "on" : "off",
        title: preset.title,
      })),
      title: `Price · ${price.title}`,
    },
    {
      id: "filter-guests",
      subactions: GUEST_PRESETS.map((preset) => ({
        id: `filter-guests-${preset.id}`,
        state: guests.id === preset.id ? "on" : "off",
        title: preset.title,
      })),
      title: `Guests · ${guests.title}`,
    },
    {
      id: "filter-beds",
      subactions: BED_PRESETS.map((preset) => ({
        id: `filter-beds-${preset.id}`,
        state: beds.id === preset.id ? "on" : "off",
        title: preset.title,
      })),
      title: `Beds · ${beds.title}`,
    },
    {
      id: "filter-baths",
      subactions: BATH_PRESETS.map((preset) => ({
        id: `filter-baths-${preset.id}`,
        state: baths.id === preset.id ? "on" : "off",
        title: preset.title,
      })),
      title: `Baths · ${baths.title}`,
    },
    {
      id: "filter-tags",
      subactions: TAG_OPTIONS.map(([value, label]) => ({
        id: `filter-tag-${value}`,
        state: filters.tags.includes(value) ? "on" : "off",
        title: label,
      })),
      title: tagCount > 0 ? `Vibes · ${tagCount}` : "Vibes",
    },
    {
      id: "filter-amenities",
      subactions: AMENITY_OPTIONS.map((value) => ({
        id: `filter-amenity-${value}`,
        state: filters.amenities.includes(value) ? "on" : "off",
        title: value,
      })),
      title: amenityCount > 0 ? `Amenities · ${amenityCount}` : "Amenities",
    },
    {
      id: "filter-instant-book",
      state: filters.instantBook ? "on" : "off",
      title: "Superhost only",
    },
    {
      destructive: true,
      disabled: count === 0,
      id: "filter-clear",
      title: "Clear all",
    },
  ];

  return (
    <ActionMenu
      actions={actions}
      onAction={(id) => {
        const action = ACTION_IDS[id];
        if (!action) return;
        switch (action.kind) {
          case "place":
            onChange({ placeType: action.value });
            return;
          case "price":
            onChange({ priceMax: action.preset.priceMax, priceMin: action.preset.priceMin });
            return;
          case "guests":
            onChange({ minGuests: action.preset.value });
            return;
          case "beds":
            onChange({ minBeds: action.preset.value });
            return;
          case "baths":
            onChange({ minBaths: action.preset.value });
            return;
          case "tag":
            onChange({ tags: toggleInArray(filters.tags, action.value) });
            return;
          case "amenity":
            onChange({ amenities: toggleInArray(filters.amenities, action.value) });
            return;
          case "instantBook":
            onChange({ instantBook: !filters.instantBook });
            return;
          case "clear":
            onClear();
        }
      }}
      title="Filters"
    >
      {children}
    </ActionMenu>
  );
}
