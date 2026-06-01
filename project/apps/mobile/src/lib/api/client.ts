/**
 * Native talks to the web app's API over HTTP. There is no same-origin, so a
 * base URL is required. Override per environment with EXPO_PUBLIC_API_BASE_URL
 * (physical devices need the host LAN IP, e.g. http://192.168.1.20:3012).
 */
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? "http://localhost:3012";

export async function apiGet<T>(path: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, { signal });
  if (!response.ok) {
    throw new Error(`GET ${path} failed (${response.status})`);
  }
  return (await response.json()) as T;
}

/** Web may return root-relative image paths (e.g. /_next/...); make them absolute for native. */
export function resolveImageUrl(url: string | undefined): string | undefined {
  if (!url) return undefined;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (url.startsWith("/")) return `${API_BASE_URL}${url}`;
  return url;
}
