/**
 * Native overlay for the shared @repo/airbnb-core domain.
 *
 * Mirrors the web overlay's job, but for React Native: it resolves the portable
 * "stay-N" image keys to URLs served by the web app's /stays public folder, and
 * provides the gallery image list as remote URLs. Icons are handled in the
 * native UI by id (glyph/component), so they are not attached here.
 */
import type { StaticImage } from "@repo/airbnb-core/domain";
import { imageSrc as coreImageSrc } from "@repo/airbnb-core/domain";
import { type ImageSourcePropType, Image as NativeImage } from "react-native";
import stay1 from "../../../assets/stays/stay-1.jpg";
import stay2 from "../../../assets/stays/stay-2.jpg";
import stay3 from "../../../assets/stays/stay-3.jpg";
import stay4 from "../../../assets/stays/stay-4.jpg";
import stay5 from "../../../assets/stays/stay-5.jpg";
import stay6 from "../../../assets/stays/stay-6.jpg";
import stay7 from "../../../assets/stays/stay-7.jpg";
import stay8 from "../../../assets/stays/stay-8.jpg";
import { API_BASE_URL, resolveImageUrl } from "../client";

function asImageSource(source: unknown): ImageSourcePropType {
  return source as ImageSourcePropType;
}

const stayImageSources = {
  "stay-1": asImageSource(stay1),
  "stay-2": asImageSource(stay2),
  "stay-3": asImageSource(stay3),
  "stay-4": asImageSource(stay4),
  "stay-5": asImageSource(stay5),
  "stay-6": asImageSource(stay6),
  "stay-7": asImageSource(stay7),
  "stay-8": asImageSource(stay8),
};

const STAY_IMAGE_KEYS = new Set(Object.keys(stayImageSources));

function resolveStayKey(key: string): string {
  return `${API_BASE_URL}/stays/${key}.jpg`;
}

function resolveBundledStayKey(key: string): string {
  const source = stayImageSources[key as keyof typeof stayImageSources];
  return NativeImage.resolveAssetSource(source)?.uri ?? resolveStayKey(key);
}

/** Native image resolver: stay keys -> bundled assets; relative -> absolute; else passthrough. */
export function imageSrc(image: StaticImage): string {
  if (typeof image === "string") {
    if (STAY_IMAGE_KEYS.has(image)) return resolveBundledStayKey(image);
    return resolveImageUrl(image) ?? image;
  }
  return resolveImageUrl(coreImageSrc(image)) ?? "";
}

export const galleryImages: string[] = ["stay-2", "stay-7", "stay-6", "stay-4", "stay-8"].map(
  resolveBundledStayKey,
);
