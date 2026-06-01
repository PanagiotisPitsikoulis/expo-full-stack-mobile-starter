import { useMemo, useState } from "react";
import { View } from "react-native";
import type { Key } from "../..";
import { Description, ErrorMessage, Label, Tag, TagGroup } from "../..";

const categories = [
  { id: "news", label: "News" },
  { id: "travel", label: "Travel" },
  { id: "gaming", label: "Gaming" },
  { id: "shopping", label: "Shopping" },
];

function RequiredCategories() {
  const [selected, setSelected] = useState<"all" | Set<Key>>(new Set());
  const isInvalid = useMemo(
    () => selected !== "all" && Array.from(selected).length === 0,
    [selected],
  );

  return (
    <TagGroup selectedKeys={selected} selectionMode="multiple" onSelectionChange={setSelected}>
      <Label>Required Categories</Label>
      <TagGroup.List>
        {categories.map((category) => (
          <Tag id={category.id} key={category.id}>
            {category.label}
          </Tag>
        ))}
      </TagGroup.List>
      <Description>Select at least one category</Description>
      <View className="min-h-5">
        {isInvalid ? <ErrorMessage>Please select at least one category</ErrorMessage> : null}
      </View>
    </TagGroup>
  );
}

export function Basic() {
  return <RequiredCategories />;
}

export function WithTagGroup() {
  return <RequiredCategories />;
}
