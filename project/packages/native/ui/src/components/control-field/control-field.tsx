import type React from "react";
import { cloneElement, forwardRef, useCallback, useMemo } from "react";
import {
  type GestureResponderEvent,
  Pressable,
  type PressableProps,
  View,
  type ViewProps,
} from "react-native";
import { type SharedValue, useSharedValue } from "react-native-reanimated";
import { tv } from "tailwind-variants";
import { AnimationSettingsProvider, FormFieldProvider } from "../../helpers/internal/contexts";
import { useCombinedAnimationDisabledState } from "../../helpers/internal/hooks";
import type { AnimationRootDisableAll, PressableRef } from "../../helpers/internal/types";
import { combineStyles, hasProp } from "../../helpers/internal/utils";
import { Checkbox } from "../checkbox";
import { Radio } from "../radio";
import { Switch } from "../switch";
import { ControlFieldProvider, useControlField } from "./control-field.context";

/* -------------------------------------------------------------------------------------------------
 * Constants
 * -----------------------------------------------------------------------------------------------*/
/**
 * Display names for ControlField components
 */
export const DISPLAY_NAME = {
  CONTROL_FIELD: "PitsiUINative.ControlField",
  CONTROL_FIELD_INDICATOR: "PitsiUINative.ControlField.Indicator",
} as const;

/* -------------------------------------------------------------------------------------------------
 * Types
 * -----------------------------------------------------------------------------------------------*/
/**
 * Render function props for control field children
 */
export type ControlFieldRenderProps = Pick<
  ControlFieldProps,
  "isSelected" | "isDisabled" | "isInvalid"
>;

/**
 * ControlField component props
 */
export interface ControlFieldProps extends Omit<PressableProps, "children"> {
  /** Content to render inside the form control, or a render function */
  children?: React.ReactNode | ((props: ControlFieldRenderProps) => React.ReactNode);

  /** Custom class name for the root element */
  className?: string;

  /** Whether the control is selected/checked @default undefined */
  isSelected?: boolean;

  /** Whether the form control is disabled @default false */
  isDisabled?: boolean;

  /** Whether the form control is invalid @default false */
  isInvalid?: boolean;

  /** Whether the form control is required @default false */
  isRequired?: boolean;

  /** Callback when selection state changes */
  onSelectedChange?: (isSelected: boolean) => void;

  /** Animation configuration. Use `"disable-all"` to disable all animations including children */
  animation?: AnimationRootDisableAll;
}

/**
 * Props for the ControlFieldIndicator component
 */
export interface ControlFieldIndicatorProps extends ViewProps {
  /** Control component to render (Switch, Checkbox) */
  children?: React.ReactNode;

  /** Custom class name for the indicator element */
  className?: string;

  /** Variant of the control to render when no children provided @default 'switch' */
  variant?: "checkbox" | "radio" | "switch";
}

/**
 * Context value for form control components
 */
export interface ControlFieldContextValue
  extends Pick<ControlFieldProps, "isSelected" | "onSelectedChange" | "isDisabled" | "isInvalid"> {
  isPressed: SharedValue<boolean>;
}

/* -------------------------------------------------------------------------------------------------
 * Styles
 * -----------------------------------------------------------------------------------------------*/
const root = tv({
  base: "flex-row items-center gap-3",
});

const indicator = tv({
  base: "",
});

export const controlFieldClassNames = combineStyles({
  root,
  indicator,
});

/* -------------------------------------------------------------------------------------------------
 * Utils (animation)
 * -----------------------------------------------------------------------------------------------*/
/**
 * Animation hook for ControlField root component
 * Handles root-level animation configuration and provides context for child components
 */
export function useControlFieldRootAnimation(options: {
  animation: AnimationRootDisableAll | undefined;
}) {
  const { animation } = options;

  const isAllAnimationsDisabled = useCombinedAnimationDisabledState(animation);

  return {
    isAllAnimationsDisabled,
  };
}

/* -------------------------------------------------------------------------------------------------
 * ControlField.Root
 * -----------------------------------------------------------------------------------------------*/
const ControlField = forwardRef<PressableRef, ControlFieldProps>((props, ref) => {
  const {
    children,
    className,
    isSelected,
    onSelectedChange,
    isDisabled = false,
    isInvalid = false,
    isRequired = false,
    onPressIn,
    onPressOut,
    animation,
    ...restProps
  } = props;

  const renderProps: ControlFieldRenderProps = useMemo(
    () => ({
      isSelected,
      isDisabled: isDisabled ?? false,
      isInvalid: isInvalid ?? false,
    }),
    [isSelected, isDisabled, isInvalid],
  );

  const content = typeof children === "function" ? children(renderProps) : children;

  const rootClassName = controlFieldClassNames.root({
    className,
  });

  const { isAllAnimationsDisabled } = useControlFieldRootAnimation({
    animation,
  });

  const animationSettingsContextValue = useMemo(
    () => ({
      isAllAnimationsDisabled,
    }),
    [isAllAnimationsDisabled],
  );

  const isPressed = useSharedValue<boolean>(false);

  const handlePress = (e: GestureResponderEvent) => {
    if (!isDisabled && onSelectedChange && isSelected !== undefined) {
      onSelectedChange(!isSelected);

      if (props.onPress && typeof props.onPress === "function") {
        props.onPress(e);
      }
    }
  };

  const handlePressIn = useCallback(
    (e: GestureResponderEvent) => {
      isPressed.set(true);
      if (onPressIn && typeof onPressIn === "function") {
        onPressIn(e);
      }
    },
    [isPressed, onPressIn],
  );

  const handlePressOut = useCallback(
    (e: GestureResponderEvent) => {
      isPressed.set(false);
      if (onPressOut && typeof onPressOut === "function") {
        onPressOut(e);
      }
    },
    [isPressed, onPressOut],
  );

  const contextValue: ControlFieldContextValue = useMemo(
    () => ({
      isSelected,
      onSelectedChange,
      isDisabled,
      isInvalid,
      isPressed,
    }),
    [isSelected, onSelectedChange, isDisabled, isInvalid, isPressed],
  );

  const formFieldContextValue = useMemo(
    () => ({
      isDisabled: isDisabled ?? false,
      isInvalid: isInvalid ?? false,
      isRequired: isRequired ?? false,
      hasFieldPadding: false,
    }),
    [isDisabled, isInvalid, isRequired],
  );

  return (
    <AnimationSettingsProvider value={animationSettingsContextValue}>
      <FormFieldProvider value={formFieldContextValue}>
        <ControlFieldProvider value={contextValue}>
          <Pressable
            ref={ref}
            className={rootClassName}
            onPress={handlePress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            disabled={isDisabled}
            {...restProps}
          >
            {content}
          </Pressable>
        </ControlFieldProvider>
      </FormFieldProvider>
    </AnimationSettingsProvider>
  );
});

/* -------------------------------------------------------------------------------------------------
 * ControlField.Indicator
 * -----------------------------------------------------------------------------------------------*/
const ControlFieldIndicator = forwardRef<View, ControlFieldIndicatorProps>((props, ref) => {
  const { children, className, variant = "switch", ...restProps } = props;
  const { isSelected, onSelectedChange, isDisabled, isInvalid } = useControlField();

  const indicatorClassName = controlFieldClassNames.indicator({
    className,
  });

  const enhancedChildren = useMemo(() => {
    if (children) {
      if (typeof children !== "object") return children;

      const child = children as React.ReactElement;

      return cloneElement(child, {
        // Only pass props from context if child doesn't already have them
        ...(isSelected !== undefined && !hasProp(child, "isSelected") && { isSelected }),
        ...(onSelectedChange && !hasProp(child, "onSelectedChange") && { onSelectedChange }),
        ...(isDisabled !== undefined && !hasProp(child, "isDisabled") && { isDisabled }),
        ...(isInvalid !== undefined && !hasProp(child, "isInvalid") && { isInvalid }),
      });
    }

    // Render default component based on variant when no children provided
    if (variant === "checkbox") {
      return (
        <Checkbox
          isSelected={isSelected}
          onSelectedChange={onSelectedChange}
          isDisabled={isDisabled}
          isInvalid={isInvalid}
        />
      );
    }

    if (variant === "radio") {
      return (
        <Radio
          isSelected={isSelected}
          onSelectedChange={onSelectedChange}
          isDisabled={isDisabled}
          isInvalid={isInvalid}
        />
      );
    }

    return (
      <Switch isSelected={isSelected} onSelectedChange={onSelectedChange} isDisabled={isDisabled} />
    );
  }, [children, variant, isSelected, onSelectedChange, isDisabled, isInvalid]);

  return (
    <View ref={ref} className={indicatorClassName} {...restProps}>
      {enhancedChildren}
    </View>
  );
});

ControlField.displayName = DISPLAY_NAME.CONTROL_FIELD;
ControlFieldIndicator.displayName = DISPLAY_NAME.CONTROL_FIELD_INDICATOR;

/* -------------------------------------------------------------------------------------------------
 * Compound export
 *
 * @component ControlField - Wrapper that provides consistent layout and interaction for form controls.
 * Handles press events to toggle selection state and manages disabled states.
 *
 * @component ControlField.Indicator - Container for the control component (Switch, Checkbox, Radio).
 * Automatically passes down isSelected, onSelectedChange, isDisabled, and isInvalid props.
 *
 * Props flow from ControlField to sub-components via context.
 * -----------------------------------------------------------------------------------------------*/
const CompoundControlField = Object.assign(ControlField, {
  /** @optional Container for control component */
  Indicator: ControlFieldIndicator,
});

export { useControlField } from "./control-field.context";
export { CompoundControlField as ControlField };
export default CompoundControlField;
