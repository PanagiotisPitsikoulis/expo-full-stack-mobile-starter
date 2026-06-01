import {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  type ReactElement,
  type ReactNode,
  useState,
} from "react";
import { View, type ViewProps } from "react-native";
import { tv, type VariantProps } from "tailwind-variants";

import { Checkbox, type CheckboxProps } from "../checkbox";
import { TextField } from "../text-field";

export const checkboxGroupVariants = tv({
  base: "gap-3",
  variants: {
    variant: {
      primary: "",
      secondary: "",
    },
  },
  defaultVariants: {
    variant: "primary",
  },
});

export type CheckboxGroupVariants = VariantProps<typeof checkboxGroupVariants>;

export interface CheckboxGroupProps
  extends Omit<ViewProps, "children" | "onChange">,
    CheckboxGroupVariants {
  children?: ReactNode;
  defaultValue?: string[];
  isDisabled?: boolean;
  isInvalid?: boolean;
  isRequired?: boolean;
  name?: string;
  onChange?: (value: string[]) => void;
  value?: string[];
}

type CheckboxElementProps = CheckboxProps & {
  value?: string;
};

function wireCheckboxChildren(
  children: ReactNode,
  selectedValues: string[],
  setSelectedValues: (value: string[]) => void,
  options: {
    isDisabled?: boolean;
    isInvalid?: boolean;
    variant?: CheckboxProps["variant"];
  },
): ReactNode {
  return Children.map(children, (child) => {
    if (!isValidElement(child)) {
      return child;
    }

    if (child.type !== Checkbox) {
      const nestedChildren = (child.props as { children?: ReactNode }).children;

      if (!nestedChildren) {
        return child;
      }

      return cloneElement(child, {
        children: wireCheckboxChildren(nestedChildren, selectedValues, setSelectedValues, options),
      } as Partial<unknown>);
    }

    const checkbox = child as ReactElement<CheckboxElementProps>;
    const value = checkbox.props.value;

    if (!value) {
      return child;
    }

    const isSelected = selectedValues.includes(value);

    return cloneElement(checkbox, {
      isDisabled: checkbox.props.isDisabled ?? options.isDisabled,
      isInvalid: checkbox.props.isInvalid ?? options.isInvalid,
      isSelected,
      onSelectedChange: (nextSelected: boolean) => {
        const nextValues = nextSelected
          ? Array.from(new Set([...selectedValues, value]))
          : selectedValues.filter((item) => item !== value);
        setSelectedValues(nextValues);
        checkbox.props.onSelectedChange?.(nextSelected);
      },
      variant: checkbox.props.variant ?? options.variant,
    });
  });
}

const CheckboxGroup = forwardRef<View, CheckboxGroupProps>(
  (
    {
      children,
      className,
      defaultValue = [],
      isDisabled = false,
      isInvalid = false,
      isRequired = false,
      name: _name,
      onChange,
      value,
      variant,
      ...props
    },
    ref,
  ) => {
    const [internalValue, setInternalValue] = useState(defaultValue);
    const selectedValues = value ?? internalValue;
    const rootClassName = checkboxGroupVariants({ className, variant });

    const setSelectedValues = (nextValue: string[]) => {
      if (value === undefined) {
        setInternalValue(nextValue);
      }
      onChange?.(nextValue);
    };

    const content = wireCheckboxChildren(children, selectedValues, setSelectedValues, {
      isDisabled,
      isInvalid,
      variant,
    });

    return (
      <TextField isDisabled={isDisabled} isInvalid={isInvalid} isRequired={isRequired}>
        <View ref={ref} className={rootClassName} {...props}>
          {content}
        </View>
      </TextField>
    );
  },
);

CheckboxGroup.displayName = "PitsiUINative.CheckboxGroup";

export { CheckboxGroup };
