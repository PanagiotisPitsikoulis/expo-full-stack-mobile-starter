import { forwardRef, useMemo } from "react";
import type { TextStyle } from "react-native";
import { tv } from "tailwind-variants";
import { HeroText } from "../../helpers/internal/components";
import { AnimationSettingsProvider, useFormField } from "../../helpers/internal/contexts";
import type {
  AnimationRootDisableAll,
  ElementSlots,
  PressableRef,
  TextRef,
} from "../../helpers/internal/types";
import { childrenToString, combineStyles, createContext } from "../../helpers/internal/utils";
import * as LabelPrimitives from "../../primitives/label";
import type * as LabelPrimitivesTypes from "../../primitives/label/label.types";
import { useControlField } from "../control-field/control-field.context";
import { useRadioGroupItem } from "../radio-group";
import { useLabelRootAnimation } from "./label.animation";

/* -------------------------------------------------------------------------------------------------
 * Constants
 * -----------------------------------------------------------------------------------------------*/
/**
 * Display names for Label components
 */
export const DISPLAY_NAME = {
  LABEL_ROOT: "PitsiUINative.Label.Root",
  LABEL_TEXT: "PitsiUINative.Label.Text",
} as const;

/* -------------------------------------------------------------------------------------------------
 * Styles
 * -----------------------------------------------------------------------------------------------*/
const root = tv({
  base: "",
  variants: {
    isDisabled: {
      true: "pointer-events-none opacity-disabled",
    },
    isInsideField: {
      true: "px-1.5",
    },
    isInsideControlField: {
      true: "pointer-events-none",
    },
  },
});

const label = tv({
  slots: {
    text: "text-base text-foreground font-medium",
    asterisk: "text-lg/6 text-danger",
  },
  variants: {
    isDisabled: {
      true: {
        text: "",
        asterisk: "text-muted",
      },
    },
    isInvalid: {
      true: {
        text: "text-danger",
      },
    },
  },
});

export const labelClassNames = combineStyles({
  root,
  label,
});

export type LabelSlots = keyof ReturnType<typeof label>;

/* -------------------------------------------------------------------------------------------------
 * Types
 * -----------------------------------------------------------------------------------------------*/
/**
 * Props for the main Label component
 */
export interface LabelProps extends LabelPrimitivesTypes.RootProps {
  /**
   * Whether the label is required (shows asterisk)
   * @default false
   */
  isRequired?: boolean;

  /**
   * Whether the label is in an invalid state
   * @default false
   */
  isInvalid?: boolean;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Animation configuration for label
   * - `"disable-all"`: Disable all animations including children
   * - `undefined`: Use default animations
   */
  animation?: AnimationRootDisableAll;
}

/**
 * Props for the Label.Text component
 */
export interface LabelTextProps extends LabelPrimitivesTypes.TextProps {
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Additional CSS classes for different parts of the label
   */
  classNames?: ElementSlots<LabelSlots>;
  /**
   * Styles for different parts of the label
   */
  styles?: Partial<Record<LabelSlots, TextStyle>>;
}

/**
 * Context value for Label components
 */
export interface LabelContextValue {
  /**
   * Whether the label is disabled
   */
  isDisabled: boolean;

  /**
   * Whether the label is required
   */
  isRequired: boolean;

  /**
   * Whether the label is in an invalid state
   */
  isInvalid: boolean;
}

/**
 * Reference type for the Label component
 */
export type LabelRef = PressableRef;

/**
 * Reference type for the Label.Text component
 */
export type LabelTextRef = TextRef;

/* -------------------------------------------------------------------------------------------------
 * Context
 * -----------------------------------------------------------------------------------------------*/
const [LabelProvider, useLabel] = createContext<LabelContextValue>({
  name: "LabelContext",
});

/* -------------------------------------------------------------------------------------------------
 * Label
 * -----------------------------------------------------------------------------------------------*/
const Label = forwardRef<PressableRef, LabelProps>((props, ref) => {
  const {
    children,
    isDisabled: localIsDisabled,
    isRequired: localIsRequired,
    isInvalid: localIsInvalid,
    className,
    animation,
    ...restProps
  } = props;

  const formField = useFormField();
  const controlFieldContext = useControlField();
  const radioGroupItemContext = useRadioGroupItem();

  const isInsideField = formField?.hasFieldPadding ?? false;
  const isInsideControlField = Boolean(controlFieldContext) || Boolean(radioGroupItemContext);

  // Merge form field state with local props (local takes precedence)
  const isDisabled =
    localIsDisabled !== undefined ? localIsDisabled : (formField?.isDisabled ?? false);
  const isRequired =
    localIsRequired !== undefined ? localIsRequired : (formField?.isRequired ?? false);
  const isInvalid = localIsInvalid !== undefined ? localIsInvalid : (formField?.isInvalid ?? false);

  const stringifiedChildren = childrenToString(children);

  const { isAllAnimationsDisabled } = useLabelRootAnimation({
    animation,
  });

  const animationSettingsContextValue = useMemo(
    () => ({
      isAllAnimationsDisabled,
    }),
    [isAllAnimationsDisabled],
  );

  const contextValue = useMemo(
    () => ({
      isDisabled,
      isRequired,
      isInvalid,
    }),
    [isDisabled, isRequired, isInvalid],
  );

  const rootClassName = labelClassNames.root({
    isDisabled,
    isInsideField,
    isInsideControlField,
    className,
  });

  return (
    <AnimationSettingsProvider value={animationSettingsContextValue}>
      <LabelProvider value={contextValue}>
        <LabelPrimitives.Root
          ref={ref}
          isDisabled={isDisabled}
          className={rootClassName}
          {...restProps}
        >
          {stringifiedChildren ? <LabelText>{stringifiedChildren}</LabelText> : children}
        </LabelPrimitives.Root>
      </LabelProvider>
    </AnimationSettingsProvider>
  );
});

/* -------------------------------------------------------------------------------------------------
 * Label.Text
 * -----------------------------------------------------------------------------------------------*/
const LabelText = forwardRef<TextRef, LabelTextProps>((props, ref) => {
  const { children, className, classNames, styles, style, ...restProps } = props;

  const { isDisabled, isRequired, isInvalid } = useLabel();

  const { text, asterisk } = labelClassNames.label({
    isDisabled,
    isInvalid,
  });

  const textClassName = text({
    className: [className, classNames?.text],
  });

  const asteriskClassName = asterisk({
    className: classNames?.asterisk,
  });

  return (
    <HeroText ref={ref} className={textClassName} style={[style, styles?.text]} {...restProps}>
      {children}
      {isRequired && (
        <HeroText className={asteriskClassName} style={styles?.asterisk}>
          {" "}
          *
        </HeroText>
      )}
    </HeroText>
  );
});

Label.displayName = DISPLAY_NAME.LABEL_ROOT;
LabelText.displayName = DISPLAY_NAME.LABEL_TEXT;

/* -------------------------------------------------------------------------------------------------
 * Compound export
 *
 * @component Label - Main container that displays a label. Renders with
 *   string children as Label.Text or accepts compound components for custom layouts.
 * @component Label.Text - Text content of the label. When string is provided,
 *   it renders as Text. Otherwise renders children as-is. Shows asterisk when required.
 *
 * Props flow from Label to sub-components via context (isDisabled, isRequired, isInvalid).
 *
 * @see https://pitsiui.com/docs/native/components/label
 * -----------------------------------------------------------------------------------------------*/
const CompoundLabel = Object.assign(Label, {
  /** Label text - renders text or custom content with optional asterisk */
  Text: LabelText,
});

export { CompoundLabel as Label, useLabel };
export default CompoundLabel;
