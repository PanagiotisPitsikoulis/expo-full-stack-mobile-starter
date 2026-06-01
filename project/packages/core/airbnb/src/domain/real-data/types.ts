export type RealDataSource = "geoapify" | "opentripmap" | "ticketmaster";

export type RealStay = {
  id: string;
  source: RealDataSource;
  sourceId: string;
  title: string;
  city: string;
  country?: string;
  address?: string;
  lat: number;
  lng: number;
  category: string;
  rating?: number;
  website?: string;
  image?: string;
  attribution?: string;
  raw: unknown;
};

export type RealEvent = {
  id: string;
  source: RealDataSource;
  sourceId: string;
  title: string;
  city?: string;
  country?: string;
  venue?: string;
  address?: string;
  lat?: number;
  lng?: number;
  startsAt?: string;
  category?: string;
  url?: string;
  image?: string;
  attribution?: string;
  raw: unknown;
};

export type RealPlace = {
  id: string;
  source: RealDataSource;
  sourceId: string;
  title: string;
  city?: string;
  country?: string;
  address?: string;
  lat: number;
  lng: number;
  category: string;
  website?: string;
  image?: string;
  attribution?: string;
  raw: unknown;
};

export type RealDataResult<T> = {
  data: T[];
  meta: {
    count: number;
    source: RealDataSource | "fallback";
    warning?: string;
  };
};
