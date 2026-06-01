/**
 * Native barrel for the shared travel domain.
 *
 * Re-exports the platform-agnostic @repo/airbnb-core domain, then layers the
 * native overlay (stay-key image resolution + remote gallery URLs). The
 * overlay's `imageSrc` intentionally shadows the core's pure passthrough.
 */
export * from "@repo/airbnb-core/domain";
export { galleryImages, imageSrc } from "./native-overlay";
