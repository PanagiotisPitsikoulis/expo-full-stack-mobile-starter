import { useState } from "react";

import { FieldError, Input, Label, TextField } from "../..";

export function Basic() {
  const [value, setValue] = useState("jr");
  const isInvalid = value.length > 0 && value.length < 3;

  return (
    <TextField className="w-64" isInvalid={isInvalid}>
      <Label nativeID="username-label">Username</Label>
      <Input
        accessibilityLabelledBy="username-label"
        onChangeText={setValue}
        placeholder="Enter username"
        value={value}
      />
      <FieldError>Username must be at least 3 characters</FieldError>
    </TextField>
  );
}
