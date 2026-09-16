import type { CampusDestination } from "./portfolio";

export const WORLD_LIMIT = 15.5;
export const BUILDING_HALF_DEPTH = 2.65;
export const BUILDING_COLLISION_PADDING = 0.7;
export const BUILDING_TOUCH_RADIUS = 1.25;

type Point = { x: number; z: number };

export function clampToCampus(point: Point) {
  // Open the western perimeter around the booth while staying on the 21-unit island.
  point.x = Math.max(-20.3, Math.min(WORLD_LIMIT, point.x));
  point.z = Math.max(-WORLD_LIMIT, Math.min(WORLD_LIMIT, point.z));
  const radius = Math.hypot(point.x, point.z);
  if (radius > 20.3) {
    point.x *= 20.3 / radius;
    point.z *= 20.3 / radius;
  }
}

export function isInsideBuildingFootprint(position: Point, zone: CampusDestination, padding = 0) {
  return Math.abs(position.x - zone.position[0]) < zone.width / 2 + padding &&
    Math.abs(position.z - zone.position[2]) < BUILDING_HALF_DEPTH + padding;
}

export function isTouchingBuilding(position: Point, zone: CampusDestination) {
  const outsideX = Math.max(Math.abs(position.x - zone.position[0]) - zone.width / 2, 0);
  const outsideZ = Math.max(Math.abs(position.z - zone.position[2]) - BUILDING_HALF_DEPTH, 0);
  return Math.hypot(outsideX, outsideZ) <= BUILDING_TOUCH_RADIUS;
}
