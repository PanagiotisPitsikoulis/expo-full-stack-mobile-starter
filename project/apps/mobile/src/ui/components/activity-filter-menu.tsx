import type { ReactNode } from "react";
import {
  ACTIVITY_FILTER_CATEGORIES,
  type ActivityCategory,
  type ActivityFilters,
} from "../../lib/api/travel";
import { ActionMenu, type ActionMenuAction } from "./action-menu";

type ActivityFilterMenuAction = { kind: "category"; value: ActivityCategory } | { kind: "clear" };

const ACTION_IDS: Record<string, ActivityFilterMenuAction> = Object.fromEntries([
  ...ACTIVITY_FILTER_CATEGORIES.map(({ id }) => [
    `activity-filter-category-${id}`,
    { kind: "category", value: id },
  ]),
  ["activity-filter-clear", { kind: "clear" }],
]);

export function ActivityFilterMenu({
  children,
  filters,
  onChange,
  onClear,
}: {
  children: ReactNode;
  filters: ActivityFilters;
  onChange: (next: Partial<ActivityFilters>) => void;
  onClear: () => void;
}) {
  const actions: ActionMenuAction[] = [
    {
      displayInline: true,
      id: "activity-filter-category-section",
      subactions: ACTIVITY_FILTER_CATEGORIES.map(({ id, label }) => ({
        id: `activity-filter-category-${id}`,
        state: filters.categories.includes(id) ? "on" : "off",
        title: label,
      })),
      title: "Activity type",
    },
    {
      destructive: true,
      disabled: filters.categories.length === 0,
      id: "activity-filter-clear",
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
          case "category": {
            const selected = filters.categories.includes(action.value);
            onChange({
              categories: selected
                ? filters.categories.filter((category) => category !== action.value)
                : [...filters.categories, action.value],
            });
            return;
          }
          case "clear":
            onClear();
        }
      }}
      title="Activity filters"
    >
      {children}
    </ActionMenu>
  );
}
