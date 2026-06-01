import type * as React from "react";
import type { LayoutChangeEvent, View, ViewStyle } from "react-native";

type PortalHostProps = {
  /** Host name that portals can target. */
  name?: string;
};

type PortalProps = {
  /** Stable portal instance name within the host. */
  name: string;
  /** Host name to render into. */
  hostName?: string;
  /** Portal content. */
  children: React.ReactNode;
};

type ModalPortalRootReturn = {
  /** Root view ref used to measure the portal offset. */
  ref: React.RefObject<View | null>;
  /** Negative top offset for modal-style overlays. */
  offset: number;
  /** Layout handler that refreshes the measured offset. */
  onLayout: (event: LayoutChangeEvent) => void;
  /** Root style for the measured portal container. */
  style: ViewStyle;
};

export type { ModalPortalRootReturn, PortalHostProps, PortalProps };
