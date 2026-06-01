import { type ComponentRef, cloneElement, forwardRef, isValidElement } from "react";
import type {
  Image as RNImage,
  Pressable as RNPressable,
  PressableProps as RNPressableProps,
  Text as RNText,
  TextProps as RNTextProps,
  View as RNView,
  ViewProps as RNViewProps,
} from "react-native";
import type { AnyProps, ImageSlotProps } from "./slot.types";
import { composeRefs, mergeProps } from "./utils";

// --------------------------------------------------

const Pressable = forwardRef<React.ComponentRef<typeof RNPressable>, RNPressableProps>(
  (props, forwardedRef) => {
    const { children, ...pressableSlotProps } = props;

    if (!isValidElement(children)) {
      console.log("Slot.Pressable - Invalid asChild element", children);
      return null;
    }

    const child = children as React.ReactElement<AnyProps>;

    return cloneElement(child, {
      ...mergeProps(pressableSlotProps, children.props as AnyProps),
      ref: forwardedRef ? composeRefs(forwardedRef, (children as any).ref) : (children as any).ref,
    });
  },
);

Pressable.displayName = "PitsiUINative.Primitive.Slot.Pressable";

// --------------------------------------------------

const View = forwardRef<React.ComponentRef<typeof RNView>, RNViewProps>((props, forwardedRef) => {
  const { children, ...viewSlotProps } = props;

  if (!isValidElement(children)) {
    console.log("Slot.View - Invalid asChild element", children);
    return null;
  }

  const child = children as React.ReactElement<AnyProps>;

  return cloneElement(child, {
    ...mergeProps(viewSlotProps, children.props as AnyProps),
    ref: forwardedRef ? composeRefs(forwardedRef, (children as any).ref) : (children as any).ref,
  });
});

View.displayName = "PitsiUINative.Primitive.Slot.View";

// --------------------------------------------------

const Text = forwardRef<ComponentRef<typeof RNText>, RNTextProps>((props, forwardedRef) => {
  const { children, ...textSlotProps } = props;

  if (!isValidElement(children)) {
    console.log("Slot.Text - Invalid asChild element", children);
    return null;
  }

  const child = children as React.ReactElement<AnyProps>;

  return cloneElement(child, {
    ...mergeProps(textSlotProps, children.props as AnyProps),
    ref: forwardedRef ? composeRefs(forwardedRef, (children as any).ref) : (children as any).ref,
  });
});

Text.displayName = "PitsiUINative.Primitive.Slot.Text";

// --------------------------------------------------

const Image = forwardRef<ComponentRef<typeof RNImage>, ImageSlotProps>((props, forwardedRef) => {
  const { children, ...imageSlotProps } = props;

  if (!isValidElement(children)) {
    console.log("Slot.Image - Invalid asChild element", children);
    return null;
  }

  const child = children as React.ReactElement<AnyProps>;

  return cloneElement(child, {
    ...mergeProps(imageSlotProps, children.props as AnyProps),
    ref: forwardedRef ? composeRefs(forwardedRef, (children as any).ref) : (children as any).ref,
  });
});

Image.displayName = "PitsiUINative.Primitive.Slot.Image";

export { Image, Pressable, Text, View };
