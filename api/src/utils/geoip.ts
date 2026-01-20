import { getGeoReader } from "../lib/geoip";

export interface GeoLocation {
  country: string | null;
  city: string | null;
}

export function isPrivateIp(ip: string) {
  if (!ip || typeof ip !== "string") return true;

  // Loopback
  if (ip === "127.0.0.1" || ip === "::1") return true;

  // Private ranges
  if (ip.startsWith("10.")) return true;
  if (ip.startsWith("192.168.")) return true;
  if (ip.startsWith("172.") && /^172\.(1[6-9]|2\d|3[01])\./.test(ip))
    return true;

  // IPv6 private/link-local
  if (ip.startsWith("fc") || ip.startsWith("fd") || ip.startsWith("fe80:"))
    return true;

  return false;
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
