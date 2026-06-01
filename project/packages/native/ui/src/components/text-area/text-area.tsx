import { forwardRef } from "react";
import type { TextInput as TextInputType } from "react-native";
import { tv } from "tailwind-variants";
import { combineStyles } from "../../helpers/internal/utils";
import Input, { type InputProps } from "../input/input";

/* -------------------------------------------------------------------------------------------------
 * Constants
 * -----------------------------------------------------------------------------------------------*/
/**
 * Display name for TextArea component
 */
export const DISPLAY_NAME = {
  TEXT_AREA: "PitsiUINative.TextArea",
} as const;

/* -------------------------------------------------------------------------------------------------
 * Types
 * -----------------------------------------------------------------------------------------------*/
/**
 * Props for the TextArea component
 */
export interface TextAreaProps extends InputProps {}

/* -------------------------------------------------------------------------------------------------
 * Styles
 * -----------------------------------------------------------------------------------------------*/
const root = tv({
  base: "h-32",
});

export const textAreaClassNames = combineStyles({
  root,
});

/* -------------------------------------------------------------------------------------------------
 * TextArea
 * -----------------------------------------------------------------------------------------------*/
const TextAreaRoot = forwardRef<TextInputType, TextAreaProps>((props, ref) => {
  const { multiline = true, textAlignVertical = "top", className, ...restProps } = props;

  const textAreaClassName = textAreaClassNames.root({ className });

  return (
    <Input
      ref={ref}
      className={textAreaClassName}
      multiline={multiline}
      textAlignVertical={textAlignVertical}
      {...restProps}
    />
  );
});

TextAreaRoot.displayName = DISPLAY_NAME.TEXT_AREA;

/* -------------------------------------------------------------------------------------------------
 * Compound export
 *
 * TextArea component - A multiline text input component with styled border and background for collecting longer user input.
 * Extends Input component with multiline support, defaulting to 8 lines and top-aligned text.
 * Supports primary and secondary variants, and integrates with form item state context.
 *
 * @see Full documentation: https://pitsiui.com/docs/native/components/text-area
 * -----------------------------------------------------------------------------------------------*/
const TextArea = TextAreaRoot;

export { TextArea };
export default TextArea;
