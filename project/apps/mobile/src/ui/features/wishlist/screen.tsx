import { Spinner } from "@pitsi-ui/native/components/spinner";
import { Text } from "@pitsi-ui/native/text";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import { useCallback } from "react";
import { Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { Home, StaticImage } from "../../../lib/api/travel";
import { FavoriteHeartButton } from "../../components/favorite-heart-button";
import { ListingCard } from "../../components/listing-card";
import { Screen } from "../../components/screen";

export type SavedWishlistItem = {
  id: string;
  image?: StaticImage | null;
  kind: "activity" | "theatre";
  subtitle: string;
  title: string;
};

type WishlistRow =
  | { home: Home; id: string; kind: "home" }
  | { id: string; item: SavedWishlistItem; kind: "saved-item" };

type WishlistGridRow = { id: string; items: WishlistRow[] };

export function WishlistScreen({
  error,
  homes,
  imageSrc,
  items,
  loading,
  onOpenHome,
  onOpenItem,
  onToggleHome,
  onToggleItem,
}: {
  error: string | null;
  homes: Home[];
  imageSrc: (image: StaticImage) => string;
  items: SavedWishlistItem[];
  loading?: boolean;
  onOpenHome: (home: Home) => void;
  onOpenItem: (item: SavedWishlistItem) => void;
  onToggleHome: (homeId: string) => void;
  onToggleItem: (item: SavedWishlistItem) => void;
}) {
  const insets = useSafeAreaInsets();
  const rows: WishlistRow[] = [
    ...homes.map((home) => ({ home, id: `home-${home.id}`, kind: "home" as const })),
    ...items.map((item) => ({ id: `${item.kind}-${item.id}`, item, kind: "saved-item" as const })),
  ];
  const gridRows: WishlistGridRow[] = [];
  for (let index = 0; index < rows.length; index += 2) {
    const pair = rows.slice(index, index + 2);
    gridRows.push({ id: pair.map((row) => row.id).join("-"), items: pair });
  }

  const keyExtractor = useCallback((row: WishlistGridRow) => row.id, []);

  const renderCard = useCallback(
    ({ item: row }: { item: WishlistRow }) => {
      if (row.kind === "home") {
        const { home } = row;
        return (
          <ListingCard
            fullWidth
            imageSrc={imageSrc}
            isSaved={() => true}
            listing={[
              home.title,
              `${home.neighborhood}, ${home.city} · $${home.pricePerNight} night`,
              home.rating.toFixed(2),
              home.image,
              home.id,
            ]}
            onOpen={() => onOpenHome(home)}
            onToggleSave={() => onToggleHome(home.id)}
          />
        );
      }

      return (
        <View className="relative w-full">
          <Pressable accessibilityRole="button" onPress={() => onOpenItem(row.item)}>
            <View
              className="relative w-full overflow-hidden rounded-2xl bg-surface-tertiary"
              style={{ aspectRatio: 1.22, borderCurve: "continuous" }}
            >
              {row.item.image ? (
                <Image
                  accessibilityIgnoresInvertColors
                  cachePolicy="memory-disk"
                  contentFit="cover"
                  recyclingKey={row.id}
                  source={imageSrc(row.item.image)}
                  style={{ height: "100%", width: "100%" }}
                  transition={150}
                />
              ) : null}
            </View>
            <View className="mt-3">
              <Text
                className="text-[16px] font-semibold leading-5 text-foreground"
                numberOfLines={2}
              >
                {row.item.title}
              </Text>
              <Text className="mt-1 text-[14px] text-muted" numberOfLines={1}>
                {row.item.kind === "theatre" ? "Theatre" : "Activity"} · {row.item.subtitle}
              </Text>
            </View>
          </Pressable>
          <FavoriteHeartButton
            accessibilityLabel={`Remove ${row.item.title}`}
            saved
            onPress={() => onToggleItem(row.item)}
          />
        </View>
      );
    },
    [imageSrc, onOpenHome, onOpenItem, onToggleHome, onToggleItem],
  );

  const renderGridItem = useCallback(
    ({ item: row }: { item: WishlistGridRow }) => (
      <View className="flex-row">
        {row.items.map((item) => (
          <View className="w-1/2 px-2 pb-7" key={item.id}>
            {renderCard({ item })}
          </View>
        ))}
        {row.items.length === 1 ? <View className="w-1/2 px-2" /> : null}
      </View>
    ),
    [renderCard],
  );

  if (rows.length === 0 && loading) {
    return (
      <Screen>
        {error ? (
          <View className="px-4 pt-3">
            <Text className="text-[14px] font-semibold text-accent">{error}</Text>
          </View>
        ) : null}
        <View className="flex-1 items-center justify-center gap-3 px-8">
          <Spinner size="lg" />
          <Text className="text-center text-[14px] text-muted">Loading saved items...</Text>
        </View>
      </Screen>
    );
  }

  if (rows.length === 0) {
    return (
      <Screen>
        {error ? (
          <View className="px-4 pt-3">
            <Text className="text-[14px] font-semibold text-accent">{error}</Text>
          </View>
        ) : null}
        <View className="flex-1 items-center justify-center gap-3 px-8">
          <Text className="text-center text-[19px] font-semibold text-foreground">
            No saved items yet
          </Text>
          <Text className="text-center text-[14px] leading-5 text-muted">
            Homes, activities, and theatres you save will appear here.
          </Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      {error ? (
        <Text className="px-4 pt-3 text-[14px] font-semibold text-accent">{error}</Text>
      ) : null}
      <FlashList
        contentContainerStyle={{
          paddingBottom: insets.bottom + 64,
          paddingHorizontal: 8,
          paddingTop: 12,
        }}
        contentInsetAdjustmentBehavior="automatic"
        data={gridRows}
        keyExtractor={keyExtractor}
        renderItem={renderGridItem}
        showsVerticalScrollIndicator={false}
      />
    </Screen>
  );
}
