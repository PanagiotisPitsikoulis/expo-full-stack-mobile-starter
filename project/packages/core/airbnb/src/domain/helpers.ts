import type { StaticImage } from "./types";

export function imageSrc(image: StaticImage) {
  return typeof image === "string" ? image : (image.src ?? "");
}
