import type { ComponentProps } from "react";

import { FieldGroup, FieldsetActions, FieldsetLegend, FieldsetRoot } from "./fieldset";

export const Fieldset = Object.assign(FieldsetRoot, {
  Actions: FieldsetActions,
  Group: FieldGroup,
  Legend: FieldsetLegend,
  Root: FieldsetRoot,
});

export type Fieldset = {
  ActionsProps: ComponentProps<typeof FieldsetActions>;
  GroupProps: ComponentProps<typeof FieldGroup>;
  LegendProps: ComponentProps<typeof FieldsetLegend>;
  Props: ComponentProps<typeof FieldsetRoot>;
  RootProps: ComponentProps<typeof FieldsetRoot>;
};

export type {
  FieldGroupProps,
  FieldsetActionsProps,
  FieldsetLegendProps,
  FieldsetRootProps,
  FieldsetRootProps as FieldsetProps,
  FieldsetVariants,
} from "./fieldset";
export {
  FieldGroup,
  FieldsetActions,
  FieldsetLegend,
  FieldsetRoot,
  fieldsetVariants,
} from "./fieldset";
