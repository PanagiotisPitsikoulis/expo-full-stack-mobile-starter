import { useAppData } from "../../lib/client";
import { useRequireAuth } from "../../lib/client/auth-guard";
import { useCustomerTrip } from "../../lib/client/features/customer-trip/provider";
import { useHomeFeature } from "../../lib/client/features/home/provider";
import { HomeView } from "../../ui/features/home/home-view";

export function HomeContainer({ onOpenItem }: { onOpenItem: (itemId: string) => void }) {
  const {
    actions: { setActiveCategory },
    state,
  } = useHomeFeature();
  const {
    actions: { open: openTripSheet },
  } = useCustomerTrip();
  const {
    actions: { search: searchActions, selection, wishlist },
    selectors,
    state: { navigation, search: searchState },
  } = useAppData();
  const requireAuth = useRequireAuth();

  return (
    <HomeView
      activeCategory={state.activeCategory}
      aiBadgeRowTitle={state.aiBadgeRowTitle}
      categoryStrip={navigation.listingCategories}
      defaultBadge={state.defaultBadge}
      imageSrc={selectors.imageSrc}
      isSaved={wishlist.isSaved}
      onCategoryChange={setActiveCategory}
      onClearSearch={() =>
        searchActions.updateForm({ checkIn: "", checkOut: "", destination: "", guests: 1 })
      }
      onOpenDetail={(itemId) => {
        selection.selectHome(itemId);
        onOpenItem(itemId);
      }}
      onOpenTripSheet={openTripSheet}
      onToggleSave={requireAuth(wishlist.toggleHome)}
      rows={state.rows}
      searchForm={searchState.form}
      showCategoryStrip={state.showCategoryStrip}
    />
  );
}
