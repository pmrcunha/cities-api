import fs from "fs";
import path from "path";
import type { AddressItem } from "./index.types";

/** Loads and parses the addresses data from the provided JSON file. */
export function fetchAddresses(): AddressItem[] {
  const rawData = fs.readFileSync(
    path.join(__dirname, "../../addresses.json"),
    "utf8"
  );
  return JSON.parse(rawData);
}

/** Earth's radius in kilometers.
 * We keep it in memory. Hopefully it won't change during the lifetime of our application!
 */
const EARTH_RADIUS = 6371;

/** A clever function to calculate the distance between 2 points in a sphere, or so did an AI tell me.
 * https://en.wikipedia.org/wiki/Haversine_formula
 */
export function haversineDistance(
  latitude1: number,
  longitude1: number,
  latitude2: number,
  longitude2: number
): number {
  const diffLatitude = toRad(latitude2 - latitude1);
  const diffLongitude = toRad(longitude2 - longitude1);

  const a =
    Math.sin(diffLatitude / 2) * Math.sin(diffLatitude / 2) +
    Math.cos(toRad(latitude1)) *
      Math.cos(toRad(latitude2)) *
      Math.sin(diffLongitude / 2) *
      Math.sin(diffLongitude / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = EARTH_RADIUS * c;

  return distance; // Returns distance in kilometers
}

/** Convert an angle from degrees to radians */
function toRad(value: number): number {
  return (value * Math.PI) / 180;
}

/** Round a number to 2 decimals */
export function roundTwoDecimals(value: number): number {
  return Math.round(value * 100) / 100;
}
