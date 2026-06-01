// Component export

// Re-export primitive context and value types for consumer convenience
export type {
  SliderContextValue,
  SliderOrientation,
  SliderRenderProps,
  SliderState,
  SliderValue,
} from "../../primitives/slider/slider.types";
// Component-level type exports
export type {
  SliderFillProps,
  SliderOutputProps,
  SliderProps,
  SliderThumbAnimation,
  SliderThumbProps,
  SliderTrackProps,
} from "./slider";
export {
  default,
  Slider,
  sliderClassNames,
  useSlider,
} from "./slider";
