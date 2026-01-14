import geoip from "geoip-lite";

export interface GeoLocation {
  country: string | null;
  city: string | null;
}

export function resolveGeoLocation(ip?: string): GeoLocation {
  if (!ip) {
    return { country: null, city: null };
  }

  const geo = geoip.lookup(ip);

  if (!geo) {
    return { country: null, city: null };
  }

  return { country: geo.country ?? null, city: geo.city ?? null };
}
