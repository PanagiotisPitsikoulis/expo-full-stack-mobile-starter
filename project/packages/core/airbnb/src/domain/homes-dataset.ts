import type { ListingItem, StaticImage } from "./types";

/**
 * Portable image references for seed homes. The core ships stable string keys
 * (e.g. "stay-2"); each platform resolves a key to its own asset: web maps to
 * bundled jpgs, native maps to a remote/bundled source. This keeps the seed
 * dataset platform-agnostic so web and native share one source of truth.
 */
export type StayImageKey =
  | "stay-1"
  | "stay-2"
  | "stay-3"
  | "stay-4"
  | "stay-5"
  | "stay-6"
  | "stay-7"
  | "stay-8";

export const STAY_IMAGE_KEYS: StayImageKey[] = [
  "stay-1",
  "stay-2",
  "stay-3",
  "stay-4",
  "stay-5",
  "stay-6",
  "stay-7",
  "stay-8",
];

export type HomeTag =
  | "beach"
  | "mountain"
  | "city"
  | "countryside"
  | "pool"
  | "family"
  | "romantic"
  | "remote-work"
  | "budget"
  | "luxury"
  | "pet-friendly"
  | "design";

export type Home = {
  id: string;
  title: string;
  type: string;
  city: string;
  neighborhood: string;
  country: string;
  pricePerNight: number;
  lat: number;
  lng: number;
  beds: number;
  baths: number;
  guests: number;
  minNights: number;
  availableFrom: string;
  availableTo: string;
  rating: number;
  reviews: number;
  superhost: boolean;
  amenities: string[];
  tags: HomeTag[];
  image: StaticImage;
  host: string;
};

const images = STAY_IMAGE_KEYS;

type CitySeed = {
  city: string;
  country: string;
  neighborhoods: string[];
  basePrice: number;
  tags: HomeTag[];
  /** Real-world centroid for the city; each home gets a small jitter around it. */
  lat: number;
  lng: number;
};

const citySeeds: CitySeed[] = [
  {
    city: "Nusa Lembongan",
    country: "Indonesia",
    neighborhoods: ["Jungutbatu", "Mushroom Bay", "Lembongan Village", "Sandy Bay"],
    basePrice: 62,
    tags: ["beach", "pool", "romantic"],
    lat: -8.6803,
    lng: 115.45,
  },
  {
    city: "Nusa Penida",
    country: "Indonesia",
    neighborhoods: ["Toyapakeh", "Crystal Bay", "Atuh", "Sakti"],
    basePrice: 78,
    tags: ["beach", "pool", "mountain"],
    lat: -8.7333,
    lng: 115.5333,
  },
  {
    city: "Ubud",
    country: "Indonesia",
    neighborhoods: ["Penestanan", "Tegallalang", "Sayan", "Mas"],
    basePrice: 95,
    tags: ["pool", "countryside", "romantic", "design"],
    lat: -8.5069,
    lng: 115.2625,
  },
  {
    city: "Canggu",
    country: "Indonesia",
    neighborhoods: ["Berawa", "Pererenan", "Echo Beach", "Batu Bolong"],
    basePrice: 110,
    tags: ["beach", "remote-work", "pool"],
    lat: -8.6478,
    lng: 115.1385,
  },
  {
    city: "Paris",
    country: "France",
    neighborhoods: ["Le Marais", "Montmartre", "Saint-Germain", "Belleville", "Bastille"],
    basePrice: 168,
    tags: ["city", "romantic", "design"],
    lat: 48.8566,
    lng: 2.3522,
  },
  {
    city: "London",
    country: "United Kingdom",
    neighborhoods: ["Shoreditch", "Camden", "Notting Hill", "Hackney", "Greenwich"],
    basePrice: 192,
    tags: ["city", "design", "family"],
    lat: 51.5074,
    lng: -0.1278,
  },
  {
    city: "Lisbon",
    country: "Portugal",
    neighborhoods: ["Alfama", "Príncipe Real", "Cais do Sodré", "Graça"],
    basePrice: 124,
    tags: ["city", "remote-work", "design"],
    lat: 38.7223,
    lng: -9.1393,
  },
  {
    city: "Barcelona",
    country: "Spain",
    neighborhoods: ["El Born", "Gràcia", "Eixample", "Poblenou"],
    basePrice: 138,
    tags: ["city", "beach", "design"],
    lat: 41.3851,
    lng: 2.1734,
  },
  {
    city: "Tokyo",
    country: "Japan",
    neighborhoods: ["Shibuya", "Shimokitazawa", "Nakameguro", "Asakusa", "Shinjuku"],
    basePrice: 184,
    tags: ["city", "design", "remote-work"],
    lat: 35.6762,
    lng: 139.6503,
  },
  {
    city: "Kyoto",
    country: "Japan",
    neighborhoods: ["Gion", "Arashiyama", "Higashiyama", "Kamigyo"],
    basePrice: 156,
    tags: ["countryside", "romantic", "design"],
    lat: 35.0116,
    lng: 135.7681,
  },
  {
    city: "Mexico City",
    country: "Mexico",
    neighborhoods: ["Roma Norte", "Condesa", "Polanco", "Coyoacán"],
    basePrice: 88,
    tags: ["city", "remote-work", "budget"],
    lat: 19.4326,
    lng: -99.1332,
  },
  {
    city: "Oaxaca",
    country: "Mexico",
    neighborhoods: ["Centro", "Jalatlaco", "Xochimilco", "Reforma"],
    basePrice: 72,
    tags: ["countryside", "budget", "family"],
    lat: 17.0594,
    lng: -96.7216,
  },
  {
    city: "Chiang Mai",
    country: "Thailand",
    neighborhoods: ["Nimman", "Old City", "Santitham", "Wat Ket"],
    basePrice: 48,
    tags: ["remote-work", "budget", "mountain"],
    lat: 18.7883,
    lng: 98.9853,
  },
  {
    city: "Cape Town",
    country: "South Africa",
    neighborhoods: ["Sea Point", "De Waterkant", "Camps Bay", "Woodstock"],
    basePrice: 132,
    tags: ["beach", "mountain", "pool"],
    lat: -33.9249,
    lng: 18.4241,
  },
  {
    city: "Mykonos",
    country: "Greece",
    neighborhoods: ["Chora", "Ornos", "Platis Gialos", "Agios Stefanos"],
    basePrice: 248,
    tags: ["beach", "pool", "luxury", "romantic"],
    lat: 37.4467,
    lng: 25.3289,
  },
  {
    city: "Santorini",
    country: "Greece",
    neighborhoods: ["Oia", "Fira", "Imerovigli", "Pyrgos"],
    basePrice: 286,
    tags: ["luxury", "romantic", "pool"],
    lat: 36.3932,
    lng: 25.4615,
  },
  {
    city: "Marrakech",
    country: "Morocco",
    neighborhoods: ["Medina", "Gueliz", "Palmeraie", "Hivernage"],
    basePrice: 96,
    tags: ["design", "pool", "romantic"],
    lat: 31.6295,
    lng: -7.9811,
  },
  {
    city: "Reykjavik",
    country: "Iceland",
    neighborhoods: ["Laugavegur", "Vesturbær", "Hlíðar", "Seltjarnarnes"],
    basePrice: 212,
    tags: ["mountain", "design", "romantic"],
    lat: 64.1466,
    lng: -21.9426,
  },
  {
    city: "New York",
    country: "United States",
    neighborhoods: ["Williamsburg", "West Village", "Bushwick", "Harlem", "LES"],
    basePrice: 234,
    tags: ["city", "design", "remote-work"],
    lat: 40.7128,
    lng: -74.006,
  },
  {
    city: "Los Angeles",
    country: "United States",
    neighborhoods: ["Silver Lake", "Venice", "Echo Park", "West Hollywood"],
    basePrice: 218,
    tags: ["beach", "city", "pool"],
    lat: 34.0522,
    lng: -118.2437,
  },
];

const typesByTag: Record<HomeTag, string[]> = {
  beach: ["Beach villa", "Surf bungalow", "Oceanfront flat", "Cottage near beach"],
  mountain: ["Cabin", "A-frame", "Mountain lodge", "Chalet"],
  city: ["Loft", "Apartment", "Penthouse", "Studio"],
  countryside: ["Farmhouse", "Cottage", "Stone house", "Barn conversion"],
  pool: ["Pool villa", "Resort suite", "Pool cottage", "Modern villa"],
  family: ["Family home", "Townhouse", "Garden flat", "Suburban house"],
  romantic: ["Boutique room", "Garden suite", "Private villa", "Honeymoon cabin"],
  "remote-work": ["Work-friendly loft", "Coworking flat", "Studio with desk", "Quiet apartment"],
  budget: ["Private room", "Shared flat", "Hostel suite", "Compact studio"],
  luxury: ["Cliffside villa", "Designer mansion", "Private estate", "Penthouse"],
  "pet-friendly": ["Garden home", "Yard cottage", "Pet-friendly flat", "House with backyard"],
  design: ["Designer loft", "Architect-built home", "Boutique apartment", "Studio by an artist"],
};

const hostNames = [
  "I Nyoman",
  "Made",
  "Wayan",
  "Ketut",
  "Sophie",
  "Camille",
  "Olivier",
  "Hugo",
  "Élise",
  "James",
  "Imogen",
  "Charlie",
  "Saoirse",
  "Maria",
  "Antonio",
  "Lucia",
  "Aki",
  "Sora",
  "Haruto",
  "Yui",
  "Diego",
  "Valentina",
  "Mateo",
  "Camila",
  "Nadia",
  "Yusuf",
  "Layla",
  "Karim",
  "Eleni",
  "Stavros",
  "Marko",
  "Jovana",
  "Theo",
  "Maya",
  "Aiden",
  "Nora",
];

const amenityPool = [
  "Wifi",
  "Kitchen",
  "Air conditioning",
  "Washer",
  "Workspace",
  "Self check-in",
  "Free parking",
  "TV",
  "Coffee maker",
  "Heating",
  "Iron",
  "Hair dryer",
];

function pick<T>(items: T[], index: number): T {
  return items[index % items.length] as T;
}

const MS_PER_DAY = 24 * 60 * 60 * 1000;
// Fixed reference so availability windows are deterministic and SSR-stable.
// Roll the availability epoch backwards from "today" so the seeded catalog is
// always currently bookable. With a hardcoded date the whole dataset slides
// out of season the moment real time passes the epoch — every home fails the
// `isHomeAvailableForRange` check and the trip form returns zero results.
// 14 days of "look-back" means today + tomorrow are always inside at least
// one home's window, even with the per-home startOffset jitter (0..75 days).
function computeAvailabilityEpoch(): string {
  const todayMs = Date.now() - 14 * MS_PER_DAY;
  return new Date(todayMs).toISOString().slice(0, 10);
}
const AVAILABILITY_EPOCH = computeAvailabilityEpoch();

function addDays(isoDate: string, days: number): string {
  const date = new Date(`${isoDate}T00:00:00Z`);
  return new Date(date.getTime() + days * MS_PER_DAY).toISOString().slice(0, 10);
}

function availabilityWindow(seedIndex: number, localIndex: number) {
  const startOffset = (localIndex * 11 + seedIndex * 5) % 76; // 0..75 days into the season
  const span = 180 + ((localIndex * 23 + seedIndex * 13) % 151); // 180..330 day window
  const availableFrom = addDays(AVAILABILITY_EPOCH, startOffset);
  const availableTo = addDays(availableFrom, span);
  const minNights = 1 + ((localIndex + seedIndex) % 4); // 1..4 nights
  return { availableFrom, availableTo, minNights };
}

function buildHome(seed: CitySeed, seedIndex: number, localIndex: number): Home {
  const tag = pick(seed.tags, localIndex);
  const type = pick(typesByTag[tag], localIndex + seedIndex);
  const neighborhood = pick(seed.neighborhoods, localIndex);
  const beds = ((localIndex + seedIndex) % 4) + 1;
  const baths = Math.max(1, Math.round(beds * 0.75));
  const guests = beds * 2;
  const { availableFrom, availableTo, minNights } = availabilityWindow(seedIndex, localIndex);
  const priceDrift = ((localIndex * 13 + seedIndex * 7) % 90) - 30;
  const pricePerNight = Math.max(28, seed.basePrice + priceDrift);
  const rating = Number((4.6 + ((localIndex * 3 + seedIndex) % 39) / 100).toFixed(2));
  const reviews = 12 + ((localIndex * 17 + seedIndex * 31) % 480);
  const superhost = (localIndex + seedIndex) % 3 !== 0;
  const amenities = [
    pick(amenityPool, localIndex),
    pick(amenityPool, localIndex + 3),
    pick(amenityPool, localIndex + 6),
    pick(amenityPool, localIndex + 9),
  ].filter((value, index, array) => array.indexOf(value) === index);
  const tags: HomeTag[] = [tag, ...seed.tags.filter((other) => other !== tag).slice(0, 2)];
  const id = `${seed.city.toLowerCase().replace(/\s+/g, "-")}-${localIndex + 1}`;
  const host = pick(hostNames, localIndex + seedIndex);
  const image = pick(images, localIndex + seedIndex);
  const title = `${type} in ${neighborhood}`;
  // Scatter homes within ~3–4 km of the city centroid using a deterministic
  // jitter, so each city's homes sit in a believable neighborhood spread
  // instead of a single point.
  const jitterLat = ((((localIndex * 37 + seedIndex * 17) % 64) - 32) / 1000); // ±0.032°
  const jitterLng = ((((localIndex * 53 + seedIndex * 29) % 64) - 32) / 1000); // ±0.032°
  const lat = Number((seed.lat + jitterLat).toFixed(6));
  const lng = Number((seed.lng + jitterLng).toFixed(6));
  return {
    id,
    title,
    type,
    city: seed.city,
    neighborhood,
    country: seed.country,
    pricePerNight,
    lat,
    lng,
    beds,
    baths,
    guests,
    minNights,
    availableFrom,
    availableTo,
    rating,
    reviews,
    superhost,
    amenities,
    tags,
    image,
    host,
  };
}

function buildHomes(): Home[] {
  const result: Home[] = [];
  citySeeds.forEach((seed, seedIndex) => {
    const count = 12 + (seedIndex % 3);
    for (let i = 0; i < count; i += 1) {
      result.push(buildHome(seed, seedIndex, i));
    }
  });
  return result;
}

export const homes: Home[] = buildHomes();

// Countries we actually have stays in, for destination filters.
export const supportedCountries: string[] = Array.from(
  new Set(homes.map((home) => home.country)),
).sort((a, b) => a.localeCompare(b));

export const homesById: Record<string, Home> = Object.fromEntries(
  homes.map((home) => [home.id, home]),
);

export function homesByCity(city: string): Home[] {
  return homes.filter((home) => home.city === city);
}

export function homesByTag(tag: HomeTag): Home[] {
  return homes.filter((home) => home.tags.includes(tag));
}

export function homeToListingItem(home: Home, nights = 2): ListingItem {
  const total = home.pricePerNight * nights;
  return [
    home.title,
    `$${total} for ${nights} nights`,
    home.rating.toFixed(2),
    home.image,
    home.id,
  ];
}

export function searchHomes(query: string): Home[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return homes;
  const terms = normalized.split(/\s+/).filter(Boolean);
  return homes.filter((home) => {
    const haystack = [
      home.title,
      home.city,
      home.country,
      home.neighborhood,
      home.type,
      home.host,
      ...home.tags,
      ...home.amenities,
    ]
      .join(" ")
      .toLowerCase();
    return terms.every((term) => haystack.includes(term));
  });
}
