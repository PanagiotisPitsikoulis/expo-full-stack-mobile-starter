import { useMemo } from "react";
import type { AiAssistantPayload, ListingItem, StaticImage } from "../../../lib/api/travel";
import { HorizontalCardStrip } from "../../components/horizontal-card-strip";

export function InlineActivityStack({
  imageSrc,
  onSeeActivities,
  payload,
}: {
  imageSrc: (image: StaticImage) => string;
  onSeeActivities: () => void;
  payload: Extract<AiAssistantPayload, { kind: "activities" }>;
}) {
  const listings = useMemo<ListingItem[]>(
    () =>
      payload.activities
        .filter((activity) => Boolean(activity.image))
        .map((activity) => [
          activity.title,
          `From ${activity.price} / person`,
          "4.9",
          activity.image,
          activity.id,
        ]),
    [payload.activities],
  );

  return (
    <HorizontalCardStrip
      imageSrc={imageSrc}
      keyPrefix="ai-activity"
      listings={listings}
      onOpen={onSeeActivities}
    />
  );
}
