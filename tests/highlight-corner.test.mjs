import assert from "node:assert/strict";
import test from "node:test";

import { CAMPUS_DESTINATIONS } from "../app/data/portfolio.ts";
import { PRODUCTS } from "../app/data/products.ts";
import { BUILDING_HALF_DEPTH, BUILDING_COLLISION_PADDING, isInsideBuildingFootprint, isTouchingBuilding, clampToCampus } from "../app/data/campus-navigation.ts";

test("the conventional product catalog publishes Highlight Corner", () => {
  const highlightCorner = PRODUCTS.find((product) => product.id === "highlight-corner");

  assert.ok(highlightCorner, "Highlight Corner should be listed in the product catalog");
  assert.equal(highlightCorner.href, "https://highlightcorner.com/");
  assert.equal(highlightCorner.external, true);
  assert.deepEqual(highlightCorner.platforms, ["Responsive web"]);
});

test("Highlight Corner has a reachable approach and a walkable perimeter", () => {
  const zone = CAMPUS_DESTINATIONS.find((destination) => destination.id === "highlight-corner");
  const blocked = (point) => CAMPUS_DESTINATIONS.some((item) => isInsideBuildingFootprint(point, item, BUILDING_COLLISION_PADDING));
  const approach = { x: zone.approach[0], z: zone.approach[2] };
  assert.equal(blocked(approach), false);
  assert.equal(isTouchingBuilding(approach, zone), true);
  assert.deepEqual(CAMPUS_DESTINATIONS.filter((item) => isTouchingBuilding(approach, item)).map((item) => item.id), ["highlight-corner"], "Arrival must identify only Highlight Corner");
  // Walk a complete rectangle around the booth, including its rear edge.
  const halfWidth = zone.width / 2 + BUILDING_COLLISION_PADDING + 0.35;
  const halfDepth = BUILDING_HALF_DEPTH + BUILDING_COLLISION_PADDING + 0.35;
  for (let step = 0; step <= 40; step++) {
    const t = step / 40;
    for (const point of [
      { x: zone.position[0] - halfWidth + 2 * halfWidth * t, z: zone.position[2] - halfDepth },
      { x: zone.position[0] - halfWidth + 2 * halfWidth * t, z: zone.position[2] + halfDepth },
      { x: zone.position[0] - halfWidth, z: zone.position[2] - halfDepth + 2 * halfDepth * t },
      { x: zone.position[0] + halfWidth, z: zone.position[2] - halfDepth + 2 * halfDepth * t },
    ]) {
      assert.equal(blocked(point), false, `Blocked perimeter at ${JSON.stringify(point)}`);
      const clamped = { ...point };
      clampToCampus(clamped);
      assert.deepEqual(clamped, point, "World bounds must allow walking behind the booth");
    }
  }
  // Flood-fill free ground from the explorer's starting position. Every existing
  // approach must remain connected after adding the new collision footprint.
  const queue = [{ x: 0, z: 4.5 }];
  const visited = new Set(["0,4.5"]);
  for (let index = 0; index < queue.length; index++) {
    const current = queue[index];
    for (const [dx, dz] of [[0.25, 0], [-0.25, 0], [0, 0.25], [0, -0.25]]) {
      const next = { x: current.x + dx, z: current.z + dz };
      const constrained = { ...next };
      clampToCampus(constrained);
      const key = `${next.x},${next.z}`;
      if (constrained.x !== next.x || constrained.z !== next.z || blocked(next) || visited.has(key)) continue;
      visited.add(key);
      queue.push(next);
    }
  }
  for (const destination of CAMPUS_DESTINATIONS) {
    assert.ok(queue.some((point) => Math.hypot(point.x - destination.approach[0], point.z - destination.approach[2]) < 0.3), `${destination.id} must remain reachable`);
  }
});

test("Highlight Corner is a single campus project with the approved public story", () => {
  const matches = CAMPUS_DESTINATIONS.filter((destination) => destination.id === "highlight-corner");
  assert.equal(matches.length, 1);
  const destination = matches[0];
  const product = PRODUCTS.find((product) => product.id === "highlight-corner");
  assert.equal(destination.type, "project");
  assert.equal(destination.sceneLabel, product.name);
  assert.equal(destination.summary, product.consumerSummary);
  assert.deepEqual(destination.tech, product.technologies);
  assert.ok(destination.details.includes(product.engineeringSummary));
  assert.equal(destination.link.href, "https://highlightcorner.com/");
  assert.equal(destination.link.external, true);
  assert.match(destination.accessibleName, /Visit Highlight Corner/);
});
