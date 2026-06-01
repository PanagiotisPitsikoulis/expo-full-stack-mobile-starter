import { Text } from "@pitsi-ui/native/text";
import { Image } from "expo-image";
import { Pressable, View } from "react-native";
import type { ListingItem, StaticImage } from "../../lib/api/travel";
import { FavoriteHeartButton } from "./favorite-heart-button";

export function SearchResultTile({
  badge,
  imageSrc,
  isSaved,
  listing,
  onOpen,
  onToggleSave,
}: {
  badge?: string;
  imageSrc: (image: StaticImage) => string;
  isSaved?: (homeId: string) => boolean;
  listing: ListingItem;
  onOpen: (homeId: string) => void;
  onToggleSave?: (homeId: string) => void;
}) {
  const [title, price, rating, image, id] = listing;
  const saved = id ? (isSaved?.(id) ?? false) : false;

  return (
    <View
      className="mb-5 overflow-hidden rounded-2xl border border-border bg-surface"
      style={{ borderCurve: "continuous" }}
    >
      <View className="relative bg-surface-tertiary" style={{ aspectRatio: 1.5 }}>
        <Pressable
          accessibilityRole="button"
          onPress={() => {
            if (id) onOpen(id);
          }}
          style={{ height: "100%", width: "100%" }}
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
        </Pressable>
        {badge ? (
          <View
            className="absolute left-3 top-3 rounded-full bg-surface/90 px-3 py-1.5"
            style={{ borderCurve: "continuous" }}
          >
            <Text className="text-[12px] font-semibold text-foreground">{badge}</Text>
          </View>
        ) : null}
        <FavoriteHeartButton
          accessibilityLabel={saved ? "Remove from wishlist" : "Save to wishlist"}
          saved={saved}
          onPress={() => {
            if (id) onToggleSave?.(id);
          }}
        />
      </View>
      <Pressable
        accessibilityRole="button"
        className="gap-1 p-4"
        onPress={() => {
          if (id) onOpen(id);
        }}
      >
        <View className="flex-row items-start justify-between gap-3">
          <Text className="flex-1 text-[16px] font-semibold text-foreground" numberOfLines={1}>
            {title}
          </Text>
          <View className="flex-row items-center gap-1">
            <Text className="text-foreground">★</Text>
            <Text className="text-[14px] text-foreground">{rating}</Text>
          </View>
        </View>
        <Text className="text-[14px] text-muted">{price}</Text>
      </Pressable>
    </View>
  );
}
