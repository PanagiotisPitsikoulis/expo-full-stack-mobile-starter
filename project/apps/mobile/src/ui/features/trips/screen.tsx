import { DateTimePicker } from "@expo/ui/community/datetime-picker";
import { Picker } from "@expo/ui/community/picker";
import { SegmentedControl } from "@expo/ui/community/segmented-control";
import { Button } from "@pitsi-ui/native/button";
import { Spinner } from "@pitsi-ui/native/components/spinner";
import { Text } from "@pitsi-ui/native/text";
import { FlashList } from "@shopify/flash-list";
import { useCallback, useMemo } from "react";
import { Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { formatTripDateRange } from "../../../lib/api/travel";
import type {
  Reservation,
  ReservationEditDraft,
} from "../../../lib/client/features/reservations/api";
import { Screen } from "../../components/screen";
import { AIRBNB_ACCENT } from "../../theme/airbnb-colors";

const SEGMENTS = ["Homes", "Activities", "Theatrical"] as const;
const GUEST_OPTIONS = ["1", "2", "3", "4", "5", "6", "7", "8"];
const TICKET_OPTIONS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];

export type ReservationFilter = "activities" | "homes" | "theatrical";

type FeedRow =
  | { kind: "empty"; key: string }
  | { kind: "section"; key: string; label: string }
  | {
      kind: "reservation";
      key: string;
      position: "first" | "last" | "middle" | "only";
      reservation: Reservation;
    }
  | { kind: "segments"; key: string };

function filterToIndex(filter: ReservationFilter): number {
  if (filter === "activities") return 1;
  if (filter === "theatrical") return 2;
  return 0;
}

function indexToFilter(index: number): ReservationFilter {
  if (index === 1) return "activities";
  if (index === 2) return "theatrical";
  return "homes";
}

function eventDate(value: string | null | undefined) {
  if (!value) return "Event date TBA";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(
    date,
  );
}

function reservationTitle(reservation: Reservation) {
  return reservation.item.title;
}

function reservationKindLabel(reservation: Reservation) {
  if (reservation.kind === "stay") return "Home";
  if (reservation.kind === "event") return "Activity";
  return "Theatrical";
}

function reservationMeta(reservation: Reservation) {
  if (reservation.kind === "stay") {
    return `${formatTripDateRange(reservation.checkIn, reservation.checkOut)} · ${reservation.guests} guest · ${reservation.item.city}`;
  }
  if (reservation.kind === "theatre") {
    return `${eventDate(reservation.item.startsAt)} · ${reservation.seatIds.length} seat · ${reservation.item.subtitle}`;
  }
  return `${eventDate(reservation.item.startsAt)} · ${reservation.tickets} ticket · ${reservation.item.subtitle}`;
}

function rowRadius(position: "first" | "last" | "middle" | "only") {
  const full = 24;
  const small = 6;
  if (position === "only") return { borderRadius: full };
  return {
    borderBottomLeftRadius: position === "last" ? full : small,
    borderBottomRightRadius: position === "last" ? full : small,
    borderTopLeftRadius: position === "first" ? full : small,
    borderTopRightRadius: position === "first" ? full : small,
  };
}

function parseDate(value: string) {
  const date = new Date(`${value}T12:00:00`);
  return Number.isNaN(date.getTime()) ? new Date() : date;
}

function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function FieldLabel({ children }: { children: string }) {
  return <Text className="pl-2 text-[13px] font-semibold text-foreground">{children}</Text>;
}

function DateEditField({
  label,
  minimumDate,
  onChange,
  value,
}: {
  label: string;
  minimumDate?: Date;
  onChange: (value: string) => void;
  value: string;
}) {
  return (
    <View className="gap-2">
      <FieldLabel>{label}</FieldLabel>
      <View className="items-start">
        <DateTimePicker
          accentColor={AIRBNB_ACCENT}
          display="compact"
          minimumDate={minimumDate}
          mode="date"
          onValueChange={(_event, date) => onChange(formatDate(date))}
          presentation="inline"
          value={parseDate(value)}
        />
      </View>
    </View>
  );
}

function GuestEditField({ onChange, value }: { onChange: (value: string) => void; value: string }) {
  return (
    <View className="gap-2">
      <FieldLabel>Guests</FieldLabel>
      <View
        className="rounded-2xl bg-surface-tertiary px-3 py-2"
        style={{ borderCurve: "continuous" }}
      >
        <Picker
          onValueChange={(next) => {
            if (typeof next === "string") onChange(next);
          }}
          selectedValue={GUEST_OPTIONS.includes(value) ? value : "1"}
        >
          {GUEST_OPTIONS.map((guest) => (
            <Picker.Item
              key={guest}
              label={`${guest} ${guest === "1" ? "guest" : "guests"}`}
              value={guest}
            />
          ))}
        </Picker>
      </View>
    </View>
  );
}

function TicketEditField({
  onChange,
  value,
}: {
  onChange: (value: string) => void;
  value: string;
}) {
  return (
    <View className="gap-2">
      <FieldLabel>Tickets</FieldLabel>
      <View
        className="rounded-2xl bg-surface-tertiary px-3 py-2"
        style={{ borderCurve: "continuous" }}
      >
        <Picker
          onValueChange={(next) => {
            if (typeof next === "string") onChange(next);
          }}
          selectedValue={TICKET_OPTIONS.includes(value) ? value : "1"}
        >
          {TICKET_OPTIONS.map((ticket) => (
            <Picker.Item
              key={ticket}
              label={`${ticket} ${ticket === "1" ? "ticket" : "tickets"}`}
              value={ticket}
            />
          ))}
        </Picker>
      </View>
    </View>
  );
}

function EditControls({
  draft,
  onCancel,
  onChangeDraft,
  onSave,
  reservation,
}: {
  draft: ReservationEditDraft;
  onCancel: () => void;
  onChangeDraft: (draft: Partial<ReservationEditDraft>) => void;
  onSave: () => void;
  reservation: Reservation;
}) {
  if (reservation.kind === "event") {
    return (
      <View className="gap-3 border-t border-separator pt-4">
        <TicketEditField onChange={(tickets) => onChangeDraft({ tickets })} value={draft.tickets} />
        <EditButtons onCancel={onCancel} onSave={onSave} />
      </View>
    );
  }

  return (
    <View className="gap-3 border-t border-separator pt-4">
      <DateEditField
        label="Check-in"
        onChange={(checkIn) => onChangeDraft({ checkIn })}
        value={draft.checkIn}
      />
      <DateEditField
        label="Check-out"
        minimumDate={parseDate(draft.checkIn)}
        onChange={(checkOut) => onChangeDraft({ checkOut })}
        value={draft.checkOut}
      />
      <GuestEditField onChange={(guests) => onChangeDraft({ guests })} value={draft.guests} />
      <EditButtons onCancel={onCancel} onSave={onSave} />
    </View>
  );
}

function EditButtons({ onCancel, onSave }: { onCancel: () => void; onSave: () => void }) {
  return (
    <View className="flex-row justify-end gap-2">
      <Button className="rounded-full px-4" onPress={onSave} size="sm">
        Save
      </Button>
      <Button className="rounded-full px-4" onPress={onCancel} size="sm" variant="secondary">
        Cancel
      </Button>
    </View>
  );
}

function TextAction({
  disabled,
  label,
  muted,
  onPress,
}: {
  disabled?: boolean;
  label: string;
  muted?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable accessibilityRole="button" disabled={disabled} hitSlop={6} onPress={onPress}>
      <Text
        className={`text-[13px] font-semibold underline ${muted ? "text-muted" : "text-foreground"}`}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function ReservationRow({
  draft,
  editable,
  editing,
  onCancelReservation,
  onChangeEditDraft,
  onCloseEdit,
  onOpenReservation,
  onSaveEdit,
  onStartEdit,
  pending,
  position,
  reservation,
}: {
  draft: ReservationEditDraft;
  editable: boolean;
  editing: boolean;
  onCancelReservation: (reservation: Reservation) => void;
  onChangeEditDraft: (draft: Partial<ReservationEditDraft>) => void;
  onCloseEdit: () => void;
  onOpenReservation: (reservation: Reservation) => void;
  onSaveEdit: (reservation: Reservation) => void;
  onStartEdit: (reservation: Reservation) => void;
  pending?: boolean;
  position: "first" | "last" | "middle" | "only";
  reservation: Reservation;
}) {
  const isConfirmed = reservation.status === "confirmed";
  return (
    <View
      className="gap-4 bg-surface px-6 py-4"
      style={[{ borderCurve: "continuous" }, rowRadius(position)]}
    >
      <Pressable accessibilityRole="button" onPress={() => onOpenReservation(reservation)}>
        <View className="flex-row items-start justify-between gap-3">
          <Text
            className="min-w-0 flex-1 text-[17px] font-semibold tracking-tight text-foreground"
            numberOfLines={1}
          >
            {reservationTitle(reservation)}
          </Text>
          <Text className="text-[15px] font-semibold text-foreground">${reservation.total}</Text>
        </View>
        <Text className="mt-1 text-[14px] text-muted">
          {reservationKindLabel(reservation)} · {isConfirmed ? "Confirmed" : "Cancelled"}
        </Text>
        <Text className="mt-1 text-[14px] text-muted" numberOfLines={2}>
          {reservationMeta(reservation)}
        </Text>
      </Pressable>

      {editing ? (
        <EditControls
          draft={draft}
          onCancel={onCloseEdit}
          onChangeDraft={onChangeEditDraft}
          onSave={() => onSaveEdit(reservation)}
          reservation={reservation}
        />
      ) : (
        <View className="flex-row flex-wrap gap-2 border-t border-separator pt-3">
          <TextAction label="Open" onPress={() => onOpenReservation(reservation)} />
          {isConfirmed && editable ? (
            <>
              <Text className="text-[13px] text-muted">,</Text>
              <TextAction
                disabled={pending}
                label={reservation.kind === "theatre" ? "Change seats" : "Edit"}
                onPress={() => onStartEdit(reservation)}
              />
              <Text className="text-[13px] text-muted">,</Text>
              <TextAction
                disabled={pending}
                label="Cancel"
                muted
                onPress={() => onCancelReservation(reservation)}
              />
            </>
          ) : null}
        </View>
      )}
    </View>
  );
}

export function TripsScreen({
  activeFilter,
  activeReservations,
  editDraft,
  editableReservationIds,
  editingId,
  historyReservations,
  loading,
  onCancelReservation,
  onChangeEditDraft,
  onCloseEdit,
  onFilterChange,
  onOpenReservation,
  onSaveEdit,
  onStartEdit,
  pending,
}: {
  activeFilter: ReservationFilter;
  activeReservations: Reservation[];
  editDraft: ReservationEditDraft;
  editableReservationIds: string[];
  editingId: string | null;
  historyReservations: Reservation[];
  loading?: boolean;
  onCancelReservation: (reservation: Reservation) => void;
  onChangeEditDraft: (draft: Partial<ReservationEditDraft>) => void;
  onCloseEdit: () => void;
  onFilterChange: (filter: ReservationFilter) => void;
  onOpenReservation: (reservation: Reservation) => void;
  onSaveEdit: (reservation: Reservation) => void;
  onStartEdit: (reservation: Reservation) => void;
  pending?: boolean;
}) {
  const insets = useSafeAreaInsets();

  const rows = useMemo<FeedRow[]>(() => {
    const out: FeedRow[] = [{ kind: "segments", key: "segments" }];
    const appendSection = (key: string, label: string, reservations: Reservation[]) => {
      if (reservations.length === 0) return;
      out.push({ kind: "section", key: `header-${key}`, label });
      reservations.forEach((reservation, index) => {
        const only = reservations.length === 1;
        out.push({
          kind: "reservation",
          key: `${key}-${reservation.id}`,
          position: only
            ? "only"
            : index === 0
              ? "first"
              : index === reservations.length - 1
                ? "last"
                : "middle",
          reservation,
        });
      });
    };
    appendSection("current", "Current reservations", activeReservations);
    appendSection("history", "Reservation history", historyReservations);
    if (out.length === 1) out.push({ kind: "empty", key: "empty" });
    return out;
  }, [activeReservations, historyReservations]);

  const keyExtractor = useCallback((row: FeedRow) => row.key, []);
  const getItemType = useCallback((row: FeedRow) => row.kind, []);

  const renderItem = useCallback(
    ({ item }: { item: FeedRow }) => {
      if (item.kind === "segments") {
        return (
          <View className="pb-5">
            <SegmentedControl
              onChange={(event) =>
                onFilterChange(indexToFilter(event.nativeEvent.selectedSegmentIndex))
              }
              selectedIndex={filterToIndex(activeFilter)}
              tintColor={AIRBNB_ACCENT}
              values={[...SEGMENTS]}
            />
          </View>
        );
      }
      if (item.kind === "section") {
        return <Text className="ml-4 mb-2 text-[13px] font-normal text-muted">{item.label}</Text>;
      }
      if (item.kind === "empty") {
        return (
          <View className="items-center justify-center gap-2 px-6 py-20">
            <Text className="text-center text-[19px] font-semibold text-foreground">
              No reservations here
            </Text>
            <Text className="text-center text-[14px] leading-5 text-muted">
              Confirmed and past reservations for this category will appear here.
            </Text>
          </View>
        );
      }
      return (
        <ReservationRow
          draft={editDraft}
          editable={editableReservationIds.includes(item.reservation.id)}
          editing={editingId === item.reservation.id}
          onCancelReservation={onCancelReservation}
          onChangeEditDraft={onChangeEditDraft}
          onCloseEdit={onCloseEdit}
          onOpenReservation={onOpenReservation}
          onSaveEdit={onSaveEdit}
          onStartEdit={onStartEdit}
          pending={pending}
          position={item.position}
          reservation={item.reservation}
        />
      );
    },
    [
      activeFilter,
      editDraft,
      editableReservationIds,
      editingId,
      onCancelReservation,
      onChangeEditDraft,
      onCloseEdit,
      onFilterChange,
      onOpenReservation,
      onSaveEdit,
      onStartEdit,
      pending,
    ],
  );

  if (loading) {
    return (
      <Screen>
        <View className="flex-1 items-center justify-center gap-3">
          <Spinner size="lg" />
          <Text className="text-[14px] text-muted">Loading reservations...</Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <FlashList
        ItemSeparatorComponent={ItemGap}
        contentContainerStyle={{
          paddingBottom: insets.bottom + 64,
          paddingHorizontal: 16,
          paddingTop: 12,
        }}
        contentInsetAdjustmentBehavior="automatic"
        data={rows}
        getItemType={getItemType}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
    </Screen>
  );
}

function ItemGap() {
  return <View style={{ height: 8 }} />;
}
