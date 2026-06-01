import { Text, View } from "react-native";
import type { AiAssistantPayload, Home, StaticImage } from "../../../lib/api/travel";
import { AiSmartText, PlanCard, useAiTheme } from "../../components/ai-primitives";
import { InlineActivityStack } from "./inline-activity-stack";
import { InlineHomeGrid } from "./inline-home-grid";
import { InlineTripMap } from "./inline-trip-map";

export type AssistantPayloadKind = AiAssistantPayload["kind"];

export function isFullBleedPayload(kind: AssistantPayloadKind): boolean {
  return (
    kind === "homes" ||
    kind === "activities" ||
    kind === "trip-map" ||
    kind === "itinerary" ||
    kind === "budget"
  );
}

export function AssistantPayloadView({
  imageSrc,
  isSaved,
  onChipPress,
  onExpandHomes,
  onOpenDetail,
  onSeeActivities,
  onToggleSave,
  payload,
  text,
}: {
  imageSrc: (image: StaticImage) => string;
  isSaved?: (homeId: string) => boolean;
  onChipPress: (prompt: string) => void;
  onExpandHomes: (homes: Home[]) => void;
  onOpenDetail?: (homeId: string) => void;
  onSeeActivities: () => void;
  onToggleSave?: (homeId: string) => void;
  payload: AiAssistantPayload;
  text?: string;
}) {
  const theme = useAiTheme();

  if (payload.kind === "homes") {
    return (
      <InlineHomeGrid
        imageSrc={imageSrc}
        isSaved={isSaved}
        onExpand={() => onExpandHomes(payload.homes)}
        onOpenDetail={onOpenDetail}
        onToggleSave={onToggleSave}
        payload={payload}
      />
    );
  }

  if (payload.kind === "activities") {
    return (
      <InlineActivityStack
        imageSrc={imageSrc}
        onSeeActivities={onSeeActivities}
        payload={payload}
      />
    );
  }

  if (payload.kind === "trip-map") {
    return (
      <InlineTripMap
        imageSrc={imageSrc}
        onExpandHomes={() => onExpandHomes(payload.homes)}
        onOpenDetail={onOpenDetail}
        payload={payload}
      />
    );
  }

  if (payload.kind === "budget") {
    return (
      <View style={{ paddingHorizontal: 16 }}>
        <PlanCard icon="wallet-outline" title={payload.title}>
          <View>
            {payload.rows.map(([label, value], index) => {
              const isLast = index === payload.rows.length - 1;
              return (
                <View
                  key={label}
                  style={{
                    borderBottomColor: theme.cardBorder,
                    borderBottomWidth: isLast ? 0 : 1,
                    flexDirection: "row",
                    gap: 12,
                    justifyContent: "space-between",
                    paddingBottom: isLast ? 0 : 12,
                    paddingTop: 12,
                  }}
                >
                  <AiSmartText muted style={{ fontSize: 14 }}>
                    {label}
                  </AiSmartText>
                  <AiSmartText style={{ fontSize: 14, fontWeight: isLast ? "700" : "600" }}>
                    {value}
                  </AiSmartText>
                </View>
              );
            })}
          </View>
          <AiSmartText muted style={{ fontSize: 13, lineHeight: 19 }}>
            {payload.note}
          </AiSmartText>
        </PlanCard>
      </View>
    );
  }

  if (payload.kind === "itinerary") {
    return (
      <View style={{ paddingHorizontal: 16 }}>
        <PlanCard icon="map-outline" title={payload.title}>
          <View style={{ position: "relative" }}>
            <View
              style={{
                backgroundColor: theme.cardBorder,
                bottom: 14,
                left: 13,
                position: "absolute",
                top: 14,
                width: 2,
              }}
            />
            <View style={{ gap: 14 }}>
              {payload.steps.map((step, index) => (
                <View
                  key={step}
                  style={{ alignItems: "flex-start", flexDirection: "row", gap: 14 }}
                >
                  <View
                    style={{
                      alignItems: "center",
                      backgroundColor: theme.accent,
                      borderRadius: 14,
                      height: 28,
                      justifyContent: "center",
                      width: 28,
                    }}
                  >
                    <AiSmartText
                      style={{ color: theme.accentForeground, fontSize: 13, fontWeight: "700" }}
                    >
                      {index + 1}
                    </AiSmartText>
                  </View>
                  <AiSmartText style={{ flex: 1, fontSize: 14, lineHeight: 21, paddingTop: 3 }}>
                    {step}
                  </AiSmartText>
                </View>
              ))}
            </View>
          </View>
        </PlanCard>
      </View>
    );
  }

  // clarify (chips fallback)
  return (
    <Text
      style={{
        color: theme.textPrimary,
        fontSize: 15,
        lineHeight: 21,
      }}
    >
      {text ? `${text} ` : null}
      {payload.chips.map((chip, index) => (
        <Text key={chip}>
          <Text
            accessibilityRole="button"
            onPress={() => onChipPress(chip)}
            style={{
              color: theme.textPrimary,
              fontSize: 15,
              fontWeight: "400",
              lineHeight: 21,
              textDecorationLine: "underline",
            }}
          >
            {chip}
          </Text>
          {index < payload.chips.length - 1 ? ", " : ""}
        </Text>
      ))}
    </Text>
  );
}
