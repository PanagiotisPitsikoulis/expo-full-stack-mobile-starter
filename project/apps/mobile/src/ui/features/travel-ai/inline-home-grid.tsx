import { useMemo } from "react";
import {
  type AiAssistantPayload,
  homeToListingItem,
  type ListingItem,
  type StaticImage,
} from "../../../lib/api/travel";
import { HorizontalCardStrip } from "../../components/horizontal-card-strip";

export function InlineHomeGrid({
  imageSrc,
  isSaved,
  onOpenDetail,
  onToggleSave,
  payload,
}: {
  imageSrc: (image: StaticImage) => string;
  isSaved?: (homeId: string) => boolean;
  onExpand: () => void;
  onOpenDetail?: (homeId: string) => void;
  onToggleSave?: (homeId: string) => void;
  payload: Extract<AiAssistantPayload, { kind: "homes" }>;
}) {
  const listings = useMemo<ListingItem[]>(
    () => payload.homes.map((home) => homeToListingItem(home)),
    [payload.homes],
  );

  return (
    <HorizontalCardStrip
      imageSrc={imageSrc}
      isSaved={isSaved}
      keyPrefix="ai-home"
      listings={listings}
      onOpen={onOpenDetail}
      onToggleSave={onToggleSave}
    />
  );
}
