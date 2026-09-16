import assert from "node:assert/strict";

// Use an existing Playwright installation; no browser dependency is added to the app.
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || "playwright");
const browser = await chromium.launch({ headless: true, channel: "chrome" });
const baseURL = process.env.CAMPUS_TEST_URL || "http://127.0.0.1:4173";
const errors = [];
const screenshots = process.env.CAMPUS_SCREENSHOTS || "/tmp";
const observe = (page) => {
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("response", (response) => {
    if (response.status() >= 400 && !response.url().endsWith("/favicon.ico")) errors.push(`${response.status()} ${response.url()}`);
  });
};
const verifyLink = async (page) => {
  await page.waitForFunction(() => document.activeElement?.getAttribute("role") === "dialog");
  const link = page.getByRole("dialog").getByRole("link", { name: "Explore Highlight Corner" });
  assert.equal(await link.getAttribute("href"), "https://highlightcorner.com/");
  assert.equal(await link.getAttribute("target"), "_blank");
  assert.equal(await link.getAttribute("rel"), "noreferrer");
};

try {
  for (const [width, height] of [[1280, 720], [768, 1024], [390, 844]]) {
    const page = await browser.newPage({ viewport: { width, height }, reducedMotion: "reduce", hasTouch: width === 390, isMobile: width === 390 });
    observe(page);
    await page.goto(`${baseURL}${width === 768 ? "/campus/" : "/"}`);
    assert.match(await page.title(), /Anas Ahmed|Interactive Project Campus/);
    await page.getByRole("button", { name: "Enter the 3D Campus" }).click();
    await page.locator("canvas").waitFor();
    const map = page.getByRole("complementary", { name: "Campus map" });
    assert.equal(await map.getByRole("button").count(), 8);
    const target = map.getByRole("button", { name: "Go to Highlight Corner", exact: true });
    if (width === 390) await target.tap();
    else await target.click();
    assert.match(await page.getByRole("dialog").innerText(), /fan passion project[\s\S]*272-game/);
    await verifyLink(page);
    await page.keyboard.press("Escape");
    await page.getByRole("dialog").waitFor({ state: "hidden" });
    await page.waitForTimeout(100);
    assert.equal(await target.evaluate((el) => el === document.activeElement), true, await page.evaluate(() => document.activeElement?.outerHTML.slice(0, 220)));
    await page.getByRole("button", { name: "View Highlight Corner information" }).waitFor();
    await page.waitForTimeout(1500);
    const nearbyBounds = await page.getByRole("button", { name: "View Highlight Corner information" }).boundingBox();
    const mapBounds = await map.boundingBox();
    assert.ok(nearbyBounds.x + nearbyBounds.width <= mapBounds.x || nearbyBounds.y >= mapBounds.y + mapBounds.height || nearbyBounds.y + nearbyBounds.height <= mapBounds.y, "Nearby action must not cover map buttons");
    await page.screenshot({ path: `${screenshots}/highlight-campus-${width}.png` });
    // Arrow/WASD movement remains live under reduced motion; Space opens the
    // nearby destination once keyboard focus is on the world rather than a button.
    await target.evaluate((el) => el.blur());
    await page.keyboard.press("Space");
    await page.getByRole("dialog").waitFor();
    await page.keyboard.press("Escape");
    await page.keyboard.down("ArrowDown");
    await page.waitForTimeout(450);
    await page.keyboard.up("ArrowDown");
    await page.getByRole("button", { name: "View Highlight Corner information" }).waitFor({ state: "hidden" });
    await page.keyboard.down("w");
    await page.waitForTimeout(450);
    await page.keyboard.up("w");
    await page.getByRole("button", { name: "View Highlight Corner information" }).waitFor();
    if (width === 1280) {
      await target.click();
      await page.keyboard.press("Escape");
      await page.waitForTimeout(1000);
      // Visible booth shell and clear grass in the standard desktop camera.
      await page.mouse.click(740, 310);
      await page.getByRole("dialog").waitFor();
      await verifyLink(page);
      await page.keyboard.press("Escape");
      await page.mouse.click(535, 500);
      await page.getByRole("button", { name: "View Highlight Corner information" }).waitFor({ state: "hidden" });
      console.log("PASS pointer selection of the booth and point-to-move on clear ground");
    }
    await page.getByRole("button", { name: "Reset", exact: true }).click();
    await page.getByRole("button", { name: "View Highlight Corner information" }).waitFor({ state: "hidden" });
    await page.getByRole("button", { name: "2D view", exact: true }).click();
    assert.equal(await page.locator(".accessible-grid article").count(), 8);
    const details = page.getByRole("button", { name: "Read about Highlight Corner", exact: true });
    await details.click();
    await verifyLink(page);
    await page.keyboard.press("Escape");
    await page.waitForTimeout(100);
    assert.equal(await details.evaluate((el) => el === document.activeElement), true);
    assert.equal(await details.isVisible(), true);
    await page.close();
    console.log(`PASS ${width}×${height}: map, dialog, safe external link, focus, keyboard, reset, reduced motion, 2D view`);
  }

  for (const route of ["/", "/campus/"]) {
    const page = await browser.newPage();
    observe(page);
    await page.addInitScript(() => {
      const original = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = function (type, ...args) {
        if (type === "webgl" || type === "webgl2") return null;
        return original.call(this, type, ...args);
      };
    });
    await page.goto(`${baseURL}${route}`);
    await page.getByRole("button", { name: "Enter the 3D Campus" }).click();
    const details = page.getByRole("button", { name: "Read about Highlight Corner", exact: true });
    await details.click();
    await verifyLink(page);
    assert.equal(await page.locator("canvas").count(), 0);
    await page.keyboard.press("Escape");
    await page.waitForTimeout(100);
    assert.equal(await details.evaluate((el) => el === document.activeElement), true);
    await page.close();
    console.log(`PASS ${route}: WebGL-unavailable fallback, dialog, external link, focus return`);
  }
  assert.deepEqual(errors, [], "No application errors or broken assets");
} finally {
  await browser.close();
}
