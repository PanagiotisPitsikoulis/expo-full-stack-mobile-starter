import { FlashList } from "@shopify/flash-list";
import { useCallback } from "react";
import { View } from "react-native";
import type { ListingItem, StaticImage } from "../../lib/api/travel";
import { ListingCard } from "./listing-card";

const CARD_GAP = 16;
// Card width (232) × aspectRatio (1.22) ≈ 190 image + ~70 text/price.
const ROW_HEIGHT = 280;

/**
 * Horizontal scrollable strip of `ListingCard`s. Used for inline AI
 * suggestions (homes, activities) and any "recommendation row" surface
 * that doesn't need section headers. Pass already-shaped `ListingItem`s.
 */
export function HorizontalCardStrip({
  imageSrc,
  isSaved,
  keyPrefix = "card",
  listings,
  onOpen,
  onToggleSave,
}: {
  imageSrc: (image: StaticImage) => string;
  isSaved?: (id: string) => boolean;
  /** Prefix used when generating React keys; pass per-strip to avoid collisions. */
  keyPrefix?: string;
  listings: ListingItem[];
  onOpen?: (id: string) => void;
  onToggleSave?: (id: string) => void;
}) {
  const renderItem = useCallback(
    ({ item }: { item: ListingItem }) => (
      <ListingCard
        imageSrc={imageSrc}
        isSaved={isSaved}
        listing={item}
        onOpen={(id) => onOpen?.(id)}
        onToggleSave={onToggleSave}
      />
    ),
    [imageSrc, isSaved, onOpen, onToggleSave],
  );

  const keyExtractor = useCallback(
    (item: ListingItem, index: number) => `${item[4] ?? keyPrefix}-${index}`,
    [keyPrefix],
  );

  return (
    <View style={{ height: ROW_HEIGHT }}>
      <FlashList
        ItemSeparatorComponent={CardGap}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        data={listings}
        horizontal
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
}

function CardGap() {
  return <View style={{ width: CARD_GAP }} />;
}
