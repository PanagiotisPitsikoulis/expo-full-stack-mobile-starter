import { FlashList } from "@shopify/flash-list";
import { useCallback } from "react";
import { ScrollView, View } from "react-native";
import type { ListingSection, StaticImage, TravelCategoryId } from "../../../lib/api/travel";
import type { CustomerTripTab } from "../../../lib/client/features/customer-trip/model";
import { CategoryStrip } from "../../components/category-strip";
import { ListingRow } from "../../components/listing-row";
import { Screen } from "../../components/screen";
import { SearchPill } from "../../components/search-pill";

type HomeSearchForm = {
  checkIn: string;
  checkOut: string;
  destination: string;
  guests: number;
};

const ROW_GAP = 32;

export function HomeView({
  activeCategory,
  aiBadgeRowTitle,
  categoryStrip,
  defaultBadge,
  imageSrc,
  isSaved,
  onCategoryChange,
  onClearSearch,
  onOpenDetail,
  onOpenTripSheet,
  onToggleSave,
  rows,
  searchForm,
  showCategoryStrip,
}: {
  activeCategory: TravelCategoryId;
  aiBadgeRowTitle?: string;
  categoryStrip: Array<{ id: TravelCategoryId; label: string }>;
  defaultBadge: string;
  imageSrc: (image: StaticImage) => string;
  isSaved?: (homeId: string) => boolean;
  onCategoryChange: (category: TravelCategoryId) => void;
  onClearSearch?: () => void;
  onOpenDetail: (homeId: string) => void;
  onOpenTripSheet: (tab: CustomerTripTab) => void;
  onToggleSave?: (homeId: string) => void;
  rows: ListingSection[];
  searchForm: HomeSearchForm;
  showCategoryStrip: boolean;
}) {
  const header = (
    <View className="gap-5 pt-3 pb-6">
      <SearchPill form={searchForm} onClear={onClearSearch} onOpen={onOpenTripSheet} />

      {showCategoryStrip ? (
        <CategoryStrip
          activeCategory={activeCategory}
          categories={categoryStrip}
          onCategoryChange={onCategoryChange}
        />
      ) : null}
    </View>
  );

  const renderRow = useCallback(
    ({ item }: { item: ListingSection }) => (
      <ListingRow
        badge={item.title === aiBadgeRowTitle ? "AI pick" : defaultBadge}
        imageSrc={imageSrc}
        isSaved={isSaved}
        onOpen={onOpenDetail}
        onToggleSave={onToggleSave}
        row={item}
      />
    ),
    [aiBadgeRowTitle, defaultBadge, imageSrc, isSaved, onOpenDetail, onToggleSave],
  );

  const keyExtractor = useCallback((item: ListingSection) => item.title, []);

  if (rows.length === 0) {
    return (
      <Screen>
        <ScrollView
          className="flex-1"
          contentContainerClassName="gap-6"
          contentInsetAdjustmentBehavior="automatic"
          showsVerticalScrollIndicator={false}
        >
          {header}
        </ScrollView>
      </Screen>
    );
  }

  return (
    <Screen>
      <FlashList
        ItemSeparatorComponent={ItemGap}
        ListHeaderComponent={header}
        contentContainerStyle={{ paddingBottom: 64 }}
        contentInsetAdjustmentBehavior="automatic"
        data={rows}
        keyExtractor={keyExtractor}
        renderItem={renderRow}
        showsVerticalScrollIndicator={false}
      />
    </Screen>
  );
}

function ItemGap() {
  return <View style={{ height: ROW_GAP }} />;
}
