import { View } from "react-native";

import { Slider, Text } from "../..";

function SliderControl({
  defaultValue = 42,
  disabled = false,
  orientation = "horizontal",
}: {
  defaultValue?: number | number[];
  disabled?: boolean;
  orientation?: "horizontal" | "vertical";
}) {
  return (
    <Slider
      className={orientation === "vertical" ? "h-48" : "w-full max-w-[340px]"}
      defaultValue={defaultValue}
      isDisabled={disabled}
      orientation={orientation}
    >
      <Slider.Output />
      <Slider.Track>
        <Slider.Fill />
        {Array.isArray(defaultValue) ? (
          <>
            <Slider.Thumb index={0} />
            <Slider.Thumb index={1} />
          </>
        ) : (
          <Slider.Thumb />
        )}
      </Slider.Track>
    </Slider>
  );
}

export function CustomRenderFunction() {
  return (
    <Slider className="w-full max-w-[340px]" defaultValue={35}>
      <View className="flex-row items-center justify-between">
        <Text className="text-sm font-medium text-muted">Volume</Text>
        <Slider.Output />
      </View>
      <Slider.Track>
        <Slider.Fill />
        <Slider.Thumb />
      </Slider.Track>
    </Slider>
  );
}

export function Default() {
  return <SliderControl />;
}

export function Disabled() {
  return <SliderControl defaultValue={64} disabled />;
}

export function Range() {
  return <SliderControl defaultValue={[20, 72]} />;
}

export function Vertical() {
  return <SliderControl defaultValue={35} orientation="vertical" />;
}
