import * as coreData from "@repo/airbnb-core/domain";
import {
  type ActivityFilters,
  accountItemsBase,
  accountTitles,
  applyActivityFilters,
  applyStayFilters,
  type Booking,
  type BookingDraft,
  rowsByRoute as baseRowsByRoute,
  calculateBookingQuote,
  categories,
  categoryStripBase,
  countListingItems,
  detailCopy,
  favoriteMapItems,
  type Home,
  type HomeTag,
  homeToListingItem,
  isActivityFiltersActive,
  isStayFiltersActive,
  type ListingSection,
  mapPrices,
  type NearbyActivity,
  nearbyActivities,
  type PriceBounds,
  priceBoundsOf,
  routeBadgeLabels,
  routeFilterPills,
  routeLabels,
  type StaticImage,
  type StayFilters,
  searchCopy,
  secondaryAccountItemsBase,
  homes as seededHomes,
  travelTabsBase,
} from "@repo/airbnb-core/domain";
import {
  buildActivityRows,
  buildEventRows,
  buildHomesById,
  buildListingRows,
  type EventDetailPayload,
  homeById,
  normalizePlace,
  type RealDataStatus,
  type RealEventPayload,
  type RealPlacePayload,
  resolveEventDetail,
  type SearchForm,
  searchHomesFrom,
  type Trip,
  useAppDataStore,
} from "@repo/airbnb-core/store";
import { createContext, type ReactNode, useCallback, useContext, useMemo } from "react";
import type { HeadlessEnv } from "../adapters";
import { createAppDataPersistenceHook, createRealDataHook, createServerSyncHook } from "../sync";

export type ImageOverlay = {
  galleryImages: Array<StaticImage | string>;
  imageSrc: (image: StaticImage) => string;
};

export type AppDataState = {
  account: {
    items: typeof accountItemsBase;
    secondaryItems: typeof secondaryAccountItemsBase;
    titles: typeof accountTitles;
  };
  activities: {
    nearby: NearbyActivity[];
  };
  activityFilters: {
    count: number;
    isActive: boolean;
    value: ActivityFilters;
  };
  booking: {
    draft: BookingDraft;
    error: string | null;
    quote: ReturnType<typeof calculateBookingQuote>;
    selectedHome: Home;
    trips: Trip[];
  };
  data: AppDataNamespace;
  detail: {
    copy: typeof detailCopy;
    galleryImages: ImageOverlay["galleryImages"];
  };
  filters: {
    bounds: PriceBounds;
    count: number;
    isActive: boolean;
    value: StayFilters;
  };
  listings: {
    byRoute: typeof baseRowsByRoute;
    homes: Home[];
    homesById: Record<string, Home>;
    rows: ListingSection[];
    selectedHome: Home;
  };
  map: {
    favoriteItems: typeof favoriteMapItems;
    prices: typeof mapPrices;
  };
  media: {
    imageSrc: ImageOverlay["imageSrc"];
  };
  navigation: {
    categories: typeof categories;
    listingCategories: typeof categoryStripBase;
    routeBadgeLabels: typeof routeBadgeLabels;
    routeLabels: typeof routeLabels;
    tabs: typeof travelTabsBase;
  };
  realData: {
    events: RealEventPayload[];
    places: RealPlacePayload[];
    status: RealDataStatus;
    warning?: string;
  };
  recommendedHomeIds: string[];
  recommendations: {
    homeIds: string[];
  };
  search: {
    copy: typeof searchCopy;
    filterPills: typeof routeFilterPills;
    form: SearchForm;
    submittedForm: SearchForm | null;
  };
  wishlist: {
    error: string | null;
    homeIds: string[];
    homes: Home[];
    loading: boolean;
  };
};

export type AppDataActions = {
  activityFilters: {
    clear: () => void;
    update: (next: Partial<ActivityFilters>) => void;
  };
  addRecommendedHomes: (homeIds: string[]) => void;
  booking: {
    cancel: (bookingId: string) => void;
    confirm: () => { booking?: Booking; error?: string };
    updateDraft: (draft: Partial<BookingDraft>) => void;
  };
  clearRecommendedHomes: () => void;
  filters: {
    clear: () => void;
    update: (next: Partial<StayFilters>) => void;
  };
  recommendations: {
    addHomes: (homeIds: string[]) => void;
    clearHomes: () => void;
  };
  search: {
    submit: () => void;
    updateForm: (form: Partial<SearchForm>) => void;
  };
  selection: {
    selectHome: (homeId: string) => void;
  };
  wishlist: {
    isEventSaved: (eventId: string) => boolean;
    isSaved: (homeId: string) => boolean;
    toggleEvent: (eventId: string) => void;
    toggleHome: (homeId: string) => void;
  };
};

export type AppDataSelectors = {
  applyFilters: (homes: Home[]) => Home[];
  eventDetail: (id: string | undefined) => EventDetailPayload;
  homeToListingItem: typeof homeToListingItem;
  homesByTag: (tag: HomeTag) => Home[];
  imageSrc: ImageOverlay["imageSrc"];
  searchHomes: (query: string) => Home[];
};

export type AppDataValue = {
  actions: AppDataActions;
  meta: {
    bookingDraftStorageKey: string;
    bookingsStorageKey: string;
    recommendationsStorageKey: string;
    savedEventsStorageKey: string;
    selectedHomeStorageKey: string;
    wishlistStorageKey: string;
  };
  selectors: AppDataSelectors;
  state: AppDataState;
};

/**
 * Canonical (mobile-preferred) travel-data namespace exposed via `state.data`.
 * Re-exports everything in `@repo/airbnb-core/domain` and overrides the
 * homes/listing slots with the live ones bound to real (server-fetched) data.
 */
export type AppDataNamespace = typeof coreData & {
  homes: Home[];
  homesById: Record<string, Home>;
  homesByCity: (city: string) => Home[];
  homesByTag: (tag: HomeTag) => Home[];
  listingRows: ListingSection[];
  nearbyActivities: NearbyActivity[];
  rowsByRoute: typeof baseRowsByRoute;
  searchHomes: (query: string) => Home[];
};

export function createAppDataProvider(env: HeadlessEnv, overlay: ImageOverlay) {
  const Context = createContext<AppDataValue | null>(null);

  const useAppDataPersistence = createAppDataPersistenceHook(env.storage);
  const useAppDataServerSync = createServerSyncHook({
    apiBaseUrl: env.apiBaseUrl,
    authedFetch: env.authedFetch,
    useSession: env.useSession,
  });
  const useRealData = createRealDataHook({ apiBaseUrl: env.apiBaseUrl });

  function AppDataProvider({ children }: { children: ReactNode }) {
    const persistenceReady = useAppDataPersistence();
    useRealData();
    const { loading: serverLoading, mirror } = useAppDataServerSync();

    const store = useAppDataStore();
    const confirmBookingLocal = useAppDataStore((s) => s.confirmBookingLocal);
    const cancelBookingLocal = useAppDataStore((s) => s.cancelBookingLocal);
    const toggleWishlistLocal = useAppDataStore((s) => s.toggleWishlistLocal);

    const {
      activityFilters,
      bookingDraft,
      bookingError,
      bookings,
      realDataStatus,
      realDataWarning,
      realEvents,
      realHomes,
      realPlaces,
      recommendedHomeIds,
      savedEventIds,
      searchForm,
      selectedHomeId,
      stayFilters,
      submittedSearchForm,
      wishlistError,
      wishlistHomeIds,
    } = store;

    const finalHomes = realHomes.length > 0 ? realHomes : seededHomes;
    const finalActivities = useMemo(() => {
      const realActivities = realPlaces.map(normalizePlace);
      return Array.from(
        new Map(
          [...nearbyActivities, ...realActivities].map((activity) => [activity.id, activity]),
        ).values(),
      );
    }, [realPlaces]);

    const allHomesById = useMemo(() => buildHomesById(finalHomes), [finalHomes]);
    const listingRows = useMemo(() => buildListingRows(finalHomes), [finalHomes]);
    const activityRows = useMemo(() => buildActivityRows(finalActivities), [finalActivities]);
    const eventRows = useMemo(
      () => buildEventRows(realEvents, activityRows),
      [activityRows, realEvents],
    );
    const filteredActivityRows = useMemo(
      () => applyActivityFilters(eventRows, activityFilters),
      [activityFilters, eventRows],
    );
    const rowsByRoute = useMemo(
      () => ({
        ...baseRowsByRoute,
        activities: filteredActivityRows,
        ai: listingRows,
        homes: listingRows,
        map: listingRows,
      }),
      [filteredActivityRows, listingRows],
    );
    const dynamicData = useMemo<AppDataNamespace>(
      () => ({
        ...coreData,
        homes: finalHomes,
        homesById: allHomesById,
        homesByCity: (city: string) => finalHomes.filter((home) => home.city === city),
        homesByTag: (tag: HomeTag) => finalHomes.filter((home) => home.tags.includes(tag)),
        listingRows,
        nearbyActivities: finalActivities,
        rowsByRoute,
        searchHomes: (query: string) => searchHomesFrom(finalHomes, query),
      }),
      [allHomesById, finalActivities, finalHomes, listingRows, rowsByRoute],
    );

    const priceBounds = useMemo(() => priceBoundsOf(finalHomes), [finalHomes]);
    const filtersActive = useMemo(() => isStayFiltersActive(stayFilters), [stayFilters]);
    const filteredHomeCount = useMemo(
      () => applyStayFilters(finalHomes, stayFilters).length,
      [finalHomes, stayFilters],
    );
    const activityFiltersActive = useMemo(
      () => isActivityFiltersActive(activityFilters),
      [activityFilters],
    );
    const filteredActivityCount = useMemo(
      () => countListingItems(filteredActivityRows),
      [filteredActivityRows],
    );

    const selectedHome = homeById(selectedHomeId, allHomesById, finalHomes);
    const quote = calculateBookingQuote(selectedHome, bookingDraft);
    const wishlistHomes = wishlistHomeIds.map((homeId) =>
      homeById(homeId, allHomesById, finalHomes),
    );
    const trips = bookings.map((booking) => ({
      ...booking,
      home: homeById(booking.homeId, allHomesById, finalHomes),
    }));

    const confirmBooking = useCallback(() => {
      const result = confirmBookingLocal();
      if (result.booking) mirror.confirmBooking(result.booking);
      return result;
    }, [confirmBookingLocal, mirror]);

    const cancelBooking = useCallback(
      (bookingId: string) => {
        cancelBookingLocal(bookingId);
        mirror.cancelBooking(bookingId);
      },
      [cancelBookingLocal, mirror],
    );

    const toggleWishlistHome = useCallback(
      (homeId: string) => {
        const result = toggleWishlistLocal(homeId);
        if (result) mirror.toggleWishlist(homeId, result.removing, result.previousIds);
      },
      [toggleWishlistLocal, mirror],
    );

    const isWishlistSaved = useCallback(
      (homeId: string) => wishlistHomeIds.includes(homeId),
      [wishlistHomeIds],
    );

    const isEventSaved = useCallback(
      (eventId: string) => savedEventIds.includes(eventId),
      [savedEventIds],
    );

    const applyFilters = useCallback(
      (homes: Home[]) => applyStayFilters(homes, stayFilters),
      [stayFilters],
    );
    const eventDetail = useCallback(
      (id: string | undefined) =>
        resolveEventDetail({
          activities: finalActivities,
          events: realEvents,
          favoriteItems: favoriteMapItems,
          homes: finalHomes,
          id,
        }),
      [finalActivities, finalHomes, realEvents],
    );

    const value = useMemo<AppDataValue>(
      () => ({
        actions: {
          activityFilters: {
            clear: store.clearActivityFilters,
            update: store.updateActivityFilters,
          },
          addRecommendedHomes: store.addRecommendedHomes,
          booking: {
            cancel: cancelBooking,
            confirm: confirmBooking,
            updateDraft: store.updateDraft,
          },
          clearRecommendedHomes: store.clearRecommendedHomes,
          filters: {
            clear: store.clearStayFilters,
            update: store.updateStayFilters,
          },
          recommendations: {
            addHomes: store.addRecommendedHomes,
            clearHomes: store.clearRecommendedHomes,
          },
          search: {
            submit: store.submitSearch,
            updateForm: store.updateSearchForm,
          },
          selection: {
            selectHome: store.selectHome,
          },
          wishlist: {
            isEventSaved,
            isSaved: isWishlistSaved,
            toggleEvent: store.toggleSavedEventLocal,
            toggleHome: toggleWishlistHome,
          },
        },
        meta: {
          bookingDraftStorageKey: "ainnb-booking-draft",
          bookingsStorageKey: "ainnb-bookings",
          recommendationsStorageKey: "ainnb-recommended-home-ids",
          savedEventsStorageKey: "ainnb-saved-event-ids",
          selectedHomeStorageKey: "ainnb-selected-home-id",
          wishlistStorageKey: "ainnb-wishlist-home-ids",
        },
        selectors: {
          applyFilters,
          eventDetail,
          homeToListingItem,
          homesByTag: dynamicData.homesByTag,
          imageSrc: overlay.imageSrc,
          searchHomes: dynamicData.searchHomes,
        },
        state: {
          account: {
            items: accountItemsBase,
            secondaryItems: secondaryAccountItemsBase,
            titles: accountTitles,
          },
          activities: {
            nearby: finalActivities,
          },
          activityFilters: {
            count: filteredActivityCount,
            isActive: activityFiltersActive,
            value: activityFilters,
          },
          booking: {
            draft: bookingDraft,
            error: bookingError,
            quote,
            selectedHome,
            trips,
          },
          data: dynamicData,
          detail: {
            copy: detailCopy,
            galleryImages: overlay.galleryImages,
          },
          filters: {
            bounds: priceBounds,
            count: filteredHomeCount,
            isActive: filtersActive,
            value: stayFilters,
          },
          listings: {
            byRoute: rowsByRoute,
            homes: finalHomes,
            homesById: allHomesById,
            rows: listingRows,
            selectedHome,
          },
          map: {
            favoriteItems: favoriteMapItems,
            prices: mapPrices,
          },
          media: {
            imageSrc: overlay.imageSrc,
          },
          navigation: {
            categories,
            listingCategories: categoryStripBase,
            routeBadgeLabels,
            routeLabels,
            tabs: travelTabsBase,
          },
          realData: {
            events: realEvents,
            places: realPlaces,
            status: realDataStatus,
            warning: realDataWarning,
          },
          recommendedHomeIds,
          recommendations: {
            homeIds: recommendedHomeIds,
          },
          search: {
            copy: searchCopy,
            filterPills: routeFilterPills,
            form: searchForm,
            submittedForm: submittedSearchForm,
          },
          wishlist: {
            error: wishlistError,
            homeIds: wishlistHomeIds,
            homes: wishlistHomes,
            loading: !persistenceReady || serverLoading.wishlist,
          },
        },
      }),
      [
        activityFilters,
        activityFiltersActive,
        allHomesById,
        applyFilters,
        bookingDraft,
        bookingError,
        cancelBooking,
        confirmBooking,
        dynamicData,
        eventDetail,
        filteredActivityCount,
        filteredHomeCount,
        filtersActive,
        finalActivities,
        finalHomes,
        isEventSaved,
        isWishlistSaved,
        listingRows,
        priceBounds,
        quote,
        realDataStatus,
        realDataWarning,
        realEvents,
        realPlaces,
        recommendedHomeIds,
        rowsByRoute,
        searchForm,
        selectedHome,
        persistenceReady,
        stayFilters,
        serverLoading.wishlist,
        store.addRecommendedHomes,
        store.clearActivityFilters,
        store.clearRecommendedHomes,
        store.clearStayFilters,
        store.selectHome,
        store.submitSearch,
        store.toggleSavedEventLocal,
        store.updateActivityFilters,
        store.updateDraft,
        store.updateSearchForm,
        store.updateStayFilters,
        submittedSearchForm,
        toggleWishlistHome,
        trips,
        wishlistError,
        wishlistHomeIds,
        wishlistHomes,
      ],
    );

    return <Context.Provider value={value}>{children}</Context.Provider>;
  }

  function useAppData() {
    const value = useContext(Context);
    if (!value) {
      throw new Error("useAppData must be used within AppDataProvider");
    }
    return value;
  }

  return { AppDataProvider, useAppData };
}
