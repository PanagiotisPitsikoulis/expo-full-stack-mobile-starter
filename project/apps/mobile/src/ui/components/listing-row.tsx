import { Text } from "@pitsi-ui/native/text";
import { ScrollView, View } from "react-native";
import type { ListingSection, StaticImage } from "../../lib/api/travel";
import { ListingCard } from "./listing-card";

export function ListingRow({
  badge,
  imageSrc,
  isSaved,
  onOpen,
  onToggleSave,
  row,
}: {
  badge: string;
  imageSrc: (image: StaticImage) => string;
  isSaved?: (homeId: string) => boolean;
  onOpen: (homeId: string) => void;
  onToggleSave?: (homeId: string) => void;
  row: ListingSection;
}) {
  return (
    <View className="gap-4">
      <View className="px-4">
        <Text
          className="text-[22px] font-semibold tracking-tight text-foreground"
          numberOfLines={1}
        >
          {row.title}
        </Text>
      </View>
      <ScrollView
        contentContainerClassName="gap-4 px-4"
        horizontal
        removeClippedSubviews
        showsHorizontalScrollIndicator={false}
      >
        {row.items.map((listing, index) => (
          <ListingCard
            badge={badge}
            imageSrc={imageSrc}
            isSaved={isSaved}
            key={`${row.title}-${listing[0]}-${index}`}
            listing={listing}
            onOpen={onOpen}
            onToggleSave={onToggleSave}
          />
        ))}
      </ScrollView>
    </View>
  );
}
