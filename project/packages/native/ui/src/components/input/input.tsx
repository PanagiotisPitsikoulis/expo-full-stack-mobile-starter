import { forwardRef } from "react";
import {
  StyleSheet,
  TextInput,
  type TextInputProps,
  type TextInput as TextInputType,
} from "react-native";
import { tv } from "tailwind-variants";
import { useIsOnSurface } from "../../helpers/external/hooks";
import { useFormField } from "../../helpers/internal/contexts";
import { combineStyles } from "../../helpers/internal/utils";

/* -------------------------------------------------------------------------------------------------
 * Constants
 * -----------------------------------------------------------------------------------------------*/
/**
 * Display name for Input component
 */
export const DISPLAY_NAME = {
  INPUT: "PitsiUINative.Input",
} as const;

/* -------------------------------------------------------------------------------------------------
 * Types
 * -----------------------------------------------------------------------------------------------*/
/**
 * Props for the Input component
 */
export interface InputProps extends TextInputProps {
  /**
   * Whether the input is in an invalid state (overrides context)
   * @default undefined
   */
  isInvalid?: boolean;
  /**
   * Whether the input is disabled (overrides context)
   * @default undefined
   */
  isDisabled?: boolean;
  /**
   * Variant style for the input
   * @default 'primary'
   */
  variant?: "primary" | "secondary";
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Custom className for the selection color
   * @default "accent-accent"
   */
  selectionColorClassName?: string;
  /**
   * Custom className for the placeholder text color
   * @default "field-placeholder"
   */
  placeholderColorClassName?: string;
}

/* -------------------------------------------------------------------------------------------------
 * Styles
 * -----------------------------------------------------------------------------------------------*/
const input = tv({
  base: "py-3.5 px-3 rounded-2xl text-foreground font-normal border-[1.5px] focus:border-accent",
  variants: {
    variant: {
      primary: "bg-field border-field ios:shadow-field android:shadow-sm",
      secondary: "bg-default border-default",
    },
    isInvalid: {
      true: "border-danger focus:border-danger",
      false: "",
    },
    isDisabled: {
      true: "disabled:opacity-disabled",
      false: "",
    },
  },
  defaultVariants: {
    variant: "primary",
    isInvalid: false,
    isDisabled: false,
  },
});

const placeholderTextColor = tv({
  base: "accent-field-placeholder",
});

const inputSelectionColor = tv({
  base: "accent-accent",
  variants: {
    isInvalid: {
      true: "accent-danger",
    },
  },
});

export const inputClassNames = combineStyles({
  input,
  inputSelectionColor,
  placeholderTextColor,
});

export const inputStyleSheet = StyleSheet.create({
  borderCurve: {
    borderCurve: "continuous",
  },
});

/* -------------------------------------------------------------------------------------------------
 * Input
 * -----------------------------------------------------------------------------------------------*/
const InputRoot = forwardRef<TextInputType, InputProps>((props, ref) => {
  const {
    isInvalid: localIsInvalid,
    isDisabled: localIsDisabled,
    variant,
    className,
    style,
    selectionColorClassName: selectionColorClassNameProp,
    placeholderColorClassName: placeholderColorClassNameProp,
    ...restProps
  } = props;
  const formField = useFormField();

  const isInvalid = localIsInvalid !== undefined ? localIsInvalid : (formField?.isInvalid ?? false);

  const isDisabled =
    localIsDisabled !== undefined ? localIsDisabled : (formField?.isDisabled ?? false);

  const isOnSurfaceAutoDetected = useIsOnSurface();
  const finalVariant =
    variant !== undefined ? variant : isOnSurfaceAutoDetected ? "secondary" : "primary";

  const inputClassName = inputClassNames.input({
    variant: finalVariant,
    isInvalid,
    isDisabled,
    className,
  });

  const placeholderColorClassName = inputClassNames.placeholderTextColor({
    className: placeholderColorClassNameProp,
  });

  const selectionColorClassName = inputClassNames.inputSelectionColor({
    isInvalid,
    className: selectionColorClassNameProp,
  });

  return (
    <TextInput
      ref={ref}
      className={inputClassName}
      style={[inputStyleSheet.borderCurve, style]}
      placeholderTextColorClassName={placeholderColorClassName}
      selectionColorClassName={selectionColorClassName}
      editable={!isDisabled}
      {...restProps}
    />
  );
});

InputRoot.displayName = DISPLAY_NAME.INPUT;

/* -------------------------------------------------------------------------------------------------
 * Compound export
 *
 * Input component - A text input component with styled border and background for collecting user input.
 * Supports primary and secondary variants, and integrates with form item state context.
 *
 * @see Full documentation: https://pitsiui.com/docs/native/components/input
 * -----------------------------------------------------------------------------------------------*/
const Input = InputRoot;

export { Input };
export default Input;
