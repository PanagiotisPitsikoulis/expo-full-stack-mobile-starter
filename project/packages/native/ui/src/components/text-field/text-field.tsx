import { forwardRef, useMemo } from "react";
import { View, type ViewProps } from "react-native";
import { tv } from "tailwind-variants";
import { AnimationSettingsProvider, FormFieldProvider } from "../../helpers/internal/contexts";
import { useCombinedAnimationDisabledState } from "../../helpers/internal/hooks";
import type { AnimationRootDisableAll, ViewRef } from "../../helpers/internal/types";
import { combineStyles, createContext } from "../../helpers/internal/utils";

/* -------------------------------------------------------------------------------------------------
 * Constants
 * -----------------------------------------------------------------------------------------------*/
/**
 * Display names for TextField components
 */
export const DISPLAY_NAME = {
  ROOT: "PitsiUINative.TextField.Root",
};

/* -------------------------------------------------------------------------------------------------
 * Types
 * -----------------------------------------------------------------------------------------------*/
/**
 * Props for the TextField component
 */
export interface TextFieldRootProps extends ViewProps {
  /**
   * Children elements to be rendered inside the root container
   */
  children?: React.ReactNode;
  /**
   * Whether the entire text field is disabled
   * @default false
   */
  isDisabled?: boolean;
  /**
   * Whether the text field is in an invalid state
   * @default false
   */
  isInvalid?: boolean;
  /**
   * Whether the text field is required (shows asterisk in label)
   * @default false
   */
  isRequired?: boolean;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Animation configuration for text field root
   * - `"disable-all"`: Disable all animations including children (cascades down to all child components)
   * - `undefined`: Use default animations
   */
  animation?: AnimationRootDisableAll;
}

/**
 * Context value for the TextField component
 */
export interface TextFieldContextValue {
  /**
   * Whether the entire text field is disabled
   */
  isDisabled: boolean;
  /**
   * Whether the text field is in an invalid state
   * @default false
   */
  isInvalid: boolean;
  /**
   * Whether the text field is required
   */
  isRequired: boolean;
}

/* -------------------------------------------------------------------------------------------------
 * Styles
 * -----------------------------------------------------------------------------------------------*/
const root = tv({
  base: "gap-1.5",
});

export const textFieldClassNames = combineStyles({
  root,
});

/* -------------------------------------------------------------------------------------------------
 * Utils (animation)
 * -----------------------------------------------------------------------------------------------*/
/**
 * Animation hook for TextField Root component
 * Handles root-level animation configuration and provides context for child components
 */
export function useTextFieldRootAnimation(options: {
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
const [TextFieldProvider, useTextField] = createContext<TextFieldContextValue>({
  name: "TextFieldContext",
  strict: false,
});

/* -------------------------------------------------------------------------------------------------
 * TextField.Root
 * -----------------------------------------------------------------------------------------------*/
const TextFieldRoot = forwardRef<ViewRef, TextFieldRootProps>((props, ref) => {
  const {
    children,
    className,
    isDisabled = false,
    isInvalid = false,
    isRequired = false,
    animation,
    ...restProps
  } = props;

  const rootClassName = textFieldClassNames.root({ className });

  const { isAllAnimationsDisabled } = useTextFieldRootAnimation({ animation });

  const contextValue = useMemo(
    () => ({ isDisabled, isInvalid, isRequired }),
    [isDisabled, isInvalid, isRequired],
  );

  const formFieldContextValue = useMemo(
    () => ({ isDisabled, isInvalid, isRequired, hasFieldPadding: true }),
    [isDisabled, isInvalid, isRequired],
  );

  const animationSettingsContextValue = useMemo(
    () => ({
      isAllAnimationsDisabled,
    }),
    [isAllAnimationsDisabled],
  );

  return (
    <AnimationSettingsProvider value={animationSettingsContextValue}>
      <FormFieldProvider value={formFieldContextValue}>
        <TextFieldProvider value={contextValue}>
          <View ref={ref} className={rootClassName} {...restProps}>
            {children}
          </View>
        </TextFieldProvider>
      </FormFieldProvider>
    </AnimationSettingsProvider>
  );
});

TextFieldRoot.displayName = DISPLAY_NAME.ROOT;

/* -------------------------------------------------------------------------------------------------
 * Compound export
 *
 * TextField component - Main container that provides gap-1 spacing between children.
 * Handles disabled state and validation state for the entire field.
 *
 * @see Full documentation: https://pitsiui.com/docs/native/components/text-field
 * -----------------------------------------------------------------------------------------------*/
const TextField = TextFieldRoot;

export default TextField;
export { TextField, useTextField };
