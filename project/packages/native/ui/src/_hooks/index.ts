import * as React from "react";
import { useColorScheme } from "react-native";

type Key = number | string;
type Selection = "all" | Set<Key>;

export interface ListOptions<T> {
  filter?: (item: T, filterText: string) => boolean;
  getKey?: (item: T) => Key;
  initialFilterText?: string;
  initialItems?: T[];
  initialSelectedKeys?: "all" | Iterable<Key>;
}

export interface ListData<T> {
  addKeysToSelection(keys: Selection): void;
  append(...values: T[]): void;
  filterText: string;
  getItem(key: Key): T | undefined;
  insert(index: number, ...values: T[]): void;
  insertAfter(key: Key, ...values: T[]): void;
  insertBefore(key: Key, ...values: T[]): void;
  items: T[];
  move(key: Key, toIndex: number): void;
  prepend(...values: T[]): void;
  remove(...keys: Key[]): void;
  removeKeysFromSelection(keys: Selection): void;
  removeSelectedItems(): void;
  selectedKeys: Selection;
  setFilterText(filterText: string): void;
  setSelectedKeys(keys: Selection): void;
}

export interface ListState<T> {
  filterText: string;
  items: T[];
  selectedKeys: Selection;
}

export interface UseOverlayStateProps {
  defaultOpen?: boolean;
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
}

export interface UseOverlayStateReturn {
  close(): void;
  readonly isOpen: boolean;
  open(): void;
  setOpen(isOpen: boolean): void;
  toggle(): void;
}

export type Theme = string;

function iterableToSelection(value?: "all" | Iterable<Key>): Selection {
  if (value === "all") {
    return "all";
  }

  return new Set(value ?? []);
}

function selectionToSet(value: Selection): Set<Key> {
  return value === "all" ? new Set<Key>() : new Set(value);
}

function resolveKey<T>(item: T, index: number, getKey?: (item: T) => Key): Key {
  if (getKey) {
    return getKey(item);
  }

  if (typeof item === "object" && item !== null && "id" in item) {
    const id = (item as { id?: unknown }).id;

    if (typeof id === "string" || typeof id === "number") {
      return id;
    }
  }

  return index;
}

export function createListActions<T, C>(_options?: { getKey?: (item: T) => Key }, _setState?: C) {
  return {};
}

export function useCSSVariable(
  _variableName: string,
  override?: string,
  _cache = true,
): string | undefined {
  return override;
}

export function useIsHydrated() {
  return true;
}

export const useIsomorphicLayoutEffect = React.useLayoutEffect;
export const useSafeLayoutEffect = React.useLayoutEffect;

export function useMeasuredHeight(_ref: React.RefObject<unknown>) {
  return { height: undefined as number | undefined };
}

export function useMediaQuery(
  _query: string,
  options: { defaultValue?: boolean; initializeWithValue?: boolean } = {},
): boolean {
  return options.defaultValue ?? false;
}

export function useIsMounted(): () => boolean {
  const isMounted = React.useRef(false);

  React.useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;
    };
  }, []);

  return React.useCallback(() => isMounted.current, []);
}

export function useOverlayState(props: UseOverlayStateProps = {}): UseOverlayStateReturn {
  const { defaultOpen = false, isOpen: controlledIsOpen, onOpenChange } = props;
  const [uncontrolledIsOpen, setUncontrolledIsOpen] = React.useState(defaultOpen);
  const isControlled = controlledIsOpen !== undefined;
  const isOpen = controlledIsOpen ?? uncontrolledIsOpen;

  const setOpen = React.useCallback(
    (nextOpen: boolean) => {
      onOpenChange?.(nextOpen);

      if (!isControlled) {
        setUncontrolledIsOpen(nextOpen);
      }
    },
    [isControlled, onOpenChange],
  );

  const open = React.useCallback(() => setOpen(true), [setOpen]);
  const close = React.useCallback(() => setOpen(false), [setOpen]);
  const toggle = React.useCallback(() => setOpen(!isOpen), [isOpen, setOpen]);

  return { close, isOpen, open, setOpen, toggle };
}

export function useTheme(defaultTheme: Theme = "system") {
  const colorScheme = useColorScheme();
  const [theme, setTheme] = React.useState<Theme>(() =>
    defaultTheme === "system" ? (colorScheme ?? "light") : defaultTheme,
  );

  React.useEffect(() => {
    if (defaultTheme === "system") {
      setTheme(colorScheme ?? "light");
    }
  }, [colorScheme, defaultTheme]);

  return { setTheme, theme };
}

export function useListData<T>(options: ListOptions<T> = {}): ListData<T> {
  const { filter, getKey, initialFilterText = "", initialItems = [] } = options;
  const [rawItems, setRawItems] = React.useState<T[]>(initialItems);
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(() =>
    iterableToSelection(options.initialSelectedKeys),
  );
  const [filterText, setFilterText] = React.useState(initialFilterText);

  const items = React.useMemo(
    () => (filter ? rawItems.filter((item) => filter(item, filterText)) : rawItems),
    [filter, filterText, rawItems],
  );

  const getItem = React.useCallback(
    (key: Key) => rawItems.find((item, index) => resolveKey(item, index, getKey) === key),
    [getKey, rawItems],
  );

  const insert = React.useCallback((index: number, ...values: T[]) => {
    setRawItems((current) => [
      ...current.slice(0, Math.max(0, index)),
      ...values,
      ...current.slice(Math.max(0, index)),
    ]);
  }, []);

  const remove = React.useCallback(
    (...keys: Key[]) => {
      const removals = new Set(keys);
      setRawItems((current) =>
        current.filter((item, index) => !removals.has(resolveKey(item, index, getKey))),
      );
    },
    [getKey],
  );

  const addKeysToSelection = React.useCallback((keys: Selection) => {
    setSelectedKeys((current) => {
      if (current === "all" || keys === "all") {
        return "all";
      }

      return new Set([...current, ...keys]);
    });
  }, []);

  const removeKeysFromSelection = React.useCallback((keys: Selection) => {
    setSelectedKeys((current) => {
      if (current === "all") {
        return keys === "all" ? new Set<Key>() : current;
      }

      if (keys === "all") {
        return new Set<Key>();
      }

      const next = selectionToSet(current);

      for (const key of keys) {
        next.delete(key);
      }

      return next;
    });
  }, []);

  return {
    addKeysToSelection,
    append: (...values) => setRawItems((current) => [...current, ...values]),
    filterText,
    getItem,
    insert,
    insertAfter: (key, ...values) => {
      const index = rawItems.findIndex(
        (item, itemIndex) => resolveKey(item, itemIndex, getKey) === key,
      );
      insert(index < 0 ? rawItems.length : index + 1, ...values);
    },
    insertBefore: (key, ...values) => {
      const index = rawItems.findIndex(
        (item, itemIndex) => resolveKey(item, itemIndex, getKey) === key,
      );
      insert(index < 0 ? 0 : index, ...values);
    },
    items,
    move: (key, toIndex) => {
      setRawItems((current) => {
        const fromIndex = current.findIndex(
          (item, itemIndex) => resolveKey(item, itemIndex, getKey) === key,
        );

        if (fromIndex < 0) {
          return current;
        }

        const next = [...current];
        const [item] = next.splice(fromIndex, 1);

        if (item === undefined) {
          return current;
        }

        next.splice(Math.max(0, toIndex), 0, item);

        return next;
      });
    },
    prepend: (...values) => setRawItems((current) => [...values, ...current]),
    remove,
    removeKeysFromSelection,
    removeSelectedItems: () => {
      if (selectedKeys === "all") {
        setRawItems([]);
      } else {
        remove(...selectedKeys);
      }
    },
    selectedKeys,
    setFilterText,
    setSelectedKeys,
  };
}
