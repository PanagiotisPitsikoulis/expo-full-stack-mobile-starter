import { Button, Column, Picker, Row, Spacer, Text } from "@expo/ui";
import { DatePicker } from "@expo/ui/swift-ui";
import {
  controlSize,
  datePickerStyle,
  interactiveDismissDisabled,
  padding,
  tint,
} from "@expo/ui/swift-ui/modifiers";
import { useEffect, useMemo, useState } from "react";
import {
  CUSTOMER_TRIP_TAB_TITLES,
  CUSTOMER_TRIP_TABS,
  type CustomerTripTab,
  tabIndex,
} from "../../../lib/client/features/customer-trip/model";
import { BrandedNativeBottomSheet } from "../../components/branded-native-bottom-sheet";
import { AIRBNB_ACCENT } from "../../theme/airbnb-colors";

type CustomerTripForm = {
  checkIn: string;
  checkOut: string;
  destination: string;
  guests: number;
};

export type CustomerTripCatalogEntry = {
  cities: string[];
  country: string;
};

const GUEST_OPTIONS = Array.from({ length: 16 }, (_, i) => i + 1);

function isoToDate(iso: string): Date {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) return new Date();
  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
}

function dateToIso(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function CustomerTripSheet({
  catalog,
  form,
  isOpen,
  onGoNext,
  onSelectDay,
  onSelectTab,
  onUpdateForm,
  tab,
}: {
  catalog: CustomerTripCatalogEntry[];
  form: CustomerTripForm;
  isOpen: boolean;
  onGoNext: () => void;
  onSelectDay: (iso: string) => void;
  onSelectTab: (tab: CustomerTripTab) => void;
  onShiftMonth: (months: number) => void;
  onUpdateForm: (form: Partial<CustomerTripForm>) => void;
  resultCount: number;
  routeLabel: string;
  tab: CustomerTripTab;
}) {
  const stepIndex = tabIndex(tab);
  const totalSteps = CUSTOMER_TRIP_TABS.length;
  const isLastStep = stepIndex === totalSteps - 1;
  const hasPrevious = stepIndex > 0;

  // Country selection lives in local state since it's not stored in the form.
  // form.destination holds the chosen city. Reset on each sheet open so each
  // search starts from the first country in the catalog (alphabetical).
  const defaultCountry = catalog[0]?.country ?? "";
  const [country, setCountry] = useState<string>(defaultCountry);
  useEffect(() => {
    if (isOpen) setCountry(defaultCountry);
  }, [isOpen, defaultCountry]);

  const cities = useMemo(
    () => catalog.find((entry) => entry.country === country)?.cities ?? [],
    [catalog, country],
  );

  // When the user lands on the city tab, default to the first city in the
  // selected country so the wheel matches what's visible and Next is enabled.
  useEffect(() => {
    if (tab !== "city") return;
    const firstCity = cities[0];
    if (!firstCity) return;
    const stillValid = cities.includes(form.destination);
    if (!stillValid) onUpdateForm({ destination: firstCity });
  }, [tab, cities, form.destination, onUpdateForm]);

  const goPrevious = () => {
    if (!hasPrevious) return;
    const prev = CUSTOMER_TRIP_TABS[stepIndex - 1]?.[0];
    if (prev) onSelectTab(prev);
  };

  const canAdvance =
    tab === "country"
      ? Boolean(country)
      : tab === "city"
        ? form.destination.trim().length > 0
        : tab === "checkIn"
          ? Boolean(form.checkIn)
          : tab === "checkOut"
            ? Boolean(form.checkOut)
            : form.guests >= 1;

  const primaryLabel = isLastStep ? "Search" : "Next";

  return (
    <BrandedNativeBottomSheet
      isPresented={isOpen}
      modifiers={[interactiveDismissDisabled()]}
      onDismiss={() => {}}
      snapPoints={["full"]}
    >
      <Column alignment="center" spacing={16}>
        <Text modifiers={[padding({ top: 16 })]} textStyle={{ fontSize: 22, fontWeight: "600" }}>
          {CUSTOMER_TRIP_TAB_TITLES[tab]}
        </Text>

        <Spacer flexible />

        {tab === "country" ? (
          <Picker
            appearance="wheel"
            onValueChange={(value) => {
              setCountry(String(value));
              // Clear the previously picked city so it has to be re-chosen.
              onUpdateForm({ destination: "" });
            }}
            selectedValue={country}
          >
            {catalog.map((entry) => (
              <Picker.Item key={entry.country} label={entry.country} value={entry.country} />
            ))}
          </Picker>
        ) : null}

        {tab === "city" ? (
          <Picker
            appearance="wheel"
            onValueChange={(value) => onUpdateForm({ destination: String(value) })}
            selectedValue={form.destination || cities[0] || ""}
          >
            {cities.map((cityName) => (
              <Picker.Item key={cityName} label={cityName} value={cityName} />
            ))}
          </Picker>
        ) : null}

        {tab === "checkIn" ? (
          <DatePicker
            displayedComponents={["date"]}
            modifiers={[datePickerStyle("graphical"), tint(AIRBNB_ACCENT)]}
            onDateChange={(date) => {
              if (date) onSelectDay(dateToIso(date));
            }}
            range={{ start: new Date() }}
            selection={form.checkIn ? isoToDate(form.checkIn) : new Date()}
          />
        ) : null}

        {tab === "checkOut" ? (
          <DatePicker
            displayedComponents={["date"]}
            modifiers={[datePickerStyle("graphical"), tint(AIRBNB_ACCENT)]}
            onDateChange={(date) => {
              if (date) onSelectDay(dateToIso(date));
            }}
            range={{ start: form.checkIn ? isoToDate(form.checkIn) : new Date() }}
            selection={form.checkOut ? isoToDate(form.checkOut) : new Date()}
          />
        ) : null}

        {tab === "who" ? (
          <Picker
            appearance="wheel"
            onValueChange={(value) => {
              const n = Number(value);
              if (Number.isFinite(n) && n >= 1) onUpdateForm({ guests: n });
            }}
            selectedValue={form.guests}
          >
            {GUEST_OPTIONS.map((count) => (
              <Picker.Item
                key={count}
                label={`${count} ${count === 1 ? "guest" : "guests"}`}
                value={count}
              />
            ))}
          </Picker>
        ) : null}

        <Spacer flexible />

        <Row modifiers={[padding({ bottom: 16 })]} spacing={12}>
          {hasPrevious ? (
            <Button
              label="Back"
              modifiers={[tint(AIRBNB_ACCENT), controlSize("large")]}
              onPress={goPrevious}
              variant="outlined"
            />
          ) : null}
          <Button
            disabled={!canAdvance}
            label={primaryLabel}
            modifiers={[tint(AIRBNB_ACCENT), controlSize("large")]}
            onPress={onGoNext}
            variant="filled"
          />
        </Row>
      </Column>
    </BrandedNativeBottomSheet>
  );
}
