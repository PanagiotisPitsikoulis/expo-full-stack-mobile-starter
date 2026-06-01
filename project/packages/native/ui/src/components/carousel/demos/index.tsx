import { View } from "react-native";

import { Carousel, Text } from "../..";

export function Basic() {
  return (
    <Carousel className="w-full">
      <Carousel.Content>
        {[1, 2, 3].map((item) => (
          <Carousel.Item className="mr-3 rounded-2xl bg-default p-6" key={item}>
            <Text className="text-lg font-semibold text-foreground">Slide {item}</Text>
            <Text className="text-sm text-muted">Swipe horizontally or use the controls.</Text>
          </Carousel.Item>
        ))}
      </Carousel.Content>
      <View className="flex-row gap-2">
        <Carousel.Previous />
        <Carousel.Next />
      </View>
    </Carousel>
  );
}

export { Basic as Vertical };
