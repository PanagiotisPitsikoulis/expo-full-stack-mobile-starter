import type { ReactNode } from "react";
import { ActionMenu, type ActionMenuAction } from "./action-menu";

export type TheatreFilters = {
  countries: string[];
  genres: string[];
};

export const defaultTheatreFilters: TheatreFilters = {
  countries: [],
  genres: [],
};

function toggle<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

export function isTheatreFiltersActive(filters: TheatreFilters): boolean {
  return filters.countries.length > 0 || filters.genres.length > 0;
}

type Action =
  | { kind: "country"; value: string }
  | { kind: "genre"; value: string }
  | { kind: "clear" };

export function TheatreFilterMenu({
  availableCountries,
  availableGenres,
  children,
  filters,
  onChange,
  onClear,
}: {
  availableCountries: string[];
  availableGenres: string[];
  children: ReactNode;
  filters: TheatreFilters;
  onChange: (next: Partial<TheatreFilters>) => void;
  onClear: () => void;
}) {
  const actionIds: Record<string, Action> = Object.fromEntries([
    ...availableCountries.map((value) => [
      `theatre-filter-country-${value}`,
      { kind: "country" as const, value },
    ]),
    ...availableGenres.map((value) => [
      `theatre-filter-genre-${value}`,
      { kind: "genre" as const, value },
    ]),
    ["theatre-filter-clear", { kind: "clear" as const }],
  ]);

  const actions: ActionMenuAction[] = [
    {
      id: "theatre-filter-country-section",
      subactions: availableCountries.map((value) => ({
        id: `theatre-filter-country-${value}`,
        state: filters.countries.includes(value) ? "on" : "off",
        title: value,
      })),
      title: filters.countries.length > 0 ? `Country · ${filters.countries.length}` : "Country",
    },
    {
      id: "theatre-filter-genre-section",
      subactions: availableGenres.map((value) => ({
        id: `theatre-filter-genre-${value}`,
        state: filters.genres.includes(value) ? "on" : "off",
        title: value,
      })),
      title: filters.genres.length > 0 ? `Genre · ${filters.genres.length}` : "Genre",
    },
    {
      destructive: true,
      disabled: !isTheatreFiltersActive(filters),
      id: "theatre-filter-clear",
      title: "Clear all",
    },
  ];

  return (
    <ActionMenu
      actions={actions}
      onAction={(id) => {
        const action = actionIds[id];
        if (!action) return;
        switch (action.kind) {
          case "country":
            onChange({ countries: toggle(filters.countries, action.value) });
            return;
          case "genre":
            onChange({ genres: toggle(filters.genres, action.value) });
            return;
          case "clear":
            onClear();
        }
      }}
      title="Theatre filters"
    >
      {children}
    </ActionMenu>
  );
}
