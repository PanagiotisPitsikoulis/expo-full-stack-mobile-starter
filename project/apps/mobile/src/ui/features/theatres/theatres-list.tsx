import { Spinner } from "@pitsi-ui/native/components/spinner";
import { Text } from "@pitsi-ui/native/text";
import { FlashList } from "@shopify/flash-list";
import { useCallback, useMemo } from "react";
import { View } from "react-native";
import type { ListingSection, StaticImage, Theatre } from "../../../lib/api/travel";
import { LiquidGlassInput } from "../../components/liquid-glass-input";
import { ListingRow } from "../../components/listing-row";
import { Screen } from "../../components/screen";

const ROW_GAP = 32;

function buildSections(theatres: Theatre[]): ListingSection[] {
  if (theatres.length === 0) return [];
  const byCountry = new Map<string, Theatre[]>();
  for (const t of theatres) {
    const list = byCountry.get(t.country) ?? [];
    list.push(t);
    byCountry.set(t.country, list);
  }
  return [...byCountry.entries()].map(([country, list]) => ({
    title: country,
    items: list.map((t) => [t.name, t.description, "", t.image, t.id]),
  }));
}

export function TheatresList({
  imageSrc,
  isLoading,
  isSaved,
  onOpenTheatre,
  onQueryChange,
  onToggleSave,
  query,
  searchPlaceholder = "Search",
  theatres,
}: {
  imageSrc: (image: StaticImage) => string;
  isLoading: boolean;
  isSaved?: (id: string) => boolean;
  onOpenTheatre: (id: string) => void;
  onQueryChange?: (value: string) => void;
  onToggleSave?: (id: string) => void;
  query?: string;
  searchPlaceholder?: string;
  theatres: Theatre[];
}) {
  const sections = useMemo(() => buildSections(theatres), [theatres]);

  const renderRow = useCallback(
    ({ item }: { item: ListingSection }) => (
      <ListingRow
        badge="Theatre"
        imageSrc={imageSrc}
        isSaved={isSaved}
        onOpen={onOpenTheatre}
        onToggleSave={onToggleSave}
        row={item}
      />
    ),
    [imageSrc, isSaved, onOpenTheatre, onToggleSave],
  );

  const keyExtractor = useCallback((item: ListingSection) => item.title, []);

  const header = onQueryChange ? (
    <View className="px-4 pb-3 pt-3">
      <LiquidGlassInput
        onChangeText={onQueryChange}
        placeholder={searchPlaceholder}
        value={query ?? ""}
      />
    </View>
  ) : null;

  if (isLoading && theatres.length === 0) {
    return (
      <Screen>
        {header}
        <View className="flex-1 items-center justify-center gap-3 px-8">
          <Spinner size="lg" />
          <Text className="text-center text-[14px] text-muted">Loading theatres...</Text>
        </View>
      </Screen>
    );
  }

  if (sections.length === 0) {
    return (
      <Screen>
        {header}
        <View className="flex-1 items-center justify-center gap-2 px-8">
          <Text className="text-center text-[19px] font-semibold text-foreground">
            No theatres found
          </Text>
          <Text className="text-center text-[14px] leading-5 text-muted">
            Try clearing filters or searching another city.
          </Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <FlashList
        ItemSeparatorComponent={ItemGap}
        ListHeaderComponent={header}
        contentContainerStyle={{
          paddingBottom: 64,
          paddingTop: header ? 0 : 12,
        }}
        contentInsetAdjustmentBehavior="automatic"
        data={sections}
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
