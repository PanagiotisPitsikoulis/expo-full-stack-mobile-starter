export type PreviewBg = "dotted" | "grid" | "solid" | "transparent";
export type PreviewPadding = "default" | "loose" | "tight";
export type PreviewAlign = "center" | "end" | "start";
export type PreviewSize = "fullscreen" | "large" | "medium" | "small";

export interface PreviewMeta {
  align?: PreviewAlign;
  autoOpen?: boolean;
  bg?: PreviewBg;
  firstOnly?: boolean;
  minHeight?: number | string;
  padding?: PreviewPadding;
  screenshotWidth?: number | string;
  size?: PreviewSize;
  zoom?: number;
}

export const DEFAULT_META: PreviewMeta = {
  align: "center",
  bg: "transparent",
  padding: "default",
  size: "small",
};

export const SCREENSHOT_BASE_ZOOM_BY_SIZE: Record<PreviewSize, number> = {
  fullscreen: 0.45,
  large: 0.85,
  medium: 1.4,
  small: 2.3,
};

export const componentMeta: Record<string, PreviewMeta> = {};
export const demoMeta: Record<string, PreviewMeta> = {};

function compact<T extends object>(obj: T): Partial<T> {
  const out = {} as Partial<T>;

  for (const key of Object.keys(obj) as (keyof T)[]) {
    if (obj[key] !== undefined) {
      out[key] = obj[key];
    }
  }

  return out;
}

export function resolvePreviewMeta(
  demoName: string,
  componentName: string | undefined,
  callSite: PreviewMeta = {},
): Required<Pick<PreviewMeta, "align" | "bg" | "padding" | "size">> & PreviewMeta {
  const merged: PreviewMeta = {
    ...DEFAULT_META,
    ...(componentName ? compact(componentMeta[componentName] ?? {}) : {}),
    ...compact(demoMeta[demoName] ?? {}),
    ...compact(callSite),
  };

  return merged as Required<Pick<PreviewMeta, "align" | "bg" | "padding" | "size">> & PreviewMeta;
}

export function resolveScreenshotZoom(componentName: string, zoomOverride: null | number): number {
  if (zoomOverride !== null && Number.isFinite(zoomOverride)) {
    return zoomOverride;
  }

  const meta = componentMeta[componentName];
  const size = meta?.size ?? "small";
  const base = SCREENSHOT_BASE_ZOOM_BY_SIZE[size];

  return base * (meta?.zoom ?? 1);
}

export function componentNameFromFile(file: string | undefined): string | undefined {
  if (!file) return undefined;
  const segment = file.split("/")[0];

  return segment && segment.length > 0 ? segment : undefined;
}
