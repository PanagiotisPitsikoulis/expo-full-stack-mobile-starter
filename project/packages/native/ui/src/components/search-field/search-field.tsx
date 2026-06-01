import { forwardRef, useMemo } from "react";
import {
  type GestureResponderEvent,
  type TextInput as TextInputType,
  View,
  type ViewProps,
} from "react-native";
import { tv } from "tailwind-variants";
import { useThemeColor } from "../../helpers/external/hooks";
import { CloseIcon } from "../../helpers/internal/components";
import { AnimationSettingsProvider, FormFieldProvider } from "../../helpers/internal/contexts";
import { useCombinedAnimationDisabledState } from "../../helpers/internal/hooks";
import type { AnimationRootDisableAll, ViewRef } from "../../helpers/internal/types";
import { combineStyles, createContext } from "../../helpers/internal/utils";
import { Button, type ButtonRootProps } from "../button";
import { Input, type InputProps } from "../input";
import { SearchIcon } from "./search-icon";

/* -------------------------------------------------------------------------------------------------
 * Constants
 * -----------------------------------------------------------------------------------------------*/
/**
 * Display names for SearchField components
 */
export const DISPLAY_NAME = {
  SEARCH_FIELD: "PitsiUINative.SearchField",
  SEARCH_FIELD_GROUP: "PitsiUINative.SearchField.Group",
  SEARCH_FIELD_SEARCH_ICON: "PitsiUINative.SearchField.SearchIcon",
  SEARCH_FIELD_INPUT: "PitsiUINative.SearchField.Input",
  SEARCH_FIELD_CLEAR_BUTTON: "PitsiUINative.SearchField.ClearButton",
} as const;

/* -------------------------------------------------------------------------------------------------
 * Types
 * -----------------------------------------------------------------------------------------------*/
/**
 * Context value provided by SearchField root to child components.
 * Carries the controlled value, onChange callback, and form-field
 * state so that Input and ClearButton can consume them.
 */
export interface SearchFieldContextType {
  /** Current search text (undefined when uncontrolled) */
  value: string | undefined;
  /** Callback invoked when the search text changes */
  onChange: ((value: string) => void) | undefined;
  /** Whether the search field is disabled */
  isDisabled: boolean;
  /** Whether the search field is in an invalid state */
  isInvalid: boolean;
  /** Whether the search field is required */
  isRequired: boolean;
}

/**
 * Props for the SearchField root component
 */
export interface SearchFieldProps extends ViewProps {
  /**
   * Children elements to be rendered inside the search field
   */
  children?: React.ReactNode;

  /**
   * Controlled search text value
   */
  value?: string;

  /**
   * Callback fired when the search text changes
   */
  onChange?: (value: string) => void;

  /**
   * Whether the search field is disabled
   * @default false
   */
  isDisabled?: boolean;

  /**
   * Whether the search field is in an invalid state
   * @default false
   */
  isInvalid?: boolean;

  /**
   * Whether the search field is required
   * @default false
   */
  isRequired?: boolean;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Animation configuration for search field
   * - `"disable-all"`: Disable all animations including children (cascades down)
   * - `undefined`: Use default animations
   */
  animation?: AnimationRootDisableAll;
}

/**
 * Props for the SearchField.Group component
 */
export interface SearchFieldGroupProps extends ViewProps {
  /**
   * Children elements to be rendered inside the group
   */
  children?: React.ReactNode;

  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Props for customizing the default search icon
 */
export interface SearchFieldSearchIconIconProps {
  /**
   * Size of the search icon
   * @default 16
   */
  size?: number;

  /**
   * Color of the search icon
   * @default Uses theme muted color
   */
  color?: string;
}

/**
 * Props for the SearchField.SearchIcon component
 */
export interface SearchFieldSearchIconProps extends ViewProps {
  /**
   * Custom content to replace the default search icon
   */
  children?: React.ReactNode;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Props for customizing the default search icon (ignored when children are provided)
   */
  iconProps?: SearchFieldSearchIconIconProps;
}

/**
 * Props for the SearchField.Input component.
 * Extends InputProps with search-specific defaults (placeholder, a11y role).
 * Omits `value` and `onChangeText` because they are provided by SearchField
 * root through SearchFieldValueContext.
 */
export interface SearchFieldInputProps extends Omit<InputProps, "value" | "onChangeText"> {}

/**
 * Props for customizing the clear button icon
 */
export interface SearchFieldClearButtonIconProps {
  /**
   * Size of the icon
   * @default 14
   */
  size?: number;

  /**
   * Color of the icon
   * @default Uses theme muted color
   */
  color?: string;
}

/**
 * Props for the SearchField.ClearButton component
 */
export type SearchFieldClearButtonProps = ButtonRootProps & {
  /**
   * Props for customizing the clear button icon
   */
  iconProps?: SearchFieldClearButtonIconProps;
};

/* -------------------------------------------------------------------------------------------------
 * Styles
 * -----------------------------------------------------------------------------------------------*/
const root = tv({
  base: "gap-1.5",
});

const group = tv({
  base: "flex-row items-center",
});

const searchIcon = tv({
  base: "absolute left-3 z-10",
});

/**
 * @note This only applies SearchField-specific overrides (flex-1, pl-9).
 * Base input styling (bg, border, focus, variants, etc.) comes from the Input component.
 */
const input = tv({
  base: "flex-1 pl-9 pr-12",
});

const clearButton = tv({
  base: "absolute right-3 size-6",
});

export const searchFieldClassNames = combineStyles({
  root,
  group,
  searchIcon,
  input,
  clearButton,
});

/* -------------------------------------------------------------------------------------------------
 * Utils (animation)
 * -----------------------------------------------------------------------------------------------*/
/**
 * Animation hook for SearchField root component
 * Handles root-level animation configuration and provides context for child components
 */
export function useSearchFieldRootAnimation(options: {
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
const [SearchFieldProvider, useSearchField] = createContext<SearchFieldContextType>({
  name: "SearchFieldContext",
  strict: false,
});

/* -------------------------------------------------------------------------------------------------
 * SearchField.Root
 * -----------------------------------------------------------------------------------------------*/
const SearchFieldRoot = forwardRef<ViewRef, SearchFieldProps>((props, ref) => {
  const {
    children,
    className,
    value,
    onChange,
    isDisabled = false,
    isInvalid = false,
    isRequired = false,
    animation,
    ...restProps
  } = props;

  const rootClassName = searchFieldClassNames.root({ className });

  const { isAllAnimationsDisabled } = useSearchFieldRootAnimation({
    animation,
  });

  const searchFieldContextValue = useMemo<SearchFieldContextType>(
    () => ({ value, onChange, isDisabled, isInvalid, isRequired }),
    [value, onChange, isDisabled, isInvalid, isRequired],
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
    <SearchFieldProvider value={searchFieldContextValue}>
      <AnimationSettingsProvider value={animationSettingsContextValue}>
        <FormFieldProvider value={formFieldContextValue}>
          <View ref={ref} className={rootClassName} {...restProps}>
            {children}
          </View>
        </FormFieldProvider>
      </AnimationSettingsProvider>
    </SearchFieldProvider>
  );
});

/* -------------------------------------------------------------------------------------------------
 * SearchField.Group
 * -----------------------------------------------------------------------------------------------*/
const SearchFieldGroup = forwardRef<ViewRef, SearchFieldGroupProps>((props, ref) => {
  const { children, className, ...restProps } = props;

  const groupClassName = searchFieldClassNames.group({ className });

  return (
    <View ref={ref} className={groupClassName} {...restProps}>
      {children}
    </View>
  );
});

/* -------------------------------------------------------------------------------------------------
 * SearchField.SearchIcon
 * -----------------------------------------------------------------------------------------------*/
const SearchFieldSearchIcon = forwardRef<View, SearchFieldSearchIconProps>((props, ref) => {
  const { children, className, iconProps, ...restProps } = props;

  const searchIconClassName = searchFieldClassNames.searchIcon({ className });

  return (
    <View
      ref={ref}
      className={searchIconClassName}
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      {...restProps}
    >
      {children ?? <SearchIcon size={iconProps?.size} color={iconProps?.color} />}
    </View>
  );
});

/* -------------------------------------------------------------------------------------------------
 * SearchField.Input
 * -----------------------------------------------------------------------------------------------*/
const SearchFieldInput = forwardRef<TextInputType, SearchFieldInputProps>((props, ref) => {
  const {
    className,
    placeholder = "Search...",
    returnKeyType = "search",
    accessibilityRole = "search",
    accessibilityLabel = "Search",
    ...restProps
  } = props;

  const searchField = useSearchField();

  const inputClassName = searchFieldClassNames.input({ className });

  return (
    <Input
      ref={ref}
      className={inputClassName}
      value={searchField?.value}
      onChangeText={searchField?.onChange}
      placeholder={placeholder}
      returnKeyType={returnKeyType}
      accessibilityRole={accessibilityRole}
      accessibilityLabel={accessibilityLabel}
      {...restProps}
    />
  );
});

/* -------------------------------------------------------------------------------------------------
 * SearchField.ClearButton
 * -----------------------------------------------------------------------------------------------*/
const SearchFieldClearButton = forwardRef<View, SearchFieldClearButtonProps>((props, ref) => {
  const { iconProps, className, children, onPress, ...restProps } = props;

  const searchField = useSearchField();
  const themeColorMuted = useThemeColor("muted");

  if (searchField?.value !== undefined && searchField.value.length === 0) {
    return null;
  }

  const handlePress = (event: GestureResponderEvent) => {
    searchField?.onChange?.("");

    if (typeof onPress === "function") {
      onPress(event);
    }
  };

  const clearButtonClassName = searchFieldClassNames.clearButton({
    className,
  });

  return (
    <Button
      ref={ref}
      variant="tertiary"
      size="sm"
      isIconOnly
      className={clearButtonClassName}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel="Clear search"
      onPress={handlePress}
      {...restProps}
    >
      {children ?? (
        <CloseIcon size={iconProps?.size ?? 14} color={iconProps?.color ?? themeColorMuted} />
      )}
    </Button>
  );
});

SearchFieldRoot.displayName = DISPLAY_NAME.SEARCH_FIELD;
SearchFieldGroup.displayName = DISPLAY_NAME.SEARCH_FIELD_GROUP;
SearchFieldSearchIcon.displayName = DISPLAY_NAME.SEARCH_FIELD_SEARCH_ICON;
SearchFieldInput.displayName = DISPLAY_NAME.SEARCH_FIELD_INPUT;
SearchFieldClearButton.displayName = DISPLAY_NAME.SEARCH_FIELD_CLEAR_BUTTON;

/* -------------------------------------------------------------------------------------------------
 * Compound export
 *
 * @component SearchField - Root container that accepts `value`, `onChange`,
 * `isDisabled`, `isInvalid`, and `isRequired`, providing them to children via
 * SearchFieldContext. Also provides FormFieldProvider and animation settings.
 *
 * @component SearchField.Group - Flex-row container for the search icon, input,
 * and clear button.
 *
 * @component SearchField.SearchIcon - Magnifying glass icon positioned
 * absolutely on the left.
 *
 * @component SearchField.Input - Wraps the Input component with search-specific
 * defaults: "Search..." placeholder, left padding for the search icon, and
 * search a11y role. Reads `value` / `onChangeText` from SearchFieldContext.
 *
 * @component SearchField.ClearButton - Small button that clears the search
 * input. Automatically hidden when value is empty. Calls `onChange("")` from
 * context on press.
 *
 * @see Full documentation: https://pitsiui.com/docs/native/components/search-field
 * -----------------------------------------------------------------------------------------------*/
const SearchField = Object.assign(SearchFieldRoot, {
  /** Flex-row container for search icon, input, and clear button */
  Group: SearchFieldGroup,
  /** Magnifying glass search icon */
  SearchIcon: SearchFieldSearchIcon,
  /** Text input with search-specific defaults */
  Input: SearchFieldInput,
  /** Small clear button to dismiss search text */
  ClearButton: SearchFieldClearButton,
});

export { SearchField, useSearchField };
export default SearchField;
