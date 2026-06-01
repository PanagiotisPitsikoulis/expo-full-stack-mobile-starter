import { Children, forwardRef, isValidElement, type ReactNode } from "react";
import type { View } from "react-native";
import { tv, type VariantProps } from "tailwind-variants";

import { TagGroup, type TagGroupItemProps, type TagGroupItemRemoveButtonProps } from "../tag-group";

export const tagVariants = tv({
  slots: {
    root: "",
    removeButton: "",
  },
  variants: {
    color: {
      accent: { root: "bg-accent-soft" },
      danger: { root: "bg-danger-soft" },
      default: {},
      primary: { root: "bg-accent-soft" },
      success: { root: "bg-success-soft" },
      warning: { root: "bg-warning-soft" },
    },
    size: {
      lg: { root: "px-3 py-1.5" },
      md: {},
      sm: { root: "px-2 py-0.5" },
    },
    variant: {
      default: {},
      surface: { root: "bg-surface" },
    },
  },
  defaultVariants: {
    color: "default",
    size: "md",
    variant: "default",
  },
});

export type TagVariants = VariantProps<typeof tagVariants>;

export interface TagRemoveButtonProps extends TagGroupItemRemoveButtonProps {
  slot?: string;
}

const TagRemoveButton = forwardRef<View, TagRemoveButtonProps>(({ slot: _slot, ...props }, ref) => (
  <TagGroup.ItemRemoveButton ref={ref as never} {...props} />
));

TagRemoveButton.displayName = "PitsiUINative.TagRemoveButton";

export interface TagRootProps extends Omit<TagGroupItemProps, "children">, TagVariants {
  children?: ReactNode | TagGroupItemProps["children"];
  textValue?: string;
}

function splitRemoveButtons(children: ReactNode) {
  const content: ReactNode[] = [];
  const removeButtons: ReactNode[] = [];

  Children.forEach(children, (child) => {
    if (isValidElement(child) && child.type === TagRemoveButton) {
      removeButtons.push(child);
      return;
    }

    content.push(child);
  });

  return { content, removeButtons };
}

function normalizeContent(children: ReactNode[]) {
  return children.map((child, index) => {
    if (typeof child === "string" || typeof child === "number") {
      return <TagGroup.ItemLabel key={`tag-label-${index}`}>{child}</TagGroup.ItemLabel>;
    }

    return child;
  });
}

const TagRoot = forwardRef<View, TagRootProps>(
  ({ children, className, color, size, textValue: _textValue, variant, ...props }, ref) => {
    const slots = tagVariants({ color, size, variant });

    if (typeof children === "function") {
      return (
        <TagGroup.Item ref={ref as never} className={slots.root({ className })} {...props}>
          {children}
        </TagGroup.Item>
      );
    }

    const { content, removeButtons } = splitRemoveButtons(children);

    return (
      <TagGroup.Item ref={ref as never} className={slots.root({ className })} {...props}>
        {normalizeContent(content)}
        {removeButtons}
      </TagGroup.Item>
    );
  },
);

TagRoot.displayName = "PitsiUINative.TagRoot";

export { TagRemoveButton, TagRoot };
