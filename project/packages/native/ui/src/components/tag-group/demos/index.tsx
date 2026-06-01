import { useState } from "react";
import { View } from "react-native";

import { Description, ErrorMessage, Label, TagGroup, Text } from "../..";

const interests = ["Strength", "Cardio", "Mobility", "Recovery"];

function TagList({
  disabled = false,
  removable = false,
  size,
  variant,
}: {
  disabled?: boolean;
  removable?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "surface";
}) {
  const [tags, setTags] = useState(interests);

  return (
    <TagGroup
      defaultSelectedKeys={["Strength"]}
      isDisabled={disabled}
      onRemove={(keys) => setTags((current) => current.filter((tag) => !keys.has(tag)))}
      selectionMode="multiple"
      size={size}
      variant={variant}
    >
      <TagGroup.List
        renderEmptyState={() => <Text className="text-sm text-muted">No tags remaining</Text>}
      >
        {tags.map((interest) => (
          <TagGroup.Item id={interest} key={interest}>
            <TagGroup.ItemLabel>{interest}</TagGroup.ItemLabel>
            {removable ? (
              <TagGroup.ItemRemoveButton accessibilityLabel={`Remove ${interest}`} />
            ) : null}
          </TagGroup.Item>
        ))}
      </TagGroup.List>
    </TagGroup>
  );
}

export function Basic() {
  return <TagList />;
}

export function Controlled() {
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set(["Cardio"]));

  return (
    <View className="gap-3">
      <TagGroup
        onSelectionChange={(keys) => setSelectedKeys(new Set(Array.from(keys, String)))}
        selectedKeys={selectedKeys}
        selectionMode="multiple"
      >
        <TagGroup.List>
          {interests.map((interest) => (
            <TagGroup.Item id={interest} key={interest}>
              {interest}
            </TagGroup.Item>
          ))}
        </TagGroup.List>
      </TagGroup>
      <Text className="text-sm text-muted">Selected: {Array.from(selectedKeys).join(", ")}</Text>
    </View>
  );
}

export function CustomRenderFunction() {
  return (
    <TagGroup defaultSelectedKeys={["Strength"]} selectionMode="multiple">
      <TagGroup.List>
        {interests.map((interest) => (
          <TagGroup.Item id={interest} key={interest}>
            {({ isSelected }) => (
              <Text className={isSelected ? "text-accent" : "text-foreground"}>{interest}</Text>
            )}
          </TagGroup.Item>
        ))}
      </TagGroup.List>
    </TagGroup>
  );
}

export function Disabled() {
  return <TagList disabled />;
}

export function SelectionModes() {
  return (
    <View className="gap-4">
      <TagList />
      <TagGroup defaultSelectedKeys={["Cardio"]} selectionMode="single">
        <TagGroup.List>
          {interests.map((interest) => (
            <TagGroup.Item id={interest} key={interest}>
              {interest}
            </TagGroup.Item>
          ))}
        </TagGroup.List>
      </TagGroup>
    </View>
  );
}

export function Sizes() {
  return (
    <View className="gap-4">
      {(["sm", "md", "lg"] as const).map((size) => (
        <TagList key={size} size={size} />
      ))}
    </View>
  );
}

export function Variants() {
  return (
    <View className="gap-4">
      <TagList variant="default" />
      <TagList variant="surface" />
    </View>
  );
}

export function WithErrorMessage() {
  return (
    <TagGroup isInvalid selectionMode="multiple">
      <Label>Required Categories</Label>
      <TagGroup.List>
        {interests.map((interest) => (
          <TagGroup.Item id={interest} key={interest}>
            {interest}
          </TagGroup.Item>
        ))}
      </TagGroup.List>
      <Description>Select at least one category</Description>
      <ErrorMessage>Please select at least one category</ErrorMessage>
    </TagGroup>
  );
}

export function WithListData() {
  return <TagList />;
}

export function WithPrefix() {
  return (
    <TagGroup defaultSelectedKeys={["Strength"]} selectionMode="multiple">
      <TagGroup.List>
        {interests.map((interest) => (
          <TagGroup.Item id={interest} key={interest}>
            <Text className="text-xs text-muted">#</Text>
            <TagGroup.ItemLabel>{interest}</TagGroup.ItemLabel>
          </TagGroup.Item>
        ))}
      </TagGroup.List>
    </TagGroup>
  );
}

export function WithRemoveButton() {
  return <TagList removable />;
}
