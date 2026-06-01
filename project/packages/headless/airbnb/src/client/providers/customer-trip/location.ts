/** No-op location resolver — apps that have geolocation pass their own. */
export async function noopResolveCurrentCountry(
  _supported: readonly string[],
): Promise<string | null> {
  return null;
}
