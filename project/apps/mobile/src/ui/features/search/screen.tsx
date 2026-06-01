import { ScrollView, View } from "react-native";
import type { ListingItem, StaticImage } from "../../../lib/api/travel";
import { LiquidGlassInput } from "../../components/liquid-glass-input";
import { ListingCard } from "../../components/listing-card";
import { Screen } from "../../components/screen";
import { TravelEmptyState } from "../../components/travel-empty-state";

export function SearchScreen({
  badge,
  emptyHint,
  imageSrc,
  isSaved,
  onClearSearch,
  onOpenDetail,
  onQueryChange,
  onToggleSave,
  query,
  results,
  searchPlaceholder = "Search",
  title,
}: {
  badge: string;
  /** Hint shown when there are no results. */
  emptyHint?: string;
  imageSrc: (image: StaticImage) => string;
  isSaved?: (homeId: string) => boolean;
  /** Optional CTA shown in the empty state to reset filters / search. */
  onClearSearch?: () => void;
  onOpenDetail: (homeId: string) => void;
  onQueryChange?: (query: string) => void;
  onToggleSave?: (homeId: string) => void;
  query?: string;
  results: ListingItem[];
  searchPlaceholder?: string;
  title: string;
}) {
  const inlineSearch = onQueryChange ? (
    <View className="w-full px-4 pb-5 pt-3">
      <LiquidGlassInput
        autoFocus
        onChangeText={onQueryChange}
        placeholder={searchPlaceholder}
        value={query ?? ""}
      />
    </View>
  ) : null;

  if (results.length === 0) {
    return (
      <Screen>
        <ScrollView
          className="flex-1"
          contentContainerClassName="flex-grow"
          contentInsetAdjustmentBehavior="automatic"
          keyboardDismissMode="on-drag"
        >
          {inlineSearch}
          <View className="flex-1">
            <TravelEmptyState
              actionLabel={onClearSearch ? "Clear search" : undefined}
              icon="map-search-outline"
              message={
                emptyHint ?? "Try a different destination or loosen your filters to see more stays."
              }
              onAction={onClearSearch}
              title={title}
            />
          </View>
        </ScrollView>
      </Screen>
    );
  }

  return (
    <Screen>
      <ScrollView
        className="flex-1"
        contentContainerClassName="flex-row flex-wrap justify-between gap-y-10 px-4 pb-16"
        contentInsetAdjustmentBehavior="automatic"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
      >
        {inlineSearch ? <View className="-mx-4 w-full">{inlineSearch}</View> : null}
        {results.map((listing, index) => (
          <View key={`${title}-${listing[0]}-${index}`} style={{ width: "48%" }}>
            <ListingCard
              badge={badge}
              fullWidth
              imageSrc={imageSrc}
              isSaved={isSaved}
              listing={listing}
              onOpen={onOpenDetail}
              onToggleSave={onToggleSave}
            />
          </View>
        ))}
      </ScrollView>
    </Screen>
  );
}
