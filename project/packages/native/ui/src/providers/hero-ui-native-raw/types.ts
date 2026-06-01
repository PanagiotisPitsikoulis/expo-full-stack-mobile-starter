import type { ReactNode } from "react";
import type { PitsiUINativeConfig } from "../pitsi-ui-native/types";

/**
 * Configuration object for PitsiUINativeProviderRaw
 *
 * @description
 * A subset of {@link PitsiUINativeConfig} containing only the configuration
 * options supported by the raw provider.
 */
export type PitsiUINativeConfigRaw = Pick<
  PitsiUINativeConfig,
  "textProps" | "animation" | "devInfo"
>;

/**
 * Props for PitsiUINativeProviderRaw component
 *
 * @interface PitsiUINativeProviderRawProps
 *
 * @description
 * Props for the raw variant of the provider that includes only
 * a subset of functionality from {@link PitsiUINativeProviderProps}.
 */
export interface PitsiUINativeProviderRawProps {
  /**
   * Child components to render within the raw provider
   */
  children: ReactNode;

  /**
   * Configuration object for the raw provider
   *
   * @description
   * A subset of configuration options supported by the raw provider.
   * See {@link PitsiUINativeConfigRaw} for available options.
   */
  config?: PitsiUINativeConfigRaw;
}
