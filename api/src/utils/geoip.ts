import { getGeoReader } from "../lib/geoip";

export interface GeoLocation {
  country: string | null;
  city: string | null;
}

function isPrivateIp(ip: string) {
  return (
    ip === "127.0.0.1" ||
    ip === "::1" ||
    ip.startsWith("10.") ||
    ip.startsWith("192.168.") ||
    ip.startsWith("172.")
  );
}

export async function resolveGeoLocation(ip?: string): Promise<GeoLocation> {
  if (!ip || isPrivateIp(ip)) {
    return { country: null, city: null };
  }

  try {
    const reader = await getGeoReader();
    const result = reader.get(ip);

    if (!result) {
      return { country: null, city: null };
    }

    return {
      country: result.country?.iso_code ?? null,
      city: result.city?.names?.en ?? null,
    };
  } catch {
    return { country: null, city: null };
  }
}
