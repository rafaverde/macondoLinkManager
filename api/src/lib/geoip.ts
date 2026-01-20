import maxmind, { Reader, CityResponse } from "maxmind";
import path from "path";

let reader: Reader<CityResponse> | null = null;

export async function getGeoReader() {
  if (reader) return reader;

  const dbPath = path.resolve(process.cwd(), "data/GeoLite2-City.mmdb");

  reader = await maxmind.open<CityResponse>(dbPath);

  return reader;
}
