import type { ComponentProps } from "react";

import {
  AutocompleteClearButton,
  AutocompleteFilter,
  AutocompleteIndicator,
  AutocompletePopover,
  AutocompleteRoot,
  AutocompleteTrigger,
  AutocompleteValue,
} from "./autocomplete";

export const Autocomplete = Object.assign(AutocompleteRoot, {
  ClearButton: AutocompleteClearButton,
  Filter: AutocompleteFilter,
  Indicator: AutocompleteIndicator,
  Popover: AutocompletePopover,
  Root: AutocompleteRoot,
  Trigger: AutocompleteTrigger,
  Value: AutocompleteValue,
});

export type Autocomplete = {
  ClearButtonProps: ComponentProps<typeof AutocompleteClearButton>;
  FilterProps: ComponentProps<typeof AutocompleteFilter>;
  IndicatorProps: ComponentProps<typeof AutocompleteIndicator>;
  PopoverProps: ComponentProps<typeof AutocompletePopover>;
  Props: ComponentProps<typeof AutocompleteRoot>;
  RootProps: ComponentProps<typeof AutocompleteRoot>;
  TriggerProps: ComponentProps<typeof AutocompleteTrigger>;
  ValueProps: ComponentProps<typeof AutocompleteValue>;
};

export type {
  AutocompleteClearButtonProps,
  AutocompleteFilterProps,
  AutocompleteIndicatorProps,
  AutocompletePopoverProps,
  AutocompleteRootProps,
  AutocompleteRootProps as AutocompleteProps,
  AutocompleteTriggerProps,
  AutocompleteValueProps,
  AutocompleteVariants,
} from "./autocomplete";

export {
  AutocompleteClearButton,
  AutocompleteFilter,
  AutocompleteIndicator,
  AutocompletePopover,
  AutocompleteRoot,
  AutocompleteTrigger,
  AutocompleteValue,
  autocompleteVariants,
} from "./autocomplete";
