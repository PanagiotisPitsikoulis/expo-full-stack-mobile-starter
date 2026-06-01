import { BottomSheet } from "@pitsi-ui/native/bottom-sheet";
import { Button } from "@pitsi-ui/native/button";
import { NumberField } from "@pitsi-ui/native/number-field";
import { Switch } from "@pitsi-ui/native/switch";
import { Text } from "@pitsi-ui/native/text";
import { Pressable, ScrollView, View } from "react-native";
import {
  FILTER_AMENITIES,
  type PriceBounds,
  type StayFilters,
  type StayPlaceType,
} from "../../lib/api/travel";

const PLACE_TYPES: Array<[StayPlaceType, string]> = [
  ["any", "Any type"],
  ["room", "Room"],
  ["entire", "Entire home"],
];

function toggleValue<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

function Stepper({
  label,
  onChange,
  value,
}: {
  label: string;
  onChange: (value: number) => void;
  value: number;
}) {
  return (
    <View className="flex-row items-center justify-between">
      <Text className="text-[16px] text-foreground">{label}</Text>
      <View className="flex-row items-center gap-4">
        <Pressable
          accessibilityLabel={`Decrease ${label}`}
          accessibilityRole="button"
          className="size-9 items-center justify-center rounded-full border border-border"
          disabled={value <= 0}
          hitSlop={6}
          onPress={() => onChange(Math.max(0, value - 1))}
          style={{ borderCurve: "continuous" }}
        >
          <Text className="text-[20px] text-foreground">−</Text>
        </Pressable>
        <Text className="w-12 text-center text-[16px] text-foreground">
          {value === 0 ? "Any" : `${value}+`}
        </Text>
        <Pressable
          accessibilityLabel={`Increase ${label}`}
          accessibilityRole="button"
          className="size-9 items-center justify-center rounded-full border border-foreground"
          hitSlop={6}
          onPress={() => onChange(value + 1)}
          style={{ borderCurve: "continuous" }}
        >
          <Text className="text-[20px] text-foreground">+</Text>
        </Pressable>
      </View>
    </View>
  );
}

export function FilterSheet({
  bounds,
  count,
  filters,
  isOpen,
  onChange,
  onClear,
  onOpenChange,
  routeNoun = "stays",
}: {
  bounds: PriceBounds;
  count: number;
  filters: StayFilters;
  isOpen: boolean;
  onChange: (next: Partial<StayFilters>) => void;
  onClear: () => void;
  onOpenChange: (open: boolean) => void;
  routeNoun?: string;
}) {
  const priceMin = filters.priceMin ?? bounds.min;
  const priceMax = filters.priceMax ?? bounds.max;

  return (
    <BottomSheet isOpen={isOpen} onOpenChange={onOpenChange}>
      <BottomSheet.Portal>
        <BottomSheet.Overlay />
        <BottomSheet.Content snapPoints={["90%"]}>
          <View className="flex-row items-center justify-between gap-3 px-4 pb-2">
            <BottomSheet.Title>Filters</BottomSheet.Title>
            <BottomSheet.Close accessibilityLabel="Close filters" />
          </View>

          <ScrollView
            className="px-4"
            contentContainerClassName="gap-7 pb-4 pt-2"
            showsVerticalScrollIndicator={false}
          >
            <View className="gap-3">
              <Text className="text-[18px] font-semibold text-foreground">Type of place</Text>
              <View
                className="flex-row rounded-2xl border border-border p-1"
                style={{ borderCurve: "continuous" }}
              >
                {PLACE_TYPES.map(([id, label]) => {
                  const active = filters.placeType === id;
                  return (
                    <Pressable
                      accessibilityRole="button"
                      className={`h-11 flex-1 items-center justify-center rounded-xl ${
                        active ? "bg-default" : ""
                      }`}
                      key={id}
                      onPress={() => onChange({ placeType: id })}
                      style={{ borderCurve: "continuous" }}
                    >
                      <Text
                        className={`text-[14px] ${
                          active ? "font-semibold text-foreground" : "text-muted"
                        }`}
                      >
                        {label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <View className="gap-3">
              <Text className="text-[18px] font-semibold text-foreground">Price range</Text>
              <Text className="text-[13px] text-muted">Nightly price, before fees</Text>
              <View className="flex-row items-end gap-3">
                <View className="flex-1 gap-1">
                  <Text className="text-[12px] text-muted">Minimum</Text>
                  <NumberField
                    maxValue={priceMax}
                    minValue={bounds.min}
                    onChange={(value) => onChange({ priceMin: value ?? bounds.min })}
                    value={priceMin}
                  >
                    <NumberField.Group>
                      <NumberField.DecrementButton />
                      <NumberField.Input />
                      <NumberField.IncrementButton />
                    </NumberField.Group>
                  </NumberField>
                </View>
                <View className="flex-1 gap-1">
                  <Text className="text-[12px] text-muted">Maximum</Text>
                  <NumberField
                    maxValue={bounds.max}
                    minValue={priceMin}
                    onChange={(value) => onChange({ priceMax: value ?? bounds.max })}
                    value={priceMax}
                  >
                    <NumberField.Group>
                      <NumberField.DecrementButton />
                      <NumberField.Input />
                      <NumberField.IncrementButton />
                    </NumberField.Group>
                  </NumberField>
                </View>
              </View>
            </View>

            <View className="gap-4">
              <Text className="text-[18px] font-semibold text-foreground">Rooms and beds</Text>
              <Stepper
                label="Guests"
                onChange={(value) => onChange({ minGuests: value })}
                value={filters.minGuests}
              />
              <Stepper
                label="Bedrooms"
                onChange={(value) => onChange({ minBedrooms: value })}
                value={filters.minBedrooms}
              />
              <Stepper
                label="Beds"
                onChange={(value) => onChange({ minBeds: value })}
                value={filters.minBeds}
              />
              <Stepper
                label="Bathrooms"
                onChange={(value) => onChange({ minBaths: value })}
                value={filters.minBaths}
              />
            </View>

            <View className="gap-3">
              <Text className="text-[18px] font-semibold text-foreground">Amenities</Text>
              <View className="flex-row flex-wrap gap-2">
                {FILTER_AMENITIES.map((item) => {
                  const active = filters.amenities.includes(item);
                  return (
                    <Pressable
                      accessibilityRole="button"
                      className={`rounded-full border px-4 py-2 ${
                        active ? "border-accent bg-accent-soft" : "border-border"
                      }`}
                      key={item}
                      onPress={() => onChange({ amenities: toggleValue(filters.amenities, item) })}
                      style={{ borderCurve: "continuous" }}
                    >
                      <Text className="text-[14px] font-semibold text-foreground">{item}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <View className="flex-row items-center justify-between gap-4">
              <View className="flex-1">
                <Text className="text-[16px] font-semibold text-foreground">Instant Book</Text>
                <Text className="mt-0.5 text-[13px] text-muted">
                  Book without waiting for host approval
                </Text>
              </View>
              <Switch
                isSelected={filters.instantBook}
                onSelectedChange={(value) => onChange({ instantBook: value })}
              />
            </View>
          </ScrollView>

          <View className="flex-row items-center justify-between gap-4 border-t border-border px-4 pb-2 pt-3">
            <Pressable accessibilityRole="button" hitSlop={8} onPress={onClear}>
              <Text className="text-[15px] font-semibold text-foreground underline">Clear all</Text>
            </Pressable>
            <Button className="px-6" onPress={() => onOpenChange(false)}>
              Show {count} {routeNoun}
            </Button>
          </View>
        </BottomSheet.Content>
      </BottomSheet.Portal>
    </BottomSheet>
  );
}
