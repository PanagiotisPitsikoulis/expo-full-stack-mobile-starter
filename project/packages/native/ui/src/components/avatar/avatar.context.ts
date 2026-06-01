import { createContext } from "../../helpers/internal/utils";
import type { AvatarContextValue } from "./avatar";

/**
 * Avatar context provider and hook
 * Provides size, color, and animation state to child components
 */
export const [AvatarProvider, useInnerAvatarContext] = createContext<AvatarContextValue>({
  name: "AvatarContext",
});
