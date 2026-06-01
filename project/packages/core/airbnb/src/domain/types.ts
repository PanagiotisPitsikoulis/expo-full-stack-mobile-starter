export type PrimaryRoute = "ai" | "homes" | "activities" | "map";
export type AccountScreen = "wishlists" | "trips" | "profile" | "settings";
export type Screen = "home" | "search" | "detail" | "checkout" | AccountScreen;
export type StaticImage = { src?: string } | string;
export type TravelTabId = Screen | "filters";
export type ListingItem = [
  title: string,
  price: string,
  rating: string,
  image: StaticImage,
  id?: string,
];
export type ListingSection = { items: ListingItem[]; title: string };
