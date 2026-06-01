import { type TV, tv as tvBase, type VariantProps } from "tailwind-variants";
import { cn } from "../helpers/external/utils";
import { createWebParityComponent } from "../helpers/web-parity";

export { cn, type VariantProps };

export type Dict<T = unknown> = Record<string, T>;
export type Booleanish = boolean | "false" | "true";
export type DOMRenderFunction = (props: Record<string, unknown>, renderProps: unknown) => unknown;

export interface DOMRenderProps {
  render?: DOMRenderFunction;
}

export function isArray<T>(value: unknown): value is Array<T> {
  return Array.isArray(value);
}

export function isEmptyArray(value: unknown) {
  return isArray(value) && value.length === 0;
}

export function isObject(value: unknown): value is Dict {
  const type = typeof value;

  return value !== null && (type === "object" || type === "function") && !isArray(value);
}

export function isEmptyObject(value: unknown) {
  return isObject(value) && Object.keys(value).length === 0;
}

export function isEmpty(value: unknown): boolean {
  if (isArray(value)) {
    return isEmptyArray(value);
  }

  if (isObject(value)) {
    return isEmptyObject(value);
  }

  return value == null || value === "";
}

export const dataAttr = (condition: boolean | undefined) =>
  (condition ? "true" : undefined) as Booleanish | undefined;

export const isNumeric = (value?: number | string) =>
  value != null && Number.parseInt(value.toString(), 10) > 0;

export function getGregorianYearOffset(identifier: string): number {
  switch (identifier) {
    case "buddhist":
      return 543;
    case "coptic":
      return -284;
    case "ethiopic":
    case "ethioaa":
      return -8;
    case "hebrew":
      return 3760;
    case "indian":
      return -78;
    case "islamic-civil":
    case "islamic-tbla":
    case "islamic-umalqura":
      return -579;
    case "persian":
      return -600;
    default:
      return 0;
  }
}

export function getYearRange<T>(start?: T | null, end?: T | null): T[] {
  if (!start || !end) {
    return [];
  }

  return [start, end].filter((value, index, values) => index === 0 || value !== values[0]);
}

export const disabledClasses = "";
export const focusRingClasses = "";
export const ariaDisabledClasses = "";

export function composeTwRenderProps<T>(
  className: string | ((value: T) => string) | undefined,
  tailwind?: string | ((value: T) => string | undefined),
): string | ((value: T) => string) {
  if (typeof className === "function" || typeof tailwind === "function") {
    return (value: T) =>
      cn(
        typeof tailwind === "function" ? tailwind(value) : tailwind,
        typeof className === "function" ? className(value) : className,
      ) ?? "";
  }

  return cn(tailwind, className) ?? "";
}

export const composeSlotClassName = (
  slotFn: ((args?: { className?: string; [key: string]: unknown }) => string) | undefined,
  className?: string,
  variants?: Record<string, unknown>,
): string | undefined =>
  typeof slotFn === "function" ? slotFn({ ...(variants ?? {}), className }) : className;

export const tv: TV = (options, config) =>
  tvBase(options, {
    ...config,
    twMerge: config?.twMerge ?? false,
  });

export const mapPropsVariants = <T extends Record<string, unknown>, K extends keyof T>(
  props: T,
  variantKeys?: K[],
  removeVariantProps = true,
): readonly [Omit<T, K> | T, Pick<T, K> | Record<string, never>] => {
  if (!variantKeys) {
    return [props, {}];
  }

  const picked = variantKeys.reduce<Partial<Pick<T, K>>>((acc, key) => {
    if (key in props) {
      acc[key] = props[key];
    }

    return acc;
  }, {});

  if (!removeVariantProps) {
    return [props, picked as Pick<T, K>];
  }

  const omitted = Object.keys(props)
    .filter((key) => !variantKeys.includes(key as K))
    .reduce<Partial<T>>((acc, key) => {
      const typedKey = key as keyof T;
      acc[typedKey] = props[typedKey];

      return acc;
    }, {});

  return [omitted as Omit<T, K>, picked as Pick<T, K>];
};

export function createVariantBuilder<T extends Record<string, string>>(baseClass: string) {
  return (
    config: { modifiers?: Record<string, boolean | undefined>; variants?: Partial<T> } = {},
  ) => {
    const classes = [baseClass];

    if (config.variants) {
      for (const value of Object.values(config.variants)) {
        if (value) {
          classes.push(`${baseClass}--${value}`);
        }
      }
    }

    if (config.modifiers) {
      for (const [modifier, enabled] of Object.entries(config.modifiers)) {
        if (enabled) {
          classes.push(`${baseClass}--${modifier}`);
        }
      }
    }

    return classes.join(" ");
  };
}

export interface VariantDefinition<V extends Record<string, readonly string[]>> {
  base: string;
  defaults?: Partial<{ [K in keyof V]: V[K][number] }>;
  variants: V;
}

export type VariantConfig<T extends Record<string, unknown>> = {
  base: string;
  modifiers?: Record<string, boolean | undefined>;
  variants?: T;
};

export function createVariants<V extends Record<string, readonly string[]>>(
  definition: VariantDefinition<V>,
) {
  type VariantProps = {
    [K in keyof V]?: V[K][number];
  } & {
    modifiers?: Record<string, boolean | undefined>;
  };

  return (props: VariantProps = {}) => {
    const classes = [definition.base];
    const mergedProps: Record<string, unknown> = {};

    if (definition.defaults) {
      for (const [key, value] of Object.entries(definition.defaults)) {
        mergedProps[key] = value;
      }
    }

    for (const [key, value] of Object.entries(props)) {
      if (value !== undefined) {
        mergedProps[key] = value;
      }
    }

    for (const [key, value] of Object.entries(mergedProps)) {
      if (key !== "modifiers" && value) {
        classes.push(`${definition.base}--${String(value)}`);
      }
    }

    if (props.modifiers) {
      for (const [modifier, enabled] of Object.entries(props.modifiers)) {
        if (enabled) {
          classes.push(`${definition.base}--${modifier}`);
        }
      }
    }

    return classes.join(" ");
  };
}

export type VariantPropsOf<T extends ReturnType<typeof createVariants>> = T extends (
  props: infer P,
) => string
  ? P
  : never;

export const dom = new Proxy(
  {},
  {
    get(_target, elementType) {
      if (typeof elementType !== "string") {
        return undefined;
      }

      return createWebParityComponent(`PitsiUINative.dom.${elementType}`);
    },
  },
) as Record<string, ReturnType<typeof createWebParityComponent>>;

export interface LoggerOptions {
  enabled?: boolean;
  prefix?: string;
}

export class Logger {
  private enabled: boolean;
  private prefix: string;

  constructor(options: LoggerOptions = {}) {
    this.enabled = options.enabled ?? true;
    this.prefix = options.prefix ?? "PitsiUI";
  }

  debug(message: string, ...args: unknown[]): void {
    this.log("debug", message, ...args);
  }

  divider(char = "=", length = 80): void {
    if (this.enabled) {
      console.log(char.repeat(length));
    }
  }

  error(message: string, ...args: unknown[]): void {
    this.log("error", message, ...args);
  }

  info(message: string, ...args: unknown[]): void {
    this.log("info", message, ...args);
  }

  newline(): void {
    if (this.enabled) {
      console.log();
    }
  }

  success(message: string, ...args: unknown[]): void {
    this.log("success", message, ...args);
  }

  warn(message: string, ...args: unknown[]): void {
    this.log("warn", message, ...args);
  }

  private log(
    level: "debug" | "error" | "info" | "success" | "warn",
    message: string,
    ...args: unknown[]
  ) {
    if (!this.enabled) {
      return;
    }

    const formatted = `[${this.prefix}] ${level}: ${message}`;

    if (level === "error") {
      console.error(formatted, ...args);
      return;
    }

    if (level === "warn") {
      console.warn(formatted, ...args);
      return;
    }

    console.log(formatted, ...args);
  }
}

export const logger = new Logger();
