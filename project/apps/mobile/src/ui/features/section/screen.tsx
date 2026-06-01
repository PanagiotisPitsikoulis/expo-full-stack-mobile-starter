import { ScrollView, View } from "react-native";
import type { ListingSection, StaticImage } from "../../../lib/api/travel";
import { ListingCard } from "../../components/listing-card";
import { Screen } from "../../components/screen";
import { TravelEmptyState } from "../../components/travel-empty-state";

export function SectionScreen({
  badge,
  imageSrc,
  isSaved,
  onOpenDetail,
  onToggleSave,
  section,
}: {
  badge?: string;
  imageSrc: (image: StaticImage) => string;
  isSaved?: (homeId: string) => boolean;
  onOpenDetail: (homeId: string) => void;
  onToggleSave?: (homeId: string) => void;
  section: ListingSection;
}) {
  if (section.items.length === 0) {
    return (
      <Screen>
        <TravelEmptyState
          icon="home-search-outline"
          message="We couldn't find homes for this collection right now. Check back soon."
          title={section.title}
        />
      </Screen>
    );
  }

  return (
    <Screen>
      <ScrollView
        className="flex-1"
        contentContainerClassName="flex-row flex-wrap justify-between gap-y-10 px-4 pt-3 pb-16"
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
      >
        {section.items.map((listing, index) => (
          <View key={`${section.title}-${listing[0]}-${index}`} style={{ width: "48%" }}>
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
