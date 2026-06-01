import { forwardRef, useCallback, useMemo, useState } from "react";
import {
  type LayoutChangeEvent,
  type TextInput as TextInputType,
  View,
  type ViewProps,
} from "react-native";
import { tv } from "tailwind-variants";
import { AnimationSettingsProvider, useFormField } from "../../helpers/internal/contexts";
import { useCombinedAnimationDisabledState } from "../../helpers/internal/hooks";
import type { AnimationRootDisableAll, ViewRef } from "../../helpers/internal/types";
import { combineStyles, createContext } from "../../helpers/internal/utils";
import { Input, type InputProps } from "../input";

/* -------------------------------------------------------------------------------------------------
 * Constants
 * -----------------------------------------------------------------------------------------------*/
export const DISPLAY_NAME = {
  INPUT_GROUP: "PitsiUINative.InputGroup",
  INPUT_GROUP_PREFIX: "PitsiUINative.InputGroup.Prefix",
  INPUT_GROUP_SUFFIX: "PitsiUINative.InputGroup.Suffix",
  INPUT_GROUP_INPUT: "PitsiUINative.InputGroup.Input",
} as const;

/* -------------------------------------------------------------------------------------------------
 * Types
 * -----------------------------------------------------------------------------------------------*/
/**
 * Context value provided by InputGroup root to child components.
 * Carries measured Prefix/Suffix widths so InputGroup.Input can
 * automatically apply matching paddingLeft / paddingRight.
 */
export interface InputGroupContextType {
  /** Whether the entire input group is disabled */
  isDisabled: boolean;
  /** Measured width of the Prefix element (0 when absent) */
  prefixWidth: number;
  /** Measured width of the Suffix element (0 when absent) */
  suffixWidth: number;
  /** Called by Prefix after layout to report its width */
  setPrefixWidth: (width: number) => void;
  /** Called by Suffix after layout to report its width */
  setSuffixWidth: (width: number) => void;
}

/**
 * Props for the InputGroup root component.
 * Acts as a layout container for Prefix, Input, and Suffix.
 */
export interface InputGroupProps extends ViewProps {
  /**
   * Children elements to be rendered inside the input group
   */
  children?: React.ReactNode;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Whether the entire input group and its children are disabled.
   * Cascades to Prefix, Suffix (opacity + pointer-events), and
   * Input (editable=false) via context.
   *
   * @default false
   */
  isDisabled?: boolean;

  /**
   * Animation configuration for input group
   * - `"disable-all"`: Disable all animations including children (cascades down)
   * - `undefined`: Use default animations
   */
  animation?: AnimationRootDisableAll;
}

/**
 * Shared props for InputGroup.Prefix and InputGroup.Suffix.
 */
interface InputGroupDecoratorBaseProps extends ViewProps {
  /**
   * Content to render inside the decorator
   */
  children?: React.ReactNode;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * When `true` the decorator is non-interactive and hidden from
   * accessibility: touches pass through to the Input underneath
   * (focusing it) and the content is excluded from screen readers.
   *
   * Applies `pointerEvents="none"`, `accessibilityElementsHidden`,
   * and `importantForAccessibility="no-hide-descendants"`.
   *
   * @default false
   */
  isDecorative?: boolean;
}

/**
 * Props for the InputGroup.Prefix component.
 * Absolutely positioned on the left side of the Input.
 */
export interface InputGroupPrefixProps extends InputGroupDecoratorBaseProps {}

/**
 * Props for the InputGroup.Suffix component.
 * Absolutely positioned on the right side of the Input.
 */
export interface InputGroupSuffixProps extends InputGroupDecoratorBaseProps {}

/**
 * Props for the InputGroup.Input component.
 * Passes all props directly through to the underlying Input component.
 */
export interface InputGroupInputProps extends InputProps {}

/* -------------------------------------------------------------------------------------------------
 * Styles
 * -----------------------------------------------------------------------------------------------*/
const prefix = tv({
  base: "absolute left-0 top-0 bottom-0 items-center justify-center z-10 px-3 gap-3",
  variants: {
    isDisabled: {
      true: "opacity-disabled",
    },
  },
  defaultVariants: {
    isDisabled: false,
  },
});

const suffix = tv({
  base: "absolute right-0 top-0 bottom-0 items-center justify-center z-10 px-3 gap-3",
  variants: {
    isDisabled: {
      true: "opacity-disabled",
    },
  },
  defaultVariants: {
    isDisabled: false,
  },
});

export const inputGroupClassNames = combineStyles({
  prefix,
  suffix,
});

/* -------------------------------------------------------------------------------------------------
 * Utils
 * -----------------------------------------------------------------------------------------------*/
export function useInputGroupRootAnimation(options: {
  animation: AnimationRootDisableAll | undefined;
}) {
  const { animation } = options;

  const isAllAnimationsDisabled = useCombinedAnimationDisabledState(animation);

  return {
    isAllAnimationsDisabled,
  };
}

/* -------------------------------------------------------------------------------------------------
 * Context
 * -----------------------------------------------------------------------------------------------*/
const [InputGroupProvider, useInputGroup] = createContext<InputGroupContextType>({
  name: "InputGroupContext",
  strict: false,
});

/* -------------------------------------------------------------------------------------------------
 * InputGroup.Root
 * -----------------------------------------------------------------------------------------------*/
const InputGroupRoot = forwardRef<ViewRef, InputGroupProps>((props, ref) => {
  const { children, animation, isDisabled = false, ...restProps } = props;

  const [prefixWidth, setPrefixWidth] = useState(0);
  const [suffixWidth, setSuffixWidth] = useState(0);

  const { isAllAnimationsDisabled } = useInputGroupRootAnimation({ animation });

  const animationSettingsContextValue = useMemo(
    () => ({ isAllAnimationsDisabled }),
    [isAllAnimationsDisabled],
  );

  const inputGroupContextValue = useMemo<InputGroupContextType>(
    () => ({
      isDisabled,
      prefixWidth,
      suffixWidth,
      setPrefixWidth,
      setSuffixWidth,
    }),
    [isDisabled, prefixWidth, suffixWidth],
  );

  return (
    <InputGroupProvider value={inputGroupContextValue}>
      <AnimationSettingsProvider value={animationSettingsContextValue}>
        <View ref={ref} {...restProps}>
          {children}
        </View>
      </AnimationSettingsProvider>
    </InputGroupProvider>
  );
});

/* -------------------------------------------------------------------------------------------------
 * InputGroup.Prefix
 * -----------------------------------------------------------------------------------------------*/
const InputGroupPrefix = forwardRef<ViewRef, InputGroupPrefixProps>((props, ref) => {
  const { children, className, isDecorative = false, onLayout: onLayoutProp, ...restProps } = props;

  const context = useInputGroup();
  const formField = useFormField();
  const isDisabled = context?.isDisabled ?? formField?.isDisabled ?? false;

  const onLayout = useCallback(
    (event: LayoutChangeEvent) => {
      context?.setPrefixWidth(event.nativeEvent.layout.width);
      onLayoutProp?.(event);
    },
    [context, onLayoutProp],
  );

  const prefixClassName = inputGroupClassNames.prefix({
    className,
    isDisabled,
  });

  return (
    <View
      ref={ref}
      className={prefixClassName}
      onLayout={onLayout}
      pointerEvents={isDecorative || isDisabled ? "none" : undefined}
      accessibilityElementsHidden={isDecorative || undefined}
      importantForAccessibility={isDecorative ? "no-hide-descendants" : undefined}
      {...restProps}
    >
      {children}
    </View>
  );
});

/* -------------------------------------------------------------------------------------------------
 * InputGroup.Suffix
 * -----------------------------------------------------------------------------------------------*/
const InputGroupSuffix = forwardRef<ViewRef, InputGroupSuffixProps>((props, ref) => {
  const { children, className, isDecorative = false, onLayout: onLayoutProp, ...restProps } = props;

  const context = useInputGroup();
  const formField = useFormField();
  const isDisabled = context?.isDisabled ?? formField?.isDisabled ?? false;

  const suffixClassName = inputGroupClassNames.suffix({
    className,
    isDisabled,
  });

  const onLayout = useCallback(
    (event: LayoutChangeEvent) => {
      context?.setSuffixWidth(event.nativeEvent.layout.width);
      onLayoutProp?.(event);
    },
    [context, onLayoutProp],
  );

  return (
    <View
      ref={ref}
      className={suffixClassName}
      onLayout={onLayout}
      pointerEvents={isDecorative || isDisabled ? "none" : undefined}
      accessibilityElementsHidden={isDecorative || undefined}
      importantForAccessibility={isDecorative ? "no-hide-descendants" : undefined}
      {...restProps}
    >
      {children}
    </View>
  );
});

/* -------------------------------------------------------------------------------------------------
 * InputGroup.Input
 * -----------------------------------------------------------------------------------------------*/
const InputGroupInput = forwardRef<TextInputType, InputGroupInputProps>((props, ref) => {
  const { style, isDisabled: localIsDisabled, ...restProps } = props;

  const context = useInputGroup();
  const isDisabled = localIsDisabled ?? context?.isDisabled ?? undefined;

  const autoPaddingStyle = useMemo(() => {
    const paddingLeft =
      context?.prefixWidth && context.prefixWidth > 0 ? context.prefixWidth : undefined;
    const paddingRight =
      context?.suffixWidth && context.suffixWidth > 0 ? context.suffixWidth : undefined;

    if (paddingLeft === undefined && paddingRight === undefined) {
      return undefined;
    }

    return { paddingLeft, paddingRight };
  }, [context?.prefixWidth, context?.suffixWidth]);

  return (
    <Input ref={ref} style={[autoPaddingStyle, style]} isDisabled={isDisabled} {...restProps} />
  );
});

InputGroupRoot.displayName = DISPLAY_NAME.INPUT_GROUP;
InputGroupPrefix.displayName = DISPLAY_NAME.INPUT_GROUP_PREFIX;
InputGroupSuffix.displayName = DISPLAY_NAME.INPUT_GROUP_SUFFIX;
InputGroupInput.displayName = DISPLAY_NAME.INPUT_GROUP_INPUT;

/* -------------------------------------------------------------------------------------------------
 * Compound export
 *
 * @component InputGroup - Layout container (plain View) that wraps
 * Prefix, Input, and Suffix. Provides animation settings and a
 * measurement context so Prefix/Suffix widths are automatically applied
 * as padding on the Input.
 *
 * @component InputGroup.Prefix - Absolutely positioned View anchored to
 * the left side of the Input. Its measured width is applied as
 * `paddingLeft` on InputGroup.Input automatically. Set `isDecorative`
 * to make touches pass through to the Input and hide from accessibility.
 *
 * @component InputGroup.Suffix - Absolutely positioned View anchored to
 * the right side of the Input. Its measured width is applied as
 * `paddingRight` on InputGroup.Input automatically. Set `isDecorative`
 * to make touches pass through to the Input and hide from accessibility.
 *
 * @component InputGroup.Input - Pass-through to the Input component.
 * Accepts all Input props directly (value, onChangeText, isDisabled, etc.).
 * Automatically receives paddingLeft/paddingRight from measured Prefix/Suffix.
 *
 * @see Full documentation: https://pitsiui.com/docs/native/components/input-group
 * -----------------------------------------------------------------------------------------------*/
const InputGroup = Object.assign(InputGroupRoot, {
  /** Absolutely positioned View for leading prefix content */
  Prefix: InputGroupPrefix,
  /** Absolutely positioned View for trailing suffix content */
  Suffix: InputGroupSuffix,
  /** Pass-through to Input — accepts all Input props directly */
  Input: InputGroupInput,
});

export { InputGroup, useInputGroup };
export default InputGroup;
