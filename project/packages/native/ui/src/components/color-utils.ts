export type ColorValue =
  | string
  | {
      hex?: string;
      toHex?: () => string;
      toString?: () => string;
    };

export function colorString(value?: ColorValue) {
  if (!value) return "transparent";
  if (typeof value === "string") return value;
  if (typeof value.toHex === "function") return value.toHex();
  if (typeof value.hex === "string") return value.hex;
  if (typeof value.toString === "function") return value.toString();
  return "transparent";
}
