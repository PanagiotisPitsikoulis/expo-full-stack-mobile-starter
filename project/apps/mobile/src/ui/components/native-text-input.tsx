import { forwardRef, useImperativeHandle, useRef } from "react";
import {
  Platform,
  type TextInput as RNTextInput,
  TextInput,
  type TextInputProps,
} from "react-native";

type SwiftUiModule = typeof import("@expo/ui/swift-ui");
type SwiftUiModifiersModule = typeof import("@expo/ui/swift-ui/modifiers");

let swiftUi: SwiftUiModule | undefined;
let swiftModifiers: SwiftUiModifiersModule | undefined;

if (Platform.OS === "ios") {
  swiftUi = require("@expo/ui/swift-ui") as SwiftUiModule;
  swiftModifiers = require("@expo/ui/swift-ui/modifiers") as SwiftUiModifiersModule;
}

export type NativeTextInputHandle = {
  getValue: () => string;
  setValue: (next: string) => void;
};

export type NativeTextInputProps = {
  initialValue?: string;
  onChangeText?: (value: string) => void;
  onSubmit?: (value: string) => void;
  placeholder?: string;
  keyboardType?: TextInputProps["keyboardType"];
  autoCapitalize?: TextInputProps["autoCapitalize"];
  secureTextEntry?: boolean;
};

const IosNative = forwardRef<NativeTextInputHandle, NativeTextInputProps>(function IosNative(
  { initialValue = "", onChangeText, onSubmit, placeholder, keyboardType, autoCapitalize },
  ref,
) {
  const ui = swiftUi as SwiftUiModule;
  const text = ui.useNativeState(initialValue);

  useImperativeHandle(
    ref,
    () => ({
      getValue: () => text.value,
      setValue: (next) => {
        text.value = next;
      },
    }),
    [text],
  );

  const Host = ui.Host;
  const TextField = ui.TextField;

  const mods: unknown[] = [];
  if (keyboardType && swiftModifiers?.keyboardType) {
    const keyboardMap = {
      default: "default",
      "number-pad": "decimal-pad",
      "decimal-pad": "decimal-pad",
      numeric: "decimal-pad",
      "email-address": "email-address",
      "phone-pad": "phone-pad",
      url: "url",
      "visible-password": "default",
      "ascii-capable": "ascii-capable",
      "numbers-and-punctuation": "numbers-and-punctuation",
      "name-phone-pad": "name-phone-pad",
      twitter: "twitter",
      "web-search": "web-search",
    } as const;
    const mapped =
      keyboardMap[(keyboardType as keyof typeof keyboardMap) ?? "default"] ?? "default";
    mods.push(
      swiftModifiers.keyboardType(mapped as Parameters<typeof swiftModifiers.keyboardType>[0]),
    );
  }
  if (swiftModifiers?.onSubmit && onSubmit) {
    mods.push(swiftModifiers.onSubmit(() => onSubmit(text.value)));
  }
  if (autoCapitalize && swiftModifiers?.textInputAutocapitalization) {
    const autoMap = {
      none: "never",
      sentences: "sentences",
      words: "words",
      characters: "characters",
    } as const;
    const mapped = autoMap[autoCapitalize as keyof typeof autoMap];
    if (mapped) {
      mods.push(
        swiftModifiers.textInputAutocapitalization(
          mapped as Parameters<typeof swiftModifiers.textInputAutocapitalization>[0],
        ),
      );
    }
  }

  return (
    <Host matchContents>
      <TextField
        modifiers={mods as never}
        onTextChange={(value: string) => {
          onChangeText?.(value);
        }}
        placeholder={placeholder ?? ""}
        text={text}
      />
    </Host>
  );
});

const IosBridge = forwardRef<NativeTextInputHandle, NativeTextInputProps>(
  function IosBridge(props, ref) {
    // SwiftUI's TextField does not render obscured text; fall back to the plain
    // RN TextInput when a caller asks for `secureTextEntry`.
    if (props.secureTextEntry) {
      return <RnFallback {...props} ref={ref} />;
    }
    return <IosNative {...props} ref={ref} />;
  },
);

const RnFallback = forwardRef<NativeTextInputHandle, NativeTextInputProps>(function RnFallback(
  {
    initialValue = "",
    onChangeText,
    onSubmit,
    placeholder,
    keyboardType,
    autoCapitalize,
    secureTextEntry,
  },
  ref,
) {
  const inputRef = useRef<RNTextInput>(null);
  const valueRef = useRef(initialValue);

  useImperativeHandle(
    ref,
    () => ({
      getValue: () => valueRef.current,
      setValue: (next) => {
        valueRef.current = next;
        inputRef.current?.setNativeProps({ text: next });
      },
    }),
    [],
  );

  return (
    <TextInput
      ref={inputRef}
      autoCapitalize={autoCapitalize}
      defaultValue={initialValue}
      keyboardType={keyboardType}
      onChangeText={(value) => {
        valueRef.current = value;
        onChangeText?.(value);
      }}
      onSubmitEditing={() => onSubmit?.(valueRef.current)}
      placeholder={placeholder}
      secureTextEntry={secureTextEntry}
    />
  );
});

/**
 * Text input that owns its value on the native side via `useNativeState`
 * on iOS, with a plain react-native TextInput fallback elsewhere. Use
 * when text changes are high-frequency and you don't want every keystroke
 * to round-trip through React state.
 */
export const NativeTextInput = Platform.OS === "ios" ? IosBridge : RnFallback;
