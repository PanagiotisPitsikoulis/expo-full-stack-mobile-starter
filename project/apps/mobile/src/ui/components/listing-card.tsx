import { Text } from "@pitsi-ui/native/text";
import { Image } from "expo-image";
import { Pressable, View } from "react-native";
import type { ListingItem, StaticImage } from "../../lib/api/travel";
import { FavoriteHeartButton } from "./favorite-heart-button";

export function ListingCard({
  fullWidth,
  imageSrc,
  isSaved,
  listing,
  onOpen,
  onToggleSave,
  width,
}: {
  badge?: string;
  fullWidth?: boolean;
  imageSrc: (image: StaticImage) => string;
  isSaved?: (homeId: string) => boolean;
  listing: ListingItem;
  onOpen: (homeId: string) => void;
  onToggleSave?: (homeId: string) => void;
  width?: number;
}) {
  const [title, price, rating, image, id] = listing;
  const saved = id ? (isSaved?.(id) ?? false) : false;
  const widthStyle = fullWidth ? { width: "100%" as const } : { width: width ?? 232 };
  const aspectRatio = 1.22;

  return (
    <View className="relative" style={widthStyle}>
      <Pressable
        accessibilityRole="button"
        onPress={() => {
          if (id) onOpen(id);
        }}
        style={widthStyle}
      >
        <View
          className="relative w-full overflow-hidden rounded-2xl bg-surface-tertiary"
          style={{ aspectRatio, borderCurve: "continuous" }}
        >
          <Image
            accessibilityIgnoresInvertColors
            cachePolicy="memory-disk"
            contentFit="cover"
            recyclingKey={id}
            source={imageSrc(image)}
            style={{ height: "100%", width: "100%" }}
            transition={150}
          />
        </View>

        <View className="mt-3">
          <View className="flex-row items-start justify-between gap-3">
            <Text
              className="flex-1 text-[16px] font-semibold leading-5 text-foreground"
              numberOfLines={2}
            >
              {title}
            </Text>
            {rating ? (
              <View className="flex-row items-center gap-1">
                <Text className="text-[13px] text-foreground">★</Text>
                <Text className="text-[14px] text-foreground">{rating}</Text>
              </View>
            ) : null}
          </View>
          <Text className="mt-1 text-[14px] text-muted">{price}</Text>
        </View>
      </Pressable>

      <FavoriteHeartButton
        accessibilityLabel={saved ? "Remove from wishlist" : "Save to wishlist"}
        saved={saved}
        onPress={() => {
          if (id) onToggleSave?.(id);
        }}
      />
    </View>
  );
}
