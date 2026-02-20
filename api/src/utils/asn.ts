import { getAsnReader } from "../lib/geoip-asn";
import { isPrivateIp } from "./geoip";

export type AsnInfo = {
  asn: number | null;
  organization: string | null;
};

export async function resolveAsnInfo(ip?: string | null): Promise<AsnInfo> {
  if (!ip || isPrivateIp(ip)) {
    return { asn: null, organization: null };
  }

  try {
    const reader = await getAsnReader();
    if (!reader) return { asn: null, organization: null };

    const result = reader.get(ip);
    if (!result) return { asn: null, organization: null };

    return {
      asn: result.autonomous_system_number ?? null,
      organization: result.autonomous_system_organization ?? null,
    };
  } catch {
    return { asn: null, organization: null };
  }
}
