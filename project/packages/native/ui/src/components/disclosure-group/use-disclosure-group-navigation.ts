import { useMemo } from "react";

import type { DisclosureKey } from "./disclosure-group";

export type UseDisclosureGroupNavigationProps = {
  expandedKeys: Set<DisclosureKey>;
  itemIds: DisclosureKey[];
  onExpandedChange: (keys: Set<DisclosureKey>) => void;
};

export type UseDisclosureGroupNavigationReturn = {
  isNextDisabled: boolean;
  isPrevDisabled: boolean;
  onNext: () => void;
  onPrevious: () => void;
};

export function useDisclosureGroupNavigation({
  expandedKeys,
  itemIds,
  onExpandedChange,
}: UseDisclosureGroupNavigationProps): UseDisclosureGroupNavigationReturn {
  return useMemo(() => {
    const currentKey = Array.from(expandedKeys).at(-1);
    const currentIndex = currentKey === undefined ? -1 : itemIds.indexOf(currentKey);

    const setIndex = (index: number) => {
      const nextKey = itemIds[index];
      if (nextKey !== undefined) {
        onExpandedChange(new Set([nextKey]));
      }
    };

    return {
      isNextDisabled: currentIndex >= itemIds.length - 1,
      isPrevDisabled: currentIndex <= 0,
      onNext: () => setIndex(Math.min(itemIds.length - 1, currentIndex + 1)),
      onPrevious: () => setIndex(Math.max(0, currentIndex - 1)),
    };
  }, [expandedKeys, itemIds, onExpandedChange]);
}
