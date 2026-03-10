import fs from "fs";
import path from "path";
import { open, Reader } from "maxmind";
import type { AsnResponse } from "maxmind";

let reader: Reader<AsnResponse> | null = null;
let hasWarnedMissingDb = false;

const DB_PATH = path.join(process.cwd(), "data", "GeoLite2-ASN.mmdb");

export async function getAsnReader(): Promise<Reader<AsnResponse> | null> {
  if (reader) return reader;

  if (!fs.existsSync(DB_PATH)) {
    if (!hasWarnedMissingDb) {
      hasWarnedMissingDb = true;
      console.warn("⚠️ GeoLite2 ASN DB not found at:", DB_PATH);
    }
    return null;
  }

  reader = await open<AsnResponse>(DB_PATH);
  return reader;
}
