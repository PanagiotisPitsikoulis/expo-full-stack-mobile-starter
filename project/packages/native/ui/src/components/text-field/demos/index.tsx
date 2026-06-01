import { useState } from "react";
import { View } from "react-native";

import {
  Description,
  FieldError,
  Input,
  Label,
  TextArea as NativeTextArea,
  Surface,
  TextField,
} from "../..";

export function Basic() {
  return (
    <TextField className="w-full max-w-sm">
      <Label>Workspace name</Label>
      <Input placeholder="Acme" />
    </TextField>
  );
}

export function Controlled() {
  const [value, setValue] = useState("Acme");

  return (
    <TextField className="w-full max-w-sm">
      <Label>Workspace name</Label>
      <Input onChangeText={setValue} placeholder="Acme" value={value} />
      <Description>Current value: {value || "empty"}</Description>
    </TextField>
  );
}

export function CustomRenderFunction() {
  return (
    <Surface className="w-full max-w-sm rounded-3xl p-4" variant="secondary">
      <TextField>
        <Label>Custom container</Label>
        <Input placeholder="Inside a surface" variant="secondary" />
      </TextField>
    </Surface>
  );
}

export function Disabled() {
  return (
    <TextField className="w-full max-w-sm" isDisabled>
      <Label>Plan</Label>
      <Input value="Enterprise" />
      <Description>Managed by your organization.</Description>
    </TextField>
  );
}

export function FullWidth() {
  return (
    <View className="w-full">
      <TextField>
        <Label>Full width</Label>
        <Input className="w-full" placeholder="Full width input" />
      </TextField>
    </View>
  );
}

export function InputTypes() {
  return (
    <View className="w-full max-w-sm gap-4">
      <TextField>
        <Label>Email</Label>
        <Input keyboardType="email-address" placeholder="you@example.com" />
      </TextField>
      <TextField>
        <Label>Age</Label>
        <Input keyboardType="number-pad" placeholder="30" />
      </TextField>
      <TextField>
        <Label>Password</Label>
        <Input placeholder="Password" secureTextEntry textContentType="password" />
      </TextField>
    </View>
  );
}

export function OnSurface() {
  return (
    <Surface className="w-full max-w-sm rounded-3xl p-4" variant="secondary">
      <TextField>
        <Label>Email</Label>
        <Input placeholder="you@example.com" variant="secondary" />
      </TextField>
    </Surface>
  );
}

export function Required() {
  return (
    <TextField className="w-full max-w-sm" isRequired>
      <Label>Email</Label>
      <Input keyboardType="email-address" placeholder="you@example.com" />
    </TextField>
  );
}

export function TextArea() {
  return (
    <TextField className="w-full max-w-sm">
      <Label>Message</Label>
      <NativeTextArea placeholder="Write a message" />
    </TextField>
  );
}

export function Validation() {
  const [value, setValue] = useState("jr");
  const isInvalid = value.length > 0 && value.length < 3;

  return (
    <TextField className="w-full max-w-sm" isInvalid={isInvalid}>
      <Label>Username</Label>
      <Input onChangeText={setValue} placeholder="Enter username" value={value} />
      <FieldError>Username must be at least 3 characters</FieldError>
    </TextField>
  );
}

export function WithDescription() {
  return (
    <TextField className="w-full max-w-sm">
      <Label>Email</Label>
      <Input keyboardType="email-address" placeholder="you@example.com" />
      <Description>We'll never share your email with anyone else.</Description>
    </TextField>
  );
}

export function WithError() {
  return (
    <TextField className="w-full max-w-sm" isInvalid>
      <Label>Email</Label>
      <Input keyboardType="email-address" placeholder="you@example.com" />
      <FieldError>Email is required.</FieldError>
    </TextField>
  );
}
