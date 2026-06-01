import { forwardRef, useMemo, useRef } from "react";
import { type GestureResponderEvent, StyleSheet, View, type ViewStyle } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { useSharedValue, type WithSpringConfig } from "react-native-reanimated";
import { tv } from "tailwind-variants";

import { HeroText } from "../../helpers/internal/components";
import type { HeroTextProps } from "../../helpers/internal/components/hero-text";
import { AnimationSettingsProvider } from "../../helpers/internal/contexts";
import type {
  Animation,
  AnimationRootDisableAll,
  AnimationValue,
  ViewRef,
} from "../../helpers/internal/types";
import type { ElementSlots } from "../../helpers/internal/types/theme";
import { combineStyles } from "../../helpers/internal/utils";
import * as SliderPrimitives from "../../primitives/slider";
import { useSlider } from "../../primitives/slider";
import type {
  FillProps as PrimitiveFillProps,
  OutputProps as PrimitiveOutputProps,
  RootProps as PrimitiveRootProps,
  ThumbProps as PrimitiveThumbProps,
  TrackProps as PrimitiveTrackProps,
} from "../../primitives/slider/slider.types";
import { clamp } from "../../primitives/slider/slider.utils";
import { useSliderRootAnimation, useSliderThumbAnimation } from "./slider.animation";

/* -------------------------------------------------------------------------------------------------
 * Constants
 * -----------------------------------------------------------------------------------------------*/
/**
 * Display names for Slider components
 */
export const DISPLAY_NAME = {
  ROOT: "PitsiUI.Slider.Root",
  OUTPUT: "PitsiUI.Slider.Output",
  TRACK: "PitsiUI.Slider.Track",
  FILL: "PitsiUI.Slider.Fill",
  THUMB: "PitsiUI.Slider.Thumb",
};

/**
 * Extra hit-slop around the thumb to improve touch target
 */
export const THUMB_HIT_SLOP = 16;

/**
 * Spring animation configuration for thumb scale feedback
 */
export const THUMB_SPRING_CONFIG = {
  damping: 15,
  stiffness: 200,
  mass: 0.5,
};

/* -------------------------------------------------------------------------------------------------
 * Styles
 * -----------------------------------------------------------------------------------------------*/
const root = tv({
  base: "gap-2",
  variants: {
    orientation: {
      horizontal: "w-full",
      vertical: "h-full items-center",
    },
    isDisabled: {
      true: "opacity-disabled",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
    isDisabled: false,
  },
});

const output = tv({
  slots: {
    container: "",
    text: "text-sm text-muted font-medium",
  },
});

const track = tv({
  base: "rounded-xl bg-default",
  variants: {
    orientation: {
      horizontal: "w-full h-5 justify-center",
      vertical: "h-full w-5 items-center",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
  },
});

const fill = tv({
  base: "absolute rounded-xl bg-accent",
  variants: {
    orientation: {
      horizontal: "inset-y-0",
      vertical: "inset-x-0",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
  },
});

const thumb = tv({
  slots: {
    thumbContainer: "absolute p-[2px] bg-accent rounded-xl",
    thumbKnob: "flex-1 bg-accent-foreground rounded-xl shadow-field",
  },
  variants: {
    orientation: {
      horizontal: { thumbContainer: "w-7 h-5" },
      vertical: { thumbContainer: "w-5 h-7" },
    },
  },
  defaultVariants: {
    orientation: "horizontal",
  },
});

const sliderClassNames = combineStyles({
  root,
  output,
  track,
  fill,
  thumb,
});

export const styleSheet = StyleSheet.create({
  borderCurve: {
    borderCurve: "continuous",
  },
});

export type OutputSlots = keyof ReturnType<typeof output>;
export type ThumbSlots = keyof ReturnType<typeof thumb>;

export { sliderClassNames };

/* -------------------------------------------------------------------------------------------------
 * Types
 * -----------------------------------------------------------------------------------------------*/
/**
 * Props for the Slider root component.
 */
export interface SliderProps extends PrimitiveRootProps {
  className?: string;
  animation?: AnimationRootDisableAll;
}

/**
 * Props for the Slider.Output sub-component.
 */
export interface SliderOutputProps extends PrimitiveOutputProps {
  className?: string;
  classNames?: ElementSlots<OutputSlots>;
  textProps?: Omit<HeroTextProps, "children">;
}

/**
 * Props for the Slider.Track sub-component.
 */
export interface SliderTrackProps extends PrimitiveTrackProps {
  className?: string;
}

/**
 * Props for the Slider.Fill sub-component.
 */
export interface SliderFillProps extends PrimitiveFillProps {
  className?: string;
}

/**
 * Animation configuration for the Slider.Thumb knob scale effect.
 */
export type SliderThumbAnimation = Animation<{
  scale?: AnimationValue<{
    value?: [number, number];
    springConfig?: WithSpringConfig;
  }>;
}>;

/**
 * Props for the Slider.Thumb sub-component.
 */
export interface SliderThumbProps extends PrimitiveThumbProps {
  isDisabled?: boolean;
  animation?: SliderThumbAnimation;
  className?: string;
  classNames?: ElementSlots<ThumbSlots>;
  styles?: Partial<Record<ThumbSlots, ViewStyle>>;
}

/* -------------------------------------------------------------------------------------------------
 * Slider components
 * -----------------------------------------------------------------------------------------------*/
const AnimatedKnob = Animated.createAnimatedComponent(View);

// --------------------------------------------------

const SliderRoot = forwardRef<ViewRef, SliderProps>((props, ref) => {
  const {
    children,
    orientation = "horizontal",
    isDisabled = false,
    animation,
    className,
    style,
    ...primitiveProps
  } = props;

  const { isAllAnimationsDisabled } = useSliderRootAnimation({ animation });

  const animationSettingsContextValue = useMemo(
    () => ({
      isAllAnimationsDisabled,
    }),
    [isAllAnimationsDisabled],
  );

  const rootClassName = sliderClassNames.root({
    orientation,
    isDisabled,
    className,
  });

  return (
    <AnimationSettingsProvider value={animationSettingsContextValue}>
      <SliderPrimitives.Root
        ref={ref}
        orientation={orientation}
        isDisabled={isDisabled}
        className={rootClassName}
        style={style}
        {...primitiveProps}
      >
        {children}
      </SliderPrimitives.Root>
    </AnimationSettingsProvider>
  );
});

// --------------------------------------------------

const SliderOutput = forwardRef<ViewRef, SliderOutputProps>((props, ref) => {
  const { children, className, classNames, textProps, style, ...restProps } = props;

  const { className: textClassNameProps, ...restTextProps } = textProps ?? {};

  const { values, orientation, isDisabled, getThumbValueLabel } = useSlider();

  const { container: containerSlot, text: textSlot } = sliderClassNames.output();

  const containerClassName = containerSlot({
    className: [className, classNames?.container],
  });
  const textClassName = textSlot({
    className: [textClassNameProps, classNames?.text],
  });

  const defaultContent = values.map((_, i) => getThumbValueLabel(i)).join(" – ");

  const resolvedChildren =
    typeof children === "function"
      ? children({
          state: { values, getThumbValueLabel },
          orientation,
          isDisabled,
        })
      : children;

  return (
    <SliderPrimitives.Output ref={ref} className={containerClassName} style={style} {...restProps}>
      {resolvedChildren ?? (
        <HeroText className={textClassName} {...restTextProps}>
          {defaultContent}
        </HeroText>
      )}
    </SliderPrimitives.Output>
  );
});

// --------------------------------------------------

const SliderTrack = forwardRef<ViewRef, SliderTrackProps>((props, ref) => {
  const { children, className, style, hitSlop = 8, ...restProps } = props;

  const { minValue, maxValue, orientation, isDisabled, handleTapAtValue, trackSize, thumbSize } =
    useSlider();

  const trackClassName = sliderClassNames.track({
    orientation,
    className,
  });

  const handleTapRef = useRef(handleTapAtValue);
  handleTapRef.current = handleTapAtValue;

  const tapGesture = useMemo(() => {
    const effectiveTrackSize = trackSize - thumbSize;

    return Gesture.Tap()
      .runOnJS(true)
      .enabled(!isDisabled)
      .onEnd((event) => {
        if (effectiveTrackSize <= 0) return;

        const pos = orientation === "horizontal" ? event.x : event.y;
        const adjustedPos =
          orientation === "horizontal" ? pos - thumbSize / 2 : trackSize - pos - thumbSize / 2;

        const pct = clamp(adjustedPos / effectiveTrackSize, 0, 1);
        const rawValue = minValue + pct * (maxValue - minValue);
        handleTapRef.current(rawValue);
      });
  }, [trackSize, thumbSize, isDisabled, orientation, minValue, maxValue]);

  return (
    <GestureDetector gesture={tapGesture}>
      <SliderPrimitives.Track
        ref={ref}
        className={trackClassName}
        style={[styleSheet.borderCurve, style]}
        hitSlop={hitSlop}
        {...restProps}
      >
        {children}
      </SliderPrimitives.Track>
    </GestureDetector>
  );
});

// --------------------------------------------------

const SliderFill = forwardRef<ViewRef, SliderFillProps>((props, ref) => {
  const { className, style, ...restProps } = props;

  const { values, orientation, getThumbPercent, trackSize, thumbSize } = useSlider();

  const fillClassName = sliderClassNames.fill({ orientation, className });

  const isSingleThumb = values.length <= 1;
  const startPercent = isSingleThumb ? 0 : getThumbPercent(0);
  const endPercent = isSingleThumb ? getThumbPercent(0) : getThumbPercent(values.length - 1);

  const effectiveTrackSize = trackSize - thumbSize;

  const fillStyle = useMemo(() => {
    if (orientation === "horizontal") {
      const left = startPercent * effectiveTrackSize;
      const width = (endPercent - startPercent) * effectiveTrackSize + thumbSize;

      return {
        left,
        width: Math.max(width, thumbSize),
      };
    }

    const bottom = startPercent * effectiveTrackSize;
    const height = (endPercent - startPercent) * effectiveTrackSize + thumbSize;

    return {
      bottom,
      height: Math.max(height, thumbSize),
    };
  }, [orientation, startPercent, endPercent, effectiveTrackSize, thumbSize]);

  return (
    <SliderPrimitives.Fill
      ref={ref}
      className={fillClassName}
      style={[styleSheet.borderCurve, fillStyle, style]}
      {...restProps}
    />
  );
});

// --------------------------------------------------

const SliderThumb = forwardRef<ViewRef, SliderThumbProps>((props, ref) => {
  const {
    index = 0,
    isDisabled: thumbDisabled,
    animation,
    className,
    classNames,
    styles: stylesProp,
    style,
    hitSlop = 12,
    onTouchEnd,
    children,
    ...restProps
  } = props;

  const {
    values,
    minValue,
    maxValue,
    step,
    orientation,
    isDisabled: sliderDisabled,
    getThumbPercent,
    isThumbDragging,
    updateValue,
    setThumbDragging,
    trackSize,
    thumbSize,
  } = useSlider();

  const disabled = thumbDisabled ?? sliderDisabled;
  const isDragging = isThumbDragging(index);

  const { rKnobStyle } = useSliderThumbAnimation({
    animation,
    isDragging,
  });

  const { thumbContainer: containerSlot, thumbKnob: knobSlot } = sliderClassNames.thumb({
    orientation,
  });

  const thumbContainerClassName = containerSlot({
    className: [className, classNames?.thumbContainer],
  });
  const thumbKnobClassName = knobSlot({
    className: classNames?.thumbKnob,
  });

  const percent = getThumbPercent(index);
  const startValue = useSharedValue(0);

  const valuesRef = useRef(values);
  valuesRef.current = values;

  const updateValueRef = useRef(updateValue);
  updateValueRef.current = updateValue;

  const setThumbDraggingRef = useRef(setThumbDragging);
  setThumbDraggingRef.current = setThumbDragging;

  const panGesture = useMemo(() => {
    const effectiveTrackSize = trackSize - thumbSize;

    const gesture = Gesture.Pan()
      .runOnJS(true)
      .enabled(!disabled)
      .onBegin(() => {
        startValue.set(valuesRef.current[index] ?? minValue);
        setThumbDraggingRef.current(index, true);
      })
      .onUpdate((event) => {
        const delta = orientation === "horizontal" ? event.translationX : -event.translationY;
        const valueDelta =
          effectiveTrackSize > 0 ? (delta / effectiveTrackSize) * (maxValue - minValue) : 0;
        const newValue = clamp(startValue.get() + valueDelta, minValue, maxValue);
        const snapped = Math.round((newValue - minValue) / step) * step + minValue;
        const clampedSnapped = clamp(snapped, minValue, maxValue);
        updateValueRef.current(index, clampedSnapped);
      })
      .onFinalize(() => {
        setThumbDraggingRef.current(index, false);
      });

    return gesture;
  }, [disabled, index, minValue, maxValue, step, orientation, trackSize, thumbSize, startValue]);

  const positionStyle = useMemo(() => {
    const effectiveTrackSize = trackSize - thumbSize;
    const offset = percent * effectiveTrackSize;

    if (orientation === "horizontal") {
      return { left: offset };
    }
    return { bottom: offset };
  }, [percent, trackSize, thumbSize, orientation]);

  const handleTouchEnd = (event: GestureResponderEvent) => {
    setThumbDraggingRef.current(index, false);
    onTouchEnd?.(event);
  };

  return (
    <GestureDetector gesture={panGesture}>
      <SliderPrimitives.Thumb
        ref={ref}
        index={index}
        className={thumbContainerClassName}
        style={[styleSheet.borderCurve, positionStyle, stylesProp?.thumbContainer, style]}
        onTouchEnd={handleTouchEnd}
        hitSlop={hitSlop}
        {...restProps}
      >
        {children ?? (
          <AnimatedKnob
            className={thumbKnobClassName}
            style={[styleSheet.borderCurve, rKnobStyle, stylesProp?.thumbKnob]}
          />
        )}
      </SliderPrimitives.Thumb>
    </GestureDetector>
  );
});

// --------------------------------------------------

SliderRoot.displayName = DISPLAY_NAME.ROOT;
SliderOutput.displayName = DISPLAY_NAME.OUTPUT;
SliderTrack.displayName = DISPLAY_NAME.TRACK;
SliderFill.displayName = DISPLAY_NAME.FILL;
SliderThumb.displayName = DISPLAY_NAME.THUMB;

/**
 * Compound Slider component with sub-components
 *
 * @see Full documentation: https://pitsiui.com/docs/native/components/slider
 */
const CompoundSlider = Object.assign(SliderRoot, {
  /** @optional Value display with optional render function */
  Output: SliderOutput,
  /** @optional Sizing container for fill and thumbs, supports tap-to-position */
  Track: SliderTrack,
  /** @optional Responsive fill bar stretching full cross-axis */
  Fill: SliderFill,
  /** @optional Draggable thumb with gesture support, centered by Track alignment */
  Thumb: SliderThumb,
});

export { CompoundSlider as Slider, useSlider };
export default CompoundSlider;
