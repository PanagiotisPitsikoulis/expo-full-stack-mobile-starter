import { Children, createElement, Fragment, type ReactNode } from "react";
import {
  Text as NativeText,
  Pressable,
  type PressableProps,
  ScrollView,
  type ScrollViewProps,
} from "react-native";

export type Key = string | number;
export type Selection = "all" | Set<Key>;
export type Direction = "bottom" | "left" | "right" | "top";
export type Orientation = "horizontal" | "vertical";
export type PressEvent = unknown;
export type SortDescriptor = { column?: Key; direction?: "ascending" | "descending" };
export type ValidationResult = { isInvalid: boolean; validationErrors: string[] };
export type RangeValue<T> = { end: T; start: T };
export type DateRange = RangeValue<unknown>;
export type DateValue = unknown;
export type TimeValue = unknown;
export type RouterConfig = Record<string, unknown>;
export type Color = unknown;
export type ColorAxes = Record<string, unknown>;
export type ColorChannel = string;
export type ColorChannelRange = { maxValue: number; minValue: number; step: number };
export type ColorFormat = string;
export type ColorSpace = string;
export type HoverEvent = unknown;
export type KeyboardEvent = unknown;
export type PointerType = "keyboard" | "mouse" | "pen" | "touch" | "virtual";

export interface CollectionProps extends ScrollViewProps {
  children?: ReactNode;
  className?: string;
}

export interface ListBoxLoadMoreItemProps extends Omit<PressableProps, "children" | "disabled"> {
  children?: ReactNode;
  className?: string;
  disabled?: boolean;
  isDisabled?: boolean;
  onAction?: () => void;
  onClick?: () => void;
}

function NativeCollection({ children, className, horizontal, ...props }: CollectionProps) {
  return createElement(
    ScrollView,
    { className, horizontal, ...props },
    Children.map(children, (child) => child),
  );
}

export const Collection = NativeCollection;
export const ListLayout = NativeCollection;
export const TableLayout = NativeCollection;
export const Virtualizer = NativeCollection;

export function I18nProvider({ children }: { children?: ReactNode }) {
  return createElement(Fragment, null, children);
}

export function RouterProvider({ children }: { children?: ReactNode }) {
  return createElement(Fragment, null, children);
}

export function getLocalizationScript() {
  return "";
}

export function isRTL(locale?: string) {
  return typeof locale === "string" && /^(ar|fa|he|ur)(-|$)/i.test(locale);
}

export function useFilter() {
  return {
    contains: (value: string, search: string) =>
      value.toLocaleLowerCase().includes(search.toLocaleLowerCase()),
    endsWith: (value: string, search: string) =>
      value.toLocaleLowerCase().endsWith(search.toLocaleLowerCase()),
    startsWith: (value: string, search: string) =>
      value.toLocaleLowerCase().startsWith(search.toLocaleLowerCase()),
  };
}

export function useLocale() {
  return {
    direction: "ltr" as const,
    locale: "en-US",
  };
}

export function ListBoxLoadMoreItem({
  children,
  className,
  disabled,
  isDisabled,
  onAction,
  onClick,
  onPress,
  ...props
}: ListBoxLoadMoreItemProps) {
  const resolvedDisabled = Boolean(disabled || isDisabled);

  return createElement(
    Pressable,
    {
      accessibilityRole: "button",
      accessibilityState: { disabled: resolvedDisabled },
      className: `min-h-11 items-center justify-center px-4 py-3 ${className ?? ""}`,
      disabled: resolvedDisabled,
      onPress: onPress ?? (onAction ? () => onAction() : onClick ? () => onClick() : undefined),
      ...props,
    },
    children ??
      createElement(NativeText, { className: "text-sm font-medium text-muted" }, "Load more"),
  );
}

export function parseColor(value: string) {
  return value;
}
