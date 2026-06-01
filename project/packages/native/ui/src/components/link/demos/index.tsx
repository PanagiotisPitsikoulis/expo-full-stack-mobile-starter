import { View } from "react-native";

import { Link, Text } from "../..";

function ArrowIcon() {
  return (
    <Link.Icon>
      <Text className="text-link">-&gt;</Text>
    </Link.Icon>
  );
}

export function Basic() {
  return (
    <Link href="#">
      <Text className="text-link underline">Call to action</Text>
      <ArrowIcon />
    </Link>
  );
}

export function CustomIcon() {
  return (
    <View className="gap-3">
      <Link href="#">
        <Text className="text-link underline">External link</Text>
        <Link.Icon>
          <Text className="text-link">^</Text>
        </Link.Icon>
      </Link>
      <Link className="gap-1" href="#">
        <Text className="text-link underline">Go to page</Text>
        <ArrowIcon />
      </Link>
    </View>
  );
}

export function CustomRenderFunction() {
  return (
    <Link href="#">
      <Text className="text-link underline">Call to action</Text>
      <ArrowIcon />
    </Link>
  );
}

export function IconPlacement() {
  return (
    <View className="gap-3">
      <Link href="#">
        <Text className="text-link underline">Icon at end (default)</Text>
        <ArrowIcon />
      </Link>
      <Link className="gap-1" href="#">
        <ArrowIcon />
        <Text className="text-link underline">Icon at start</Text>
      </Link>
    </View>
  );
}

export function UnderlineAndOffset() {
  return (
    <View className="gap-6">
      <View className="gap-2">
        <Text className="text-sm font-medium text-muted">Always visible underline</Text>
        <Link href="#">
          <Text className="text-link underline">Underline always visible</Text>
          <ArrowIcon />
        </Link>
      </View>

      <View className="gap-2">
        <Text className="text-sm font-medium text-muted">No underline</Text>
        <Link href="#">
          <Text className="text-link">Link without any underline</Text>
          <ArrowIcon />
        </Link>
      </View>

      <View className="gap-2">
        <Text className="text-sm font-medium text-muted">Changing the underline offset</Text>
        <View className="gap-3">
          {["1", "2", "3", "4"].map((offset) => (
            <Link href="#" key={offset}>
              <Text className="text-link underline">Offset {offset}</Text>
              <ArrowIcon />
            </Link>
          ))}
        </View>
      </View>
    </View>
  );
}
