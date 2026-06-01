import { View } from "react-native";

import { Chip, Separator, Text } from "../..";

const colors = ["accent", "default", "success", "warning", "danger"] as const;
const sizes = ["lg", "md", "sm"] as const;
const variants = ["primary", "secondary", "tertiary", "soft"] as const;

function IconText({ children }: { children: string }) {
  return <Text className="text-xs font-bold text-current">{children}</Text>;
}

export function Basic() {
  return (
    <View className="flex-row flex-wrap items-center gap-3">
      <Chip>Default</Chip>
      <Chip color="accent">Accent</Chip>
      <Chip color="success">Success</Chip>
      <Chip color="warning">Warning</Chip>
      <Chip color="danger">Danger</Chip>
    </View>
  );
}

export function Statuses() {
  return (
    <View className="gap-4">
      <View className="flex-row flex-wrap items-center gap-3">
        <Chip variant="primary">
          <IconText>.</IconText>
          <Chip.Label>Default</Chip.Label>
        </Chip>
        <Chip color="success" variant="primary">
          <IconText>.</IconText>
          <Chip.Label>Active</Chip.Label>
        </Chip>
        <Chip color="warning" variant="primary">
          <IconText>.</IconText>
          <Chip.Label>Pending</Chip.Label>
        </Chip>
        <Chip color="danger" variant="primary">
          <IconText>.</IconText>
          <Chip.Label>Inactive</Chip.Label>
        </Chip>
      </View>

      <View className="flex-row flex-wrap items-center gap-3">
        <Chip>
          <IconText>i</IconText>
          <Chip.Label>New Feature</Chip.Label>
        </Chip>
        <Chip color="success">
          <IconText>OK</IconText>
          <Chip.Label>Available</Chip.Label>
        </Chip>
        <Chip color="warning">
          <IconText>!</IconText>
          <Chip.Label>Beta</Chip.Label>
        </Chip>
        <Chip color="danger">
          <IconText>x</IconText>
          <Chip.Label>Deprecated</Chip.Label>
        </Chip>
      </View>
    </View>
  );
}

export function Variants() {
  return (
    <View className="gap-8">
      {sizes.map((size, index) => (
        <View className="gap-4" key={size}>
          <Text className="text-sm font-semibold text-muted">{size}</Text>
          <View className="flex-row items-center gap-3">
            <View className="w-24" />
            {colors.map((color) => (
              <View className="w-[130px] items-center" key={color}>
                <Text className="text-xs text-muted">{color}</Text>
              </View>
            ))}
          </View>
          <View className="gap-3">
            {variants.map((variant) => (
              <View className="flex-row items-center gap-3" key={variant}>
                <Text className="w-24 text-sm text-muted">{variant}</Text>
                {colors.map((color) => (
                  <View className="w-[130px] items-center" key={color}>
                    <Chip color={color} size={size} variant={variant}>
                      <IconText>o</IconText>
                      <Chip.Label>Label</Chip.Label>
                      <IconText>o</IconText>
                    </Chip>
                  </View>
                ))}
              </View>
            ))}
          </View>
          {index < sizes.length - 1 ? <Separator /> : null}
        </View>
      ))}
    </View>
  );
}

export function WithIcon() {
  return (
    <View className="flex-row flex-wrap items-center gap-3">
      <Chip>
        <IconText>i</IconText>
        <Chip.Label>Information</Chip.Label>
      </Chip>
      <Chip color="success">
        <IconText>OK</IconText>
        <Chip.Label>Completed</Chip.Label>
      </Chip>
      <Chip color="warning">
        <IconText>...</IconText>
        <Chip.Label>Pending</Chip.Label>
      </Chip>
      <Chip color="danger">
        <IconText>x</IconText>
        <Chip.Label>Failed</Chip.Label>
      </Chip>
      <Chip color="accent">
        <Chip.Label>Label</Chip.Label>
        <IconText>v</IconText>
      </Chip>
    </View>
  );
}
