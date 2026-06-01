import { View } from "react-native";

import { Avatar, Separator, Text } from "../..";

const users = [
  {
    id: 1,
    image: "https://pitsiui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/blue.jpg",
    name: "John Doe",
  },
  {
    id: 2,
    image: "https://pitsiui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/green.jpg",
    name: "Kate Wilson",
  },
  {
    id: 3,
    image: "https://pitsiui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/purple.jpg",
    name: "Emily Chen",
  },
  {
    id: 4,
    image: "https://pitsiui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/orange.jpg",
    name: "Michael Brown",
  },
  {
    id: 5,
    image: "https://pitsiui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/red.jpg",
    name: "Olivia Davis",
  },
];

const colors = ["default", "accent", "success", "warning", "danger"] as const;

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("");
}

export function Basic() {
  return (
    <View className="flex-row items-center gap-4">
      <Avatar alt="John Doe">
        <Avatar.Image source={{ uri: "https://img.pitsiui.chat/image/avatar?w=400&h=400&u=3" }} />
        <Avatar.Fallback>JD</Avatar.Fallback>
      </Avatar>
      <Avatar alt="Blue">
        <Avatar.Image
          source={{
            uri: "https://pitsiui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/blue.jpg",
          }}
        />
        <Avatar.Fallback>B</Avatar.Fallback>
      </Avatar>
      <Avatar alt="JR">
        <Avatar.Fallback>JR</Avatar.Fallback>
      </Avatar>
    </View>
  );
}

export function Colors() {
  return (
    <View className="flex-row flex-wrap items-center gap-4">
      {colors.map((color) => (
        <Avatar alt={`${color} avatar`} color={color} key={color}>
          <Avatar.Fallback>{color.slice(0, 2).toUpperCase()}</Avatar.Fallback>
        </Avatar>
      ))}
    </View>
  );
}

export function CustomStyles() {
  return (
    <View className="flex-row flex-wrap items-center gap-4">
      <Avatar alt="Extra Large" className="size-16">
        <Avatar.Image
          source={{
            uri: "https://pitsiui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/blue.jpg",
          }}
        />
        <Avatar.Fallback>XL</Avatar.Fallback>
      </Avatar>

      <Avatar alt="Square Avatar" className="rounded-lg">
        <Avatar.Image
          source={{
            uri: "https://pitsiui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/purple.jpg",
          }}
        />
        <Avatar.Fallback className="rounded-lg">SQ</Avatar.Fallback>
      </Avatar>

      <Avatar alt="Gradient Border" className="border-2 border-warning p-0.5">
        <Avatar.Image
          source={{ uri: "https://pitsiui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/red.jpg" }}
        />
        <Avatar.Fallback>GB</Avatar.Fallback>
      </Avatar>

      <View>
        <Avatar alt="Online User">
          <Avatar.Image
            source={{
              uri: "https://pitsiui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/orange.jpg",
            }}
          />
          <Avatar.Fallback>ON</Avatar.Fallback>
        </Avatar>
        <View className="absolute right-0 bottom-0 size-3 rounded-full border-2 border-background bg-success" />
      </View>
    </View>
  );
}

export function Fallback() {
  return (
    <View className="flex-row flex-wrap items-center gap-4">
      <Avatar alt="John Doe">
        <Avatar.Fallback>JD</Avatar.Fallback>
      </Avatar>

      <Avatar alt="Icon fallback">
        <Avatar.Fallback>
          <Text className="text-base text-accent">P</Text>
        </Avatar.Fallback>
      </Avatar>

      <Avatar alt="Delayed Avatar">
        <Avatar.Image source={{ uri: "https://invalid-url-to-show-fallback.com/image.jpg" }} />
        <Avatar.Fallback delayMs={600}>NA</Avatar.Fallback>
      </Avatar>

      <Avatar alt="Gradient fallback">
        <Avatar.Fallback className="border-none bg-danger">
          <Text className="text-white">GB</Text>
        </Avatar.Fallback>
      </Avatar>
    </View>
  );
}

export function Group() {
  return (
    <View className="gap-6">
      <View className="flex-row">
        {users.slice(0, 4).map((user, index) => (
          <Avatar
            alt={user.name}
            className="border-2 border-background"
            key={user.id}
            style={{ marginLeft: index ? -8 : 0 }}
          >
            <Avatar.Image source={{ uri: user.image }} />
            <Avatar.Fallback>{initials(user.name)}</Avatar.Fallback>
          </Avatar>
        ))}
      </View>

      <View className="flex-row">
        {users.slice(0, 3).map((user, index) => (
          <Avatar
            alt={user.name}
            className="border-2 border-background"
            key={user.id}
            style={{ marginLeft: index ? -8 : 0 }}
          >
            <Avatar.Image source={{ uri: user.image }} />
            <Avatar.Fallback>{initials(user.name)}</Avatar.Fallback>
          </Avatar>
        ))}
        <Avatar
          alt="Additional users"
          className="border-2 border-background"
          style={{ marginLeft: -8 }}
        >
          <Avatar.Fallback textProps={{ className: "text-xs" }}>
            +{users.length - 3}
          </Avatar.Fallback>
        </Avatar>
      </View>
    </View>
  );
}

export function Sizes() {
  return (
    <View className="flex-row items-center gap-4">
      <Avatar alt="Small Avatar" size="sm">
        <Avatar.Image
          source={{
            uri: "https://pitsiui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/blue.jpg",
          }}
        />
        <Avatar.Fallback>SM</Avatar.Fallback>
      </Avatar>
      <Avatar alt="Medium Avatar" size="md">
        <Avatar.Image
          source={{
            uri: "https://pitsiui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/purple.jpg",
          }}
        />
        <Avatar.Fallback>MD</Avatar.Fallback>
      </Avatar>
      <Avatar alt="Large Avatar" size="lg">
        <Avatar.Image
          source={{ uri: "https://pitsiui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/red.jpg" }}
        />
        <Avatar.Fallback>LG</Avatar.Fallback>
      </Avatar>
    </View>
  );
}

export function Variants() {
  const rows = [
    { label: "letter", soft: false },
    { label: "letter soft", soft: true },
    { label: "icon", soft: false },
    { label: "icon soft", soft: true },
  ];

  return (
    <View className="gap-4">
      <View className="flex-row items-center gap-3">
        <View className="w-24" />
        {colors.map((color) => (
          <View className="w-20 items-center" key={color}>
            <Text className="text-xs text-muted">{color}</Text>
          </View>
        ))}
      </View>

      <Separator />

      {rows.map((row) => (
        <View className="flex-row items-center gap-3" key={row.label}>
          <Text className="w-24 text-sm text-muted">{row.label}</Text>
          {colors.map((color) => (
            <View className="w-20 items-center" key={color}>
              <Avatar
                alt={`${row.label} ${color}`}
                color={color}
                variant={row.soft ? "soft" : "default"}
              >
                <Avatar.Fallback>{row.label.includes("icon") ? "P" : "AG"}</Avatar.Fallback>
              </Avatar>
            </View>
          ))}
        </View>
      ))}

      <View className="flex-row items-center gap-3">
        <Text className="w-24 text-sm text-muted">img</Text>
        {users.slice(0, colors.length).map((user, index) => (
          <View className="w-20 items-center" key={user.id}>
            <Avatar alt={user.name} color={colors[index]}>
              <Avatar.Image source={{ uri: user.image }} />
              <Avatar.Fallback>{initials(user.name).slice(0, 1)}</Avatar.Fallback>
            </Avatar>
          </View>
        ))}
      </View>
    </View>
  );
}
