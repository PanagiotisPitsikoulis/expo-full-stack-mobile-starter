import type React from "react";
import { SafeAreaListener } from "react-native-safe-area-context";
import { Uniwind } from "uniwind";
import { useDevInfo } from "../../helpers/internal/hooks";
import { PortalHost } from "../../primitives/portal";
import { GlobalAnimationSettingsProvider } from "../animation-settings";
import { TextComponentProvider } from "../text-component/provider";
import { ToastProvider } from "../toast/provider";
import type { PitsiUINativeProviderProps } from "./types";

/**
 * PitsiUINativeProvider Component
 *
 * @description
 * Main provider component for PitsiUI Native that configures the application
 * with global settings. This component should wrap your entire application
 * or the section where you want to use PitsiUI Native components.
 *
 * Currently provides:
 * - Global animation settings
 * - Global text component configuration
 * - Toast notification system
 * - Portal management for overlays
 *
 * @param {PitsiUINativeProviderProps} props - Provider configuration props
 * @param {ReactNode} props.children - Child components to wrap
 * @param {PitsiUINativeConfig} [props.config] - Configuration object
 *
 */
const PitsiUINativeProvider: React.FC<PitsiUINativeProviderProps> = ({ children, config = {} }) => {
  const { textProps, toast, animation, devInfo } = config;

  useDevInfo(devInfo);

  // Determine if toast should be enabled and get props
  const isToastEnabled = toast !== false && toast !== "disabled";
  const toastProps = typeof toast === "object" ? toast : {};

  return (
    <SafeAreaListener
      onChange={({ insets }) => {
        Uniwind.updateInsets(insets);
      }}
    >
      <GlobalAnimationSettingsProvider animation={animation}>
        <TextComponentProvider value={{ textProps }}>
          {isToastEnabled ? (
            <ToastProvider {...toastProps}>
              {children}
              <PortalHost />
            </ToastProvider>
          ) : (
            <>
              {children}
              <PortalHost />
            </>
          )}
        </TextComponentProvider>
      </GlobalAnimationSettingsProvider>
    </SafeAreaListener>
  );
};

export default PitsiUINativeProvider;
