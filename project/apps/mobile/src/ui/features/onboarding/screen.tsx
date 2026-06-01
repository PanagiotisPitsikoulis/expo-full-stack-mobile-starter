import type {
  AmenityOption,
  CurrencyCode,
  InterestOption,
  StayTypeOption,
  TripPaceOption,
  TripStyleOption,
  UnitsOption,
  UserPreferencesPatch,
} from "@repo/airbnb-headless/preferences";
import { useState } from "react";
import { DEFAULT_DRAFT, type OnboardingDraft, toggleArrayValue } from "./model";
import { AirbnbOnboardingFlow, type AirbnbOnboardingGroup } from "./onboarding-flow";
import {
  amenityOptions,
  currencyOptions,
  interestOptions,
  stayTypeOptions,
  tripPaceOptions,
  tripStyleOptions,
  unitOptions,
} from "./onboarding-options";
import {
  ChipMultiSelectStep,
  LottieIntroStep,
  NativePickerStep,
  NumberStep,
  TextStep,
} from "./onboarding-step-content";

export type OnboardingScreenProps = {
  initialDraft?: Partial<OnboardingDraft>;
  onFinish?: (patch: UserPreferencesPatch & { name: string }) => void | Promise<void>;
};

export function OnboardingScreen({ initialDraft, onFinish }: OnboardingScreenProps) {
  const [draft, setDraft] = useState<OnboardingDraft>({ ...DEFAULT_DRAFT, ...initialDraft });

  const update = <K extends keyof OnboardingDraft>(key: K, value: OnboardingDraft[K]) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  const toggle = <K extends "interests" | "stayTypes" | "amenities">(
    key: K,
    value: OnboardingDraft[K][number],
  ) => {
    setDraft((current) => ({
      ...current,
      [key]: toggleArrayValue(current[key] as string[], value) as OnboardingDraft[K],
    }));
  };

  const finish = () => {
    const patch: UserPreferencesPatch & { name: string } = {
      name: draft.name.trim() || "Traveller",
      language: draft.language,
      currency: draft.currency,
      units: draft.units,
      tripStyle: draft.tripStyle,
      tripPace: draft.tripPace,
      budgetPerNight: draft.budgetPerNight,
      interests: draft.interests,
      stayTypes: draft.stayTypes,
      amenities: draft.amenities,
      notifTripAlerts: draft.notifTripAlerts,
      notifPriceDrops: draft.notifPriceDrops,
      notifNearby: draft.notifNearby,
      onboardingDone: true,
    };
    void onFinish?.(patch);
  };

  const groups: AirbnbOnboardingGroup[] = [
    {
      key: "welcome",
      title: "Welcome",
      skippable: false,
      enterLabel: "Get started",
      steps: [
        {
          key: "name",
          title: "What should we call you?",
          description: "Used in greetings and on your guest profile. Editable in Settings.",
          canContinue: draft.name.trim().length > 0,
          render: () => (
            <TextStep
              onChange={(value) => update("name", value)}
              placeholder="Your name"
              value={draft.name}
            />
          ),
        },
        {
          key: "currency",
          title: "Pick a currency.",
          description: "Prices and budget guardrails will be shown in this currency.",
          render: () => (
            <NativePickerStep
              onSelect={(value) => update("currency", value as CurrencyCode)}
              options={currencyOptions}
              selected={draft.currency}
            />
          ),
        },
        {
          key: "units",
          title: "Metric or imperial?",
          description: "Used for distance to attractions, weather, and room dimensions.",
          render: () => (
            <NativePickerStep
              onSelect={(value) => update("units", value as UnitsOption)}
              options={unitOptions}
              selected={draft.units}
            />
          ),
        },
      ],
    },
    {
      key: "style",
      title: "Travel style",
      skippable: false,
      enterLabel: "Pick a vibe",
      steps: [
        {
          key: "style-intro",
          title: "How do you like to travel?",
          description:
            "These shape the default sort order in Search, AI concierge plans, and price guardrails on Home.",
          render: () => <LottieIntroStep kind="flight" />,
        },
        {
          key: "trip-style",
          title: "Pick your trip style.",
          description: "Influences which stays and activities surface first when you open the app.",
          render: () => (
            <NativePickerStep
              onSelect={(value) => update("tripStyle", value as TripStyleOption)}
              options={tripStyleOptions}
              selected={draft.tripStyle}
            />
          ),
        },
        {
          key: "trip-pace",
          title: "Pick a pace.",
          description: "Tells the AI concierge how many plans to suggest each day.",
          render: () => (
            <NativePickerStep
              onSelect={(value) => update("tripPace", value as TripPaceOption)}
              options={tripPaceOptions}
              selected={draft.tripPace}
            />
          ),
        },
        {
          key: "budget",
          title: `Nightly budget (${draft.currency}).`,
          description: "Used as a soft guardrail when ranking stays and packages.",
          render: () => (
            <NumberStep
              max={5000}
              min={20}
              onChange={(value) => update("budgetPerNight", Math.round(value))}
              unit={draft.currency}
              value={draft.budgetPerNight}
            />
          ),
        },
      ],
    },
    {
      key: "interests",
      title: "Interests",
      skippable: true,
      skipLabel: "Skip for now",
      enterLabel: "Pick what you love",
      steps: [
        {
          key: "interest-chips",
          title: "Tap your favourites.",
          description: "You can pick none — defaults stay neutral.",
          render: () => (
            <ChipMultiSelectStep
              onToggle={(value) => toggle("interests", value as InterestOption)}
              options={interestOptions}
              selected={draft.interests}
            />
          ),
        },
        {
          key: "stay-types",
          title: "Preferred stays.",
          description: "We'll surface these first in search and use them as defaults in filters.",
          render: () => (
            <ChipMultiSelectStep
              onToggle={(value) => toggle("stayTypes", value as StayTypeOption)}
              options={stayTypeOptions}
              selected={draft.stayTypes}
            />
          ),
        },
      ],
    },
    {
      key: "comfort",
      title: "Comfort & alerts",
      skippable: true,
      skipLabel: "Skip & finish",
      enterLabel: "Comfort & alerts",
      finalLabel: "Save & continue",
      steps: [
        {
          key: "amenities",
          title: "Must-have amenities.",
          description: "Stays missing these will be pushed down in search results.",
          render: () => (
            <ChipMultiSelectStep
              onToggle={(value) => toggle("amenities", value as AmenityOption)}
              options={amenityOptions}
              selected={draft.amenities}
            />
          ),
        },
        {
          key: "notifications",
          title: "What should we ping you about?",
          description: "All settings can be flipped later from Settings → Notifications.",
          render: () => (
            <ChipMultiSelectStep
              onToggle={(id) => {
                if (id === "trip") update("notifTripAlerts", !draft.notifTripAlerts);
                if (id === "price") update("notifPriceDrops", !draft.notifPriceDrops);
                if (id === "nearby") update("notifNearby", !draft.notifNearby);
              }}
              options={[
                { id: "trip", title: "Trip alerts" },
                { id: "price", title: "Price drops" },
                { id: "nearby", title: "Nearby picks" },
              ]}
              selected={[
                draft.notifTripAlerts ? "trip" : "",
                draft.notifPriceDrops ? "price" : "",
                draft.notifNearby ? "nearby" : "",
              ].filter(Boolean)}
            />
          ),
        },
      ],
    },
  ];

  return <AirbnbOnboardingFlow groups={groups} onBackToApp={finish} onComplete={finish} />;
}
