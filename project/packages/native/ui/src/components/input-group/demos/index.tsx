import { useState } from "react";
import { Alert, View } from "react-native";

import {
  Button,
  FieldError,
  InputGroup,
  Label,
  Spinner,
  Surface,
  Text,
  TextArea,
  TextField,
} from "../..";

function TextPrefix({ children }: { children: string }) {
  return <Text className="text-sm text-muted">{children}</Text>;
}

function BaseInputGroup({
  disabled = false,
  invalid = false,
  placeholder = "Search",
  variant,
}: {
  disabled?: boolean;
  invalid?: boolean;
  placeholder?: string;
  variant?: "primary" | "secondary";
}) {
  return (
    <InputGroup className="w-full max-w-sm" isDisabled={disabled}>
      <InputGroup.Input isInvalid={invalid} placeholder={placeholder} variant={variant} />
    </InputGroup>
  );
}

export function Default() {
  return <BaseInputGroup placeholder="Enter amount" />;
}

export function Disabled() {
  return <BaseInputGroup disabled placeholder="Disabled input" />;
}

export function FullWidth() {
  return (
    <View className="w-full">
      <BaseInputGroup placeholder="Full width input" />
    </View>
  );
}

export function Invalid() {
  return (
    <TextField className="w-full max-w-sm" isInvalid>
      <InputGroup>
        <InputGroup.Input isInvalid placeholder="Invalid value" />
      </InputGroup>
      <FieldError>Enter a valid value.</FieldError>
    </TextField>
  );
}

export function OnSurface() {
  return (
    <Surface className="w-full max-w-sm rounded-3xl p-4" variant="secondary">
      <BaseInputGroup placeholder="On surface" variant="secondary" />
    </Surface>
  );
}

export function PasswordWithToggle() {
  const [visible, setVisible] = useState(false);

  return (
    <InputGroup className="w-full max-w-sm">
      <InputGroup.Input
        placeholder="Password"
        secureTextEntry={!visible}
        textContentType="password"
      />
      <InputGroup.Suffix>
        <Button onPress={() => setVisible((current) => !current)} size="sm" variant="tertiary">
          {visible ? "Hide" : "Show"}
        </Button>
      </InputGroup.Suffix>
    </InputGroup>
  );
}

export function Required() {
  return (
    <TextField className="w-full max-w-sm" isRequired>
      <Label>Email</Label>
      <InputGroup>
        <InputGroup.Input keyboardType="email-address" placeholder="you@example.com" />
      </InputGroup>
    </TextField>
  );
}

export function Variants() {
  return (
    <View className="w-full max-w-sm gap-3">
      <BaseInputGroup placeholder="Primary" variant="primary" />
      <BaseInputGroup placeholder="Secondary" variant="secondary" />
    </View>
  );
}

export function WithBadgeSuffix() {
  return (
    <InputGroup className="w-full max-w-sm">
      <InputGroup.Input placeholder="Repository" />
      <InputGroup.Suffix isDecorative>
        <Text className="rounded-xl bg-default px-2 py-1 text-xs text-muted">Public</Text>
      </InputGroup.Suffix>
    </InputGroup>
  );
}

export function WithCopySuffix() {
  return (
    <InputGroup className="w-full max-w-sm">
      <InputGroup.Input value="pitsiui.com/docs" />
      <InputGroup.Suffix>
        <Button onPress={() => Alert.alert("Copied")} size="sm" variant="tertiary">
          Copy
        </Button>
      </InputGroup.Suffix>
    </InputGroup>
  );
}

export function WithIconPrefixAndCopySuffix() {
  return (
    <InputGroup className="w-full max-w-sm">
      <InputGroup.Prefix isDecorative>
        <TextPrefix>@</TextPrefix>
      </InputGroup.Prefix>
      <InputGroup.Input value="pitsi-ui" />
      <InputGroup.Suffix>
        <Button size="sm" variant="tertiary">
          Copy
        </Button>
      </InputGroup.Suffix>
    </InputGroup>
  );
}

export function WithIconPrefixAndTextSuffix() {
  return (
    <InputGroup className="w-full max-w-sm">
      <InputGroup.Prefix isDecorative>
        <TextPrefix>$</TextPrefix>
      </InputGroup.Prefix>
      <InputGroup.Input keyboardType="decimal-pad" placeholder="Amount" />
      <InputGroup.Suffix isDecorative>
        <TextPrefix>USD</TextPrefix>
      </InputGroup.Suffix>
    </InputGroup>
  );
}

export function WithKeyboardShortcut() {
  return (
    <InputGroup className="w-full max-w-sm">
      <InputGroup.Input placeholder="Search command" />
      <InputGroup.Suffix isDecorative>
        <Text className="rounded-lg bg-default px-2 py-1 text-xs text-muted">Cmd K</Text>
      </InputGroup.Suffix>
    </InputGroup>
  );
}

export function WithLoadingSuffix() {
  return (
    <InputGroup className="w-full max-w-sm">
      <InputGroup.Input placeholder="Checking availability" />
      <InputGroup.Suffix isDecorative>
        <Spinner size="sm" />
      </InputGroup.Suffix>
    </InputGroup>
  );
}

export function WithPrefixAndSuffix() {
  return (
    <InputGroup className="w-full max-w-sm">
      <InputGroup.Prefix isDecorative>
        <TextPrefix>https://</TextPrefix>
      </InputGroup.Prefix>
      <InputGroup.Input placeholder="domain" />
      <InputGroup.Suffix isDecorative>
        <TextPrefix>.com</TextPrefix>
      </InputGroup.Suffix>
    </InputGroup>
  );
}

export function WithPrefixIcon() {
  return (
    <InputGroup className="w-full max-w-sm">
      <InputGroup.Prefix isDecorative>
        <TextPrefix>?</TextPrefix>
      </InputGroup.Prefix>
      <InputGroup.Input placeholder="Search" />
    </InputGroup>
  );
}

export function WithSuffixIcon() {
  return (
    <InputGroup className="w-full max-w-sm">
      <InputGroup.Input placeholder="Email" />
      <InputGroup.Suffix isDecorative>
        <TextPrefix>@</TextPrefix>
      </InputGroup.Suffix>
    </InputGroup>
  );
}

export function WithTextPrefix() {
  return (
    <InputGroup className="w-full max-w-sm">
      <InputGroup.Prefix isDecorative>
        <TextPrefix>https://</TextPrefix>
      </InputGroup.Prefix>
      <InputGroup.Input placeholder="pitsiui" />
    </InputGroup>
  );
}

export function WithTextSuffix() {
  return (
    <InputGroup className="w-full max-w-sm">
      <InputGroup.Input keyboardType="decimal-pad" placeholder="10" />
      <InputGroup.Suffix isDecorative>
        <TextPrefix>kg</TextPrefix>
      </InputGroup.Suffix>
    </InputGroup>
  );
}

export function WithTextArea() {
  return (
    <View className="w-full max-w-sm gap-2">
      <Label>Message</Label>
      <TextArea placeholder="Write a message" />
    </View>
  );
}
