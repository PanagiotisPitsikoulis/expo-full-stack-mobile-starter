import React, { forwardRef } from "react";
import {
  Text as NativeText,
  Pressable,
  type PressableProps,
  ScrollView,
  type StyleProp,
  StyleSheet,
  TextInput,
  type TextInputProps,
  type TextStyle,
  View,
  type ViewProps,
  type ViewStyle,
} from "react-native";

export type WebParityKind = "input" | "pressable" | "scroll" | "text" | "view";

export interface WebParityElementProps
  extends Pick<
    ViewProps,
    | "accessibilityHint"
    | "accessibilityLabel"
    | "accessibilityRole"
    | "accessibilityState"
    | "nativeID"
    | "onLayout"
    | "testID"
  > {
  autoCapitalize?: TextInputProps["autoCapitalize"];
  autoCorrect?: TextInputProps["autoCorrect"];
  autoFocus?: TextInputProps["autoFocus"];
  badge?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  color?: string;
  contentContainerStyle?: StyleProp<ViewStyle>;
  data?: readonly unknown[];
  defaultValue?: string;
  description?: React.ReactNode;
  disabled?: boolean;
  editable?: TextInputProps["editable"];
  href?: string;
  icon?: React.ReactNode;
  id?: number | string;
  isDisabled?: boolean;
  keyboardType?: TextInputProps["keyboardType"];
  label?: React.ReactNode;
  maxLength?: TextInputProps["maxLength"];
  multiline?: TextInputProps["multiline"];
  numberOfLines?: TextInputProps["numberOfLines"];
  onChangeText?: TextInputProps["onChangeText"];
  onClick?: () => void;
  onPress?: PressableProps["onPress"];
  orientation?: "horizontal" | "vertical" | string;
  placeholder?: string;
  renderItem?: (item: unknown, index: number) => React.ReactNode;
  secureTextEntry?: TextInputProps["secureTextEntry"];
  size?: number | string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  title?: React.ReactNode;
  tone?: string;
  value?: React.ReactNode;
  variant?: string;
}

export type WebParityComponent = React.ForwardRefExoticComponent<
  WebParityElementProps & React.RefAttributes<unknown>
>;

type NativeTextRef = React.ElementRef<typeof NativeText>;
type NativeTextInputRef = React.ElementRef<typeof TextInput>;
type NativeViewRef = React.ElementRef<typeof View>;
type NativeScrollViewRef = React.ElementRef<typeof ScrollView>;

const styles = StyleSheet.create({
  input: {
    borderColor: "rgba(120, 120, 128, 0.25)",
    borderCurve: "continuous",
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    minHeight: 44,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  pressed: {
    opacity: 0.72,
  },
  root: {
    gap: 6,
  },
  row: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
  },
  text: {
    color: "inherit",
  },
});

function isPrimitive(value: React.ReactNode): value is number | string {
  return typeof value === "string" || typeof value === "number";
}

function renderNode(value: React.ReactNode, key?: React.Key): React.ReactNode {
  if (value == null || typeof value === "boolean") {
    return null;
  }

  if (isPrimitive(value)) {
    return (
      <NativeText key={key} style={styles.text}>
        {value}
      </NativeText>
    );
  }

  if (Array.isArray(value)) {
    return value.map((item, index) => renderNode(item, index));
  }

  if (React.isValidElement(value)) {
    return value;
  }

  return null;
}

function nodeToInputValue(value: React.ReactNode): string | undefined {
  if (isPrimitive(value)) {
    return String(value);
  }

  return undefined;
}

function renderContent(props: WebParityElementProps): React.ReactNode {
  if (props.children !== undefined) {
    return props.children;
  }

  const collection = props.data ?? [];

  if (collection.length > 0) {
    return collection.map((item, index) => (
      <View key={String(index)} style={styles.root}>
        {props.renderItem ? props.renderItem(item, index) : renderNode(String(item))}
      </View>
    ));
  }

  const primary = props.label ?? props.title ?? props.value ?? props.placeholder;
  const secondary = props.description;

  if (!props.icon && primary == null && secondary == null && !props.badge) {
    return null;
  }

  return (
    <View style={props.orientation === "horizontal" ? styles.row : styles.root}>
      {renderNode(props.icon)}
      {renderNode(primary)}
      {renderNode(secondary)}
      {renderNode(props.badge)}
    </View>
  );
}

export function createWebParityComponent(
  displayName: string,
  kind: WebParityKind = "view",
): WebParityComponent {
  const Component = forwardRef<unknown, WebParityElementProps>((props, ref) => {
    const {
      accessibilityHint,
      accessibilityLabel,
      accessibilityRole,
      accessibilityState,
      autoCapitalize,
      autoCorrect,
      autoFocus,
      className,
      contentContainerStyle,
      defaultValue,
      disabled,
      editable,
      isDisabled,
      keyboardType,
      maxLength,
      multiline,
      nativeID,
      numberOfLines,
      onChangeText,
      onClick,
      onLayout,
      onPress,
      placeholder,
      secureTextEntry,
      style,
      testID,
      textStyle,
      value,
    } = props;
    const resolvedDisabled = disabled ?? isDisabled ?? false;
    const pressHandler = onPress ?? (onClick ? () => onClick() : undefined);
    const sharedProps = {
      accessibilityHint,
      accessibilityLabel,
      accessibilityState,
      nativeID,
      onLayout,
      testID,
    };

    if (kind === "input") {
      return (
        <TextInput
          ref={ref as React.Ref<NativeTextInputRef>}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          autoFocus={autoFocus}
          className={className}
          defaultValue={defaultValue ?? nodeToInputValue(value)}
          editable={editable ?? !resolvedDisabled}
          keyboardType={keyboardType}
          maxLength={maxLength}
          multiline={multiline}
          numberOfLines={numberOfLines}
          onChangeText={onChangeText}
          placeholder={placeholder}
          secureTextEntry={secureTextEntry}
          style={[styles.input, style as StyleProp<TextStyle>, textStyle]}
          {...sharedProps}
        />
      );
    }

    if (kind === "text") {
      return (
        <NativeText
          ref={ref as React.Ref<NativeTextRef>}
          className={className}
          style={[styles.text, textStyle]}
          {...sharedProps}
        >
          {props.children ?? props.label ?? props.title ?? props.value ?? props.placeholder}
        </NativeText>
      );
    }

    if (kind === "scroll") {
      return (
        <ScrollView
          ref={ref as React.Ref<NativeScrollViewRef>}
          className={className}
          contentContainerStyle={[styles.root, contentContainerStyle]}
          style={style}
          {...sharedProps}
        >
          {renderContent(props)}
        </ScrollView>
      );
    }

    if (kind === "pressable" || pressHandler) {
      return (
        <Pressable
          ref={ref as React.Ref<NativeViewRef>}
          accessibilityRole={accessibilityRole ?? "button"}
          className={className}
          disabled={resolvedDisabled}
          onPress={pressHandler}
          style={({ pressed }) => [styles.root, style, pressed && styles.pressed]}
          {...sharedProps}
        >
          {renderContent(props)}
        </Pressable>
      );
    }

    return (
      <View
        ref={ref as React.Ref<NativeViewRef>}
        className={className}
        style={[styles.root, style]}
        {...sharedProps}
      >
        {renderContent(props)}
      </View>
    );
  });

  Component.displayName = displayName;

  return Component;
}

export function createWebParityVariants(..._args: readonly unknown[]) {
  return "";
}
