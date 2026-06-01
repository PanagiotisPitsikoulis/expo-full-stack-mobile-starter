import { homesByCity, homeToListingItem } from "./homes-dataset";
import type { AccountScreen, ListingSection, PrimaryRoute, TravelTabId } from "./types";

export const categories = [
  { id: "ai", label: "AI", icon: "✨" },
  { id: "homes", label: "Homes", icon: "🏡" },
  { id: "activities", label: "Activities", icon: "🧭" },
  { id: "map", label: "Map", icon: "🗺️" },
] satisfies Array<{ badge?: string; icon: string; id: PrimaryRoute; label: string }>;

export const routeLabels: Record<PrimaryRoute, string> = {
  homes: "Homes",
  activities: "Activities",
  ai: "AI",
  map: "Map",
};

export const routeBadgeLabels: Record<PrimaryRoute, string> = {
  homes: "Guest favorite",
  activities: "Nearby",
  ai: "AI planned",
  map: "Mapped",
};

export type NearbyActivity = {
  id: string;
  title: string;
  city: string;
  category: "water" | "food" | "culture" | "outdoors" | "nightlife" | "wellness";
  area: string;
  distance: string;
  duration: string;
  price: string;
  mood: string;
  emoji: string;
  image: ListingSection["items"][number][3];
  lat?: number;
  lng?: number;
};

export type FavoriteMapItem = {
  id: string;
  title: string;
  subtitle: string;
  meta: string;
  emoji: string;
  image?: string;
  location?: string;
  rating?: number;
  badge?: string;
  color: "rose" | "blue" | "green";
  position: [left: number, top: number];
  type: "favorite stay" | "favorite event" | "recommended";
};

/**
 * Category strip ids. `"all"` clears the filter; every other id matches a
 * real amenity in `Home.amenities`, so picking a category segments the homes
 * by what each place actually offers (not by abstract tag buckets that don't
 * surface anywhere in the UI).
 */
export type AmenityCategoryId =
  | "wifi"
  | "kitchen"
  | "ac"
  | "washer"
  | "workspace"
  | "self-check-in"
  | "parking"
  | "tv"
  | "coffee"
  | "heating"
  | "iron"
  | "hair-dryer";

export type TravelCategoryId = "all" | AmenityCategoryId;

export type TravelCategoryBase = {
  id: TravelCategoryId;
  label: string;
  amenities: string[];
};

function rowsForCities(cities: Array<[title: string, city: string]>): ListingSection[] {
  return cities.map(([title, city]) => ({
    title,
    items: homesByCity(city).map((home) => homeToListingItem(home)),
  }));
}

export const listingRows: ListingSection[] = rowsForCities([
  ["Stay near Nusa Lembongan", "Nusa Lembongan"],
  ["Hidden gems in Nusa Penida", "Nusa Penida"],
  ["Stays loved by travelers in Ubud", "Ubud"],
  ["Surf and remote work in Canggu", "Canggu"],
  ["Popular homes in Paris", "Paris"],
  ["Stay in London", "London"],
  ["Lisbon staycations", "Lisbon"],
  ["Barcelona favorites", "Barcelona"],
  ["Tokyo neighborhoods", "Tokyo"],
  ["Kyoto getaways", "Kyoto"],
  ["Mexico City weekends", "Mexico City"],
  ["Slow travel in Oaxaca", "Oaxaca"],
  ["Chiang Mai for nomads", "Chiang Mai"],
  ["Cape Town stays", "Cape Town"],
  ["Mykonos island life", "Mykonos"],
  ["Santorini cliff homes", "Santorini"],
  ["Marrakech riads", "Marrakech"],
  ["Reykjavik design stays", "Reykjavik"],
  ["New York lofts", "New York"],
  ["Los Angeles homes", "Los Angeles"],
]);

const activityImages = {
  bakery:
    "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=80",
  beachPicnic:
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80",
  bike: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=900&q=80",
  dinner:
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=900&q=80",
  fado: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=900&q=80",
  gallery:
    "https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=900&q=80",
  hike: "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=900&q=80",
  jazz: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=900&q=80",
  kayak:
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
  lagoon:
    "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=80",
  market:
    "https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=900&q=80",
  murals:
    "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?auto=format&fit=crop&w=900&q=80",
  riceWalk:
    "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?auto=format&fit=crop&w=900&q=80",
  sailing:
    "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=80",
  silver:
    "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=80",
  snorkel:
    "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=900&q=80",
  spa: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=900&q=80",
  surf: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=900&q=80",
  sushi:
    "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=900&q=80",
  tapas:
    "https://images.unsplash.com/photo-1515669097368-22e68427d265?auto=format&fit=crop&w=900&q=80",
  tea: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=900&q=80",
  tram: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&w=900&q=80",
  vinyl:
    "https://images.unsplash.com/photo-1525362081669-2b476bb628c3?auto=format&fit=crop&w=900&q=80",
  yoga: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=900&q=80",
} satisfies Record<string, string>;

export const nearbyActivities: NearbyActivity[] = [
  {
    id: "act-surf-canggu",
    title: "Sunrise surf lesson",
    city: "Canggu",
    category: "water",
    area: "Batu Bolong",
    distance: "8 min from Canggu stays",
    duration: "2 hr",
    price: "$28",
    mood: "Active",
    emoji: "🏄",
    image: activityImages.surf,
  },
  {
    id: "act-ubud-rice",
    title: "Rice terrace walk",
    city: "Ubud",
    category: "outdoors",
    area: "Tegallalang",
    distance: "14 min from Ubud villas",
    duration: "90 min",
    price: "$12",
    mood: "Scenic",
    emoji: "🌾",
    image: activityImages.riceWalk,
  },
  {
    id: "act-nusa-snorkel",
    title: "Manta snorkel boat",
    city: "Nusa Penida",
    category: "water",
    area: "Crystal Bay",
    distance: "11 min from island homes",
    duration: "3 hr",
    price: "$44",
    mood: "Water",
    emoji: "🤿",
    image: activityImages.snorkel,
  },
  {
    id: "act-paris-bakery",
    title: "Neighborhood bakery crawl",
    city: "Paris",
    category: "food",
    area: "Le Marais",
    distance: "6 min from central apartments",
    duration: "2.5 hr",
    price: "$35",
    mood: "Food",
    emoji: "🥐",
    image: activityImages.bakery,
  },
  {
    id: "act-tokyo-vinyl",
    title: "Vinyl bars and ramen night",
    city: "Tokyo",
    category: "nightlife",
    area: "Shimokitazawa",
    distance: "9 min from loft stays",
    duration: "3 hr",
    price: "$39",
    mood: "Night",
    emoji: "🍜",
    image: activityImages.vinyl,
  },
  {
    id: "act-lisbon-tram",
    title: "Tram 28 photo route",
    city: "Lisbon",
    category: "culture",
    area: "Alfama",
    distance: "5 min from old-town stays",
    duration: "75 min",
    price: "$9",
    mood: "Culture",
    emoji: "🚋",
    image: activityImages.tram,
  },
  {
    id: "act-ubud-yoga",
    title: "Jungle yoga and sound bath",
    city: "Ubud",
    category: "wellness",
    area: "Sayan",
    distance: "7 min from Ubud villas",
    duration: "75 min",
    price: "$18",
    mood: "Wellness",
    emoji: "🧘",
    image: activityImages.yoga,
  },
  {
    id: "act-nusa-kelingking",
    title: "Kelingking cliff hike",
    city: "Nusa Penida",
    category: "outdoors",
    area: "Bunga Mekar",
    distance: "18 min from island homes",
    duration: "2 hr",
    price: "$16",
    mood: "Scenic",
    emoji: "🥾",
    image: activityImages.hike,
  },
  {
    id: "act-canggu-sunset",
    title: "Beach picnic at sunset",
    city: "Canggu",
    category: "food",
    area: "Echo Beach",
    distance: "6 min from surf stays",
    duration: "90 min",
    price: "$31",
    mood: "Food",
    emoji: "🧺",
    image: activityImages.beachPicnic,
  },
  {
    id: "act-ubud-silver",
    title: "Balinese silver workshop",
    city: "Ubud",
    category: "culture",
    area: "Celuk",
    distance: "16 min from Ubud villas",
    duration: "2 hr",
    price: "$42",
    mood: "Craft",
    emoji: "💍",
    image: activityImages.silver,
  },
  {
    id: "act-paris-jazz",
    title: "Left Bank jazz cellar",
    city: "Paris",
    category: "nightlife",
    area: "Saint-Germain",
    distance: "10 min from central apartments",
    duration: "2 hr",
    price: "$29",
    mood: "Night",
    emoji: "🎷",
    image: activityImages.jazz,
  },
  {
    id: "act-tokyo-sushi",
    title: "Tiny sushi counter crawl",
    city: "Tokyo",
    category: "food",
    area: "Ebisu",
    distance: "12 min from loft stays",
    duration: "2 hr",
    price: "$55",
    mood: "Food",
    emoji: "🍣",
    image: activityImages.sushi,
  },
  {
    id: "act-lisbon-fado",
    title: "Fado in a candlelit tavern",
    city: "Lisbon",
    category: "nightlife",
    area: "Mouraria",
    distance: "8 min from old-town stays",
    duration: "2.5 hr",
    price: "$33",
    mood: "Music",
    emoji: "🎙️",
    image: activityImages.fado,
  },
  {
    id: "act-mexico-murals",
    title: "Mural walk with local artist",
    city: "Mexico City",
    category: "culture",
    area: "Roma Norte",
    distance: "9 min from family homes",
    duration: "2 hr",
    price: "$22",
    mood: "Culture",
    emoji: "🎨",
    image: activityImages.murals,
  },
  {
    id: "act-oaxaca-market",
    title: "Market breakfast tasting",
    city: "Oaxaca",
    category: "food",
    area: "20 de Noviembre",
    distance: "5 min from centro stays",
    duration: "90 min",
    price: "$19",
    mood: "Food",
    emoji: "🌮",
    image: activityImages.market,
  },
  {
    id: "act-cape-kayak",
    title: "Sea kayak with penguins",
    city: "Cape Town",
    category: "water",
    area: "Simon's Town",
    distance: "22 min from coastal homes",
    duration: "2 hr",
    price: "$48",
    mood: "Water",
    emoji: "🛶",
    image: activityImages.kayak,
  },
  {
    id: "act-mykonos-sailing",
    title: "Half-day Cyclades sail",
    city: "Mykonos",
    category: "water",
    area: "Ornos",
    distance: "15 min from island homes",
    duration: "4 hr",
    price: "$86",
    mood: "Water",
    emoji: "⛵",
    image: activityImages.sailing,
  },
  {
    id: "act-kyoto-tea",
    title: "Private tea ceremony",
    city: "Kyoto",
    category: "culture",
    area: "Gion",
    distance: "11 min from machiya stays",
    duration: "70 min",
    price: "$38",
    mood: "Culture",
    emoji: "🍵",
    image: activityImages.tea,
  },
  {
    id: "act-chiangmai-bikes",
    title: "Temple bike loop",
    city: "Chiang Mai",
    category: "outdoors",
    area: "Old City",
    distance: "6 min from garden stays",
    duration: "2.5 hr",
    price: "$14",
    mood: "Active",
    emoji: "🚲",
    image: activityImages.bike,
  },
  {
    id: "act-reykjavik-lagoon",
    title: "Thermal lagoon evening",
    city: "Reykjavik",
    category: "wellness",
    area: "Sky Lagoon",
    distance: "17 min from design stays",
    duration: "2 hr",
    price: "$64",
    mood: "Wellness",
    emoji: "♨️",
    image: activityImages.lagoon,
  },
  {
    id: "act-barcelona-tapas",
    title: "Tapas and vermouth route",
    city: "Barcelona",
    category: "food",
    area: "El Born",
    distance: "8 min from city flats",
    duration: "2.5 hr",
    price: "$41",
    mood: "Food",
    emoji: "🍤",
    image: activityImages.tapas,
  },
  {
    id: "act-la-canyon",
    title: "Canyon sunrise hike",
    city: "Los Angeles",
    category: "outdoors",
    area: "Runyon",
    distance: "14 min from hillside homes",
    duration: "90 min",
    price: "$11",
    mood: "Active",
    emoji: "🌄",
    image: activityImages.hike,
  },
  {
    id: "act-newyork-gallery",
    title: "Chelsea gallery preview",
    city: "New York",
    category: "culture",
    area: "Chelsea",
    distance: "7 min from loft stays",
    duration: "2 hr",
    price: "$24",
    mood: "Culture",
    emoji: "🖼️",
    image: activityImages.gallery,
  },
  {
    id: "act-santorini-spa",
    title: "Caldera spa ritual",
    city: "Santorini",
    category: "wellness",
    area: "Imerovigli",
    distance: "5 min from cliff homes",
    duration: "80 min",
    price: "$72",
    mood: "Wellness",
    emoji: "🪷",
    image: activityImages.spa,
  },
  {
    id: "act-marrakech-rooftop",
    title: "Rooftop dinner and spices",
    city: "Marrakech",
    category: "food",
    area: "Medina",
    distance: "4 min from riads",
    duration: "2 hr",
    price: "$36",
    mood: "Food",
    emoji: "🍲",
    image: activityImages.dinner,
  },
];

const activityCategoryLabels: Record<NearbyActivity["category"], string> = {
  water: "Water activities near stays",
  food: "Food experiences close by",
  culture: "Culture and local craft",
  outdoors: "Outdoor adventures",
  nightlife: "Evening plans and music",
  wellness: "Wellness and slower mornings",
};

const activityRows: ListingSection[] = (
  [
    "water",
    "food",
    "culture",
    "outdoors",
    "nightlife",
    "wellness",
  ] satisfies NearbyActivity["category"][]
).map((category) => ({
  title: activityCategoryLabels[category],
  items: nearbyActivities
    .filter((activity) => activity.category === category)
    .map((activity) => [
      `${activity.emoji} ${activity.title}`,
      `${activity.price} · ${activity.duration} · ${activity.distance}`,
      activity.mood,
      activity.image,
      activity.id,
    ]),
}));

export const rowsByRoute: Record<PrimaryRoute, ListingSection[]> = {
  homes: listingRows,
  activities: activityRows,
  ai: listingRows,
  map: listingRows,
};

export const favoriteMapItems: FavoriteMapItem[] = [
  {
    id: "fav-stay-ubud",
    title: "Pool villa in Sayan",
    subtitle: "Saved stay",
    meta: "$248 / night",
    emoji: "🏡",
    image:
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=400&q=80",
    location: "Sayan, Ubud",
    rating: 4.96,
    badge: "Guest favorite",
    color: "rose",
    position: [28, 44],
    type: "favorite stay",
  },
  {
    id: "fav-stay-canggu",
    title: "Surf bungalow in Batu Bolong",
    subtitle: "Saved stay",
    meta: "$160 / night",
    emoji: "🏡",
    image:
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=400&q=80",
    location: "Batu Bolong, Canggu",
    rating: 4.88,
    badge: "Superhost",
    color: "rose",
    position: [44, 58],
    type: "favorite stay",
  },
  {
    id: "event-jazz",
    title: "Live jazz night",
    subtitle: "Favorited event",
    meta: "Tonight 8:30 PM",
    emoji: "🎷",
    image:
      "https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=400&q=80",
    location: "Night Rooster, Ubud",
    badge: "Free entry",
    color: "blue",
    position: [62, 36],
    type: "favorite event",
  },
  {
    id: "event-market",
    title: "Artisan night market",
    subtitle: "Favorited event",
    meta: "Fri 6:00 PM",
    emoji: "🛍️",
    image:
      "https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=400&q=80",
    location: "Gianyar, Bali",
    badge: "Local pick",
    color: "blue",
    position: [52, 26],
    type: "favorite event",
  },
  {
    id: "reco-ramen",
    title: "Ramen and vinyl route",
    subtitle: "Recommended for you",
    meta: "9 min from saved stay",
    emoji: "🍜",
    image:
      "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=400&q=80",
    location: "Penestanan, Ubud",
    rating: 4.7,
    color: "green",
    position: [70, 62],
    type: "recommended",
  },
  {
    id: "reco-surf",
    title: "Sunrise surf lesson",
    subtitle: "Recommended for you",
    meta: "$28 · 2 hr",
    emoji: "🏄",
    image:
      "https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=400&q=80",
    location: "Batu Bolong beach",
    rating: 4.9,
    color: "green",
    position: [35, 68],
    type: "recommended",
  },
];

export const mapPrices = [
  "$217",
  "$43",
  "$158",
  "$122",
  "$318",
  "$227",
  "$72",
  "$119",
  "$215",
  "$136",
];
export const travelTabsBase: Array<{ id: TravelTabId; label: string }> = [
  { id: "home", label: "Explore" },
  { id: "trips", label: "Trips" },
  { id: "checkout", label: "Pay" },
  { id: "filters", label: "Filters" },
];

/**
 * Each non-`all` entry's `amenities` must match strings present in
 * `Home.amenities` (see `amenityPool` in homes-dataset). Picking a chip
 * filters the listing to homes that actually offer that amenity, so the
 * strip stays useful instead of grouping by abstract tags the user never
 * sees elsewhere.
 */
export const categoryStripBase: TravelCategoryBase[] = [
  { id: "all", label: "All", amenities: [] },
  { id: "wifi", label: "Wifi", amenities: ["Wifi"] },
  { id: "kitchen", label: "Kitchen", amenities: ["Kitchen"] },
  { id: "ac", label: "A/C", amenities: ["Air conditioning"] },
  { id: "workspace", label: "Workspace", amenities: ["Workspace"] },
  { id: "self-check-in", label: "Self check-in", amenities: ["Self check-in"] },
  { id: "parking", label: "Parking", amenities: ["Free parking"] },
  { id: "tv", label: "TV", amenities: ["TV"] },
  { id: "coffee", label: "Coffee", amenities: ["Coffee maker"] },
  { id: "washer", label: "Washer", amenities: ["Washer"] },
  { id: "heating", label: "Heating", amenities: ["Heating"] },
  { id: "iron", label: "Iron", amenities: ["Iron"] },
  { id: "hair-dryer", label: "Hair dryer", amenities: ["Hair dryer"] },
];

export const routeFilterPills: Record<PrimaryRoute, string[]> = {
  homes: [],
  activities: [
    "Near my stay",
    "Food",
    "Outdoors",
    "Culture",
    "Under $40",
    "Tonight",
    "Family",
    "Rainy day",
  ],
  map: ["Favorite stays", "Favorite events", "Recommended", "Tonight", "Near saved homes"],
  ai: [
    "Price",
    "AI agent",
    "Instant plan",
    "Budget",
    "Family",
    "Food",
    "Transport",
    "Work trip",
    "Visa help",
  ],
};

export const accountItemsBase: Array<{
  badge?: string;
  id: AccountScreen;
  label: string;
}> = [
  { id: "trips", label: "Trips" },
  { id: "wishlists", label: "Favorites" },
  { id: "profile", label: "Profile" },
  { id: "settings", label: "Settings" },
];

export const secondaryAccountItemsBase: Array<{ badge?: string; label: string }> = [];

export const accountTitles: Record<AccountScreen, string> = {
  profile: "Profile",
  settings: "Settings",
  trips: "Trips",
  wishlists: "Favorites",
};

export const searchCopy: Record<
  PrimaryRoute,
  {
    fields: Array<[label: string, value: string]>;
  }
> = {
  homes: {
    fields: [
      ["Where", "Search destinations"],
      ["Check in", "Add dates"],
      ["Check out", "Add dates"],
      ["Who", "Add guests"],
    ],
  },
  ai: {
    fields: [
      ["Where", "Search destination"],
      ["Dates", "Add dates"],
      ["Goal", "Plan my trip"],
      ["Who", "Add travelers"],
    ],
  },
  activities: {
    fields: [
      ["Where", "Near your stay"],
      ["When", "Any time"],
      ["Mood", "Food, culture, outdoors"],
      ["Who", "Add guests"],
    ],
  },
  map: {
    fields: [
      ["View", "Favorites map"],
      ["Saved", "Homes and events"],
      ["Recommended", "For your trip"],
      ["Area", "Near saved stays"],
    ],
  },
};
