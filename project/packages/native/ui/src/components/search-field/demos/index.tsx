import { useState } from "react";
import { Alert, View } from "react-native";

import { Button, Description, FieldError, Label, SearchField, Surface, Text } from "../..";

function SearchBox({
  disabled = false,
  invalid = false,
  placeholder = "Search",
  required = false,
  value,
  variant,
}: {
  disabled?: boolean;
  invalid?: boolean;
  placeholder?: string;
  required?: boolean;
  value?: string;
  variant?: "primary" | "secondary";
}) {
  const [query, setQuery] = useState(value ?? "");

  return (
    <SearchField
      className="w-full max-w-sm"
      isDisabled={disabled}
      isInvalid={invalid}
      isRequired={required}
      onChange={setQuery}
      value={query}
    >
      <SearchField.Group>
        <SearchField.SearchIcon />
        <SearchField.Input placeholder={placeholder} variant={variant} />
        <SearchField.ClearButton />
      </SearchField.Group>
    </SearchField>
  );
}

export function Basic() {
  return <SearchBox placeholder="Search projects" />;
}

export function Controlled() {
  const [value, setValue] = useState("design");

  return (
    <View className="w-full max-w-sm gap-2">
      <SearchField onChange={setValue} value={value}>
        <SearchField.Group>
          <SearchField.SearchIcon />
          <SearchField.Input placeholder="Search docs" />
          <SearchField.ClearButton />
        </SearchField.Group>
      </SearchField>
      <Text className="text-sm text-muted">Query: {value || "empty"}</Text>
    </View>
  );
}

export function CustomIcons() {
  return (
    <SearchField className="w-full max-w-sm">
      <SearchField.Group>
        <SearchField.SearchIcon>
          <Text className="text-muted">?</Text>
        </SearchField.SearchIcon>
        <SearchField.Input placeholder="Custom icon search" />
        <SearchField.ClearButton>
          <Text className="text-muted">x</Text>
        </SearchField.ClearButton>
      </SearchField.Group>
    </SearchField>
  );
}

export function CustomRenderFunction() {
  const [value, setValue] = useState("tasks");

  return (
    <Surface className="w-full max-w-sm rounded-3xl p-3" variant="secondary">
      <SearchField onChange={setValue} value={value}>
        <SearchField.Group>
          <SearchField.SearchIcon />
          <SearchField.Input placeholder="Search within panel" variant="secondary" />
          <SearchField.ClearButton />
        </SearchField.Group>
      </SearchField>
    </Surface>
  );
}

export function Disabled() {
  return <SearchBox disabled placeholder="Search" value="Locked" />;
}

export function FormExample() {
  const [value, setValue] = useState("");

  return (
    <View className="w-full max-w-sm gap-3">
      <Label nativeID="search-label">Search knowledge base</Label>
      <SearchField onChange={setValue} value={value}>
        <SearchField.Group>
          <SearchField.SearchIcon />
          <SearchField.Input accessibilityLabelledBy="search-label" placeholder="Billing" />
          <SearchField.ClearButton />
        </SearchField.Group>
      </SearchField>
      <Button className="self-start" onPress={() => Alert.alert(`Searching for ${value}`)}>
        Search
      </Button>
    </View>
  );
}

export function FullWidth() {
  return (
    <View className="w-full">
      <SearchBox placeholder="Full width search" />
    </View>
  );
}

export function OnSurface() {
  return (
    <Surface className="w-full max-w-sm rounded-3xl p-4" variant="secondary">
      <SearchBox placeholder="Search on surface" variant="secondary" />
    </Surface>
  );
}

export function Required() {
  return (
    <View className="w-full max-w-sm gap-1">
      <Label isRequired nativeID="required-search-label">
        Search
      </Label>
      <SearchBox placeholder="Required search" required />
    </View>
  );
}

export function Validation() {
  return <SearchBox invalid placeholder="Invalid search" value="a" />;
}

export function Variants() {
  return (
    <View className="w-full max-w-sm gap-3">
      <SearchBox placeholder="Primary search" variant="primary" />
      <SearchBox placeholder="Secondary search" variant="secondary" />
    </View>
  );
}

export function WithDescription() {
  return (
    <View className="w-full max-w-sm gap-1">
      <Label nativeID="search-with-description-label">Search</Label>
      <SearchBox placeholder="Search docs" />
      <Description>Search title, tags, and body content.</Description>
    </View>
  );
}

export function WithKeyboardShortcut() {
  return (
    <SearchField className="w-full max-w-sm">
      <SearchField.Group>
        <SearchField.SearchIcon />
        <SearchField.Input placeholder="Search commands" />
        <View className="absolute right-11 rounded-lg bg-default px-2 py-1">
          <Text className="text-xs text-muted">Cmd K</Text>
        </View>
        <SearchField.ClearButton />
      </SearchField.Group>
    </SearchField>
  );
}

export function WithValidation() {
  const [value, setValue] = useState("a");
  const invalid = value.length > 0 && value.length < 2;

  return (
    <View className="w-full max-w-sm gap-1">
      <SearchField isInvalid={invalid} onChange={setValue} value={value}>
        <SearchField.Group>
          <SearchField.SearchIcon />
          <SearchField.Input placeholder="At least 2 characters" />
          <SearchField.ClearButton />
        </SearchField.Group>
      </SearchField>
      <FieldError isInvalid={invalid}>Enter at least 2 characters.</FieldError>
    </View>
  );
}
