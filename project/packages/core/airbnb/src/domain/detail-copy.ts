import type { PrimaryRoute } from "./types";

export const detailCopy: Record<
  PrimaryRoute,
  {
    badge: string;
    button: string;
    host: string;
    price: string;
    rareFind: string;
    subtitle: string;
    title: string;
  }
> = {
  homes: {
    badge: "Guest favorite",
    button: "Reserve",
    host: "Hosted by I Nyoman",
    price: "$57 for 2 nights",
    rareFind: "This place is usually booked",
    subtitle: "Entire villa in Nusapenida, Indonesia",
    title: "kawans Inn lembongan villa",
  },
  activities: {
    badge: "Nearby activity",
    button: "Book activity",
    host: "Hosted by local guides",
    price: "$28 per guest",
    rareFind: "Close to several top-rated homes",
    subtitle: "Small-group experience near your stay",
    title: "Sunrise surf lesson in Canggu",
  },
  map: {
    badge: "Mapped favorite",
    button: "Open map",
    host: "Built from your saved homes and events",
    price: "Favorites and recommendations",
    rareFind: "AI found nearby plans that match your saved stays",
    subtitle: "Personal trip map",
    title: "Favorites map for your next trip",
  },
  ai: {
    badge: "AI planned",
    button: "Start AI plan",
    host: "Managed by Pitsi Travel AI",
    price: "$29 planning pass",
    rareFind: "AI can build your plan in under 2 minutes",
    subtitle: "AI-powered travel manager for Bali",
    title: "AI itinerary builder for Bali",
  },
};
