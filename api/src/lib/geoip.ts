import fs from "fs";
import path from "path";
import { open, Reader } from "maxmind";
import type { CityResponse } from "maxmind";

let reader: Reader<CityResponse> | null = null;

const DB_PATH = path.join(process.cwd(), "data", "GeoLite2-City.mmdb");

export async function getGeoReader() {
  if (!reader) {
    if (!fs.existsSync(DB_PATH)) {
      console.error("❌ GeoLite DB not found at:", DB_PATH);
      throw new Error("GeoLite2 database not found");
    }

    console.log("📍 GeoLite DB path:", DB_PATH);
    reader = await open<CityResponse>(DB_PATH);
    console.log("🌍 GeoLite2 reader initialized");
  }

  return reader;
}
