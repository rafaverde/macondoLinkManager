import geoip from "geoip-lite";

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

export function resolveGeoLocation(ip?: string): GeoLocation {
  if (!ip || isPrivateIp(ip)) {
    return { country: null, city: null };
  }

  const geo = geoip.lookup(ip);

  if (!geo) {
    return { country: null, city: null };
  }

  return { country: geo.country ?? null, city: geo.city ?? null };
}
