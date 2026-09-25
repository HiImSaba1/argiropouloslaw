import { chromium, type Page } from "@playwright/test";
import { legalServices } from "../src/data/services";

const baseURL = process.env.TEST_BASE_URL ?? "http://localhost:3000";
const routes = [
  "/",
  "/about-us",
  "/viografiko",
  "/ypiresies",
  "/poreia-diacheirisis-ypotheseon",
  "/epikoinonia",
  "/politiki-aporritou",
  ...legalServices.map(({ slug }) => `/services/${slug}`),
];

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

async function auditPage(page: Page, route: string, viewport: string) {
  const response = await page.goto(`${baseURL}${route}`, { waitUntil: "networkidle" });
  assert(response?.ok(), `${viewport} ${route}: HTTP ${response?.status() ?? "unknown"}`);
  await page.evaluate(() => document.fonts.ready);

  const result = await page.evaluate(() => {
    const headingLevels = Array.from(document.querySelectorAll("h1,h2,h3,h4,h5,h6"), (heading) => Number(heading.tagName.slice(1)));
    const duplicateIds = Array.from(document.querySelectorAll<HTMLElement>("[id]"), (element) => element.id)
      .filter((id, index, ids) => ids.indexOf(id) !== index);
    const unnamedControls = Array.from(document.querySelectorAll<HTMLElement>("a[href],button,input,textarea,select"))
      .filter((element) => {
        if (element.closest('[aria-hidden="true"]') || element.getAttribute("type") === "hidden") return false;
        const labelledBy = element.getAttribute("aria-labelledby");
        const label = element.getAttribute("aria-label")
          || (labelledBy ? document.getElementById(labelledBy)?.textContent : "")
          || ("labels" in element ? Array.from((element as HTMLInputElement).labels ?? [], (item) => item.textContent).join(" ") : "")
          || element.textContent
          || element.getAttribute("title");
        return !label?.trim();
      }).length;
    return {
      brokenImages: Array.from(document.images).filter((image) => image.complete && image.naturalWidth === 0).length,
      canonicalCount: document.querySelectorAll('link[rel="canonical"]').length,
      duplicateIds: [...new Set(duplicateIds)],
      headingSkips: headingLevels.slice(1).filter((level, index) => level - headingLevels[index] > 1).length,
      h1Count: document.querySelectorAll("h1").length,
      lang: document.documentElement.lang,
      mainCount: document.querySelectorAll("main#main-content").length,
      overflowPixels: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      skipLinkCount: document.querySelectorAll('a.skip-link[href="#main-content"]').length,
      unnamedControls,
    };
  });

  assert(result.h1Count === 1, `${viewport} ${route}: expected one h1, found ${result.h1Count}`);
  assert(result.mainCount === 1, `${viewport} ${route}: missing unique #main-content`);
  assert(result.skipLinkCount === 1, `${viewport} ${route}: missing skip link`);
  assert(result.lang === "el", `${viewport} ${route}: html lang is not el`);
  assert(result.canonicalCount === 1, `${viewport} ${route}: expected one canonical link`);
  assert(result.duplicateIds.length === 0, `${viewport} ${route}: duplicate IDs ${result.duplicateIds.join(", ")}`);
  assert(result.headingSkips === 0, `${viewport} ${route}: heading hierarchy skips a level`);
  assert(result.overflowPixels <= 1, `${viewport} ${route}: horizontal overflow ${result.overflowPixels}px`);
  assert(result.brokenImages === 0, `${viewport} ${route}: ${result.brokenImages} broken images`);
  assert(result.unnamedControls === 0, `${viewport} ${route}: ${result.unnamedControls} unnamed controls`);
}

async function main() {
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  try {
  for (const config of [
    { name: "desktop", width: 1440, height: 1000 },
    { name: "mobile", width: 390, height: 844 },
  ]) {
    const context = await browser.newContext({ viewport: { width: config.width, height: config.height } });
    const page = await context.newPage();
    for (const route of routes) await auditPage(page, route, config.name);
    await context.close();
  }

  const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.goto(baseURL, { waitUntil: "networkidle" });
  assert(await page.evaluate(() => matchMedia("(prefers-reduced-motion: reduce)").matches), "Reduced-motion preference was not honored");

  const menuButton = page.locator(".site-header__menu-button");
  await menuButton.click();
  assert(await menuButton.getAttribute("aria-expanded") === "true", "Menu did not expose its expanded state");
  await page.waitForFunction(() => document.activeElement?.matches("#site-menu nav a"));
  await page.keyboard.press("Escape");
  assert(await menuButton.getAttribute("aria-expanded") === "false", "Escape did not close the menu");
  assert(await menuButton.evaluate((button) => document.activeElement === button), "Menu button did not regain focus");

  await page.reload({ waitUntil: "networkidle" });
  await page.keyboard.press("Tab");
  assert(await page.evaluate(() => document.activeElement?.classList.contains("skip-link")), "Skip link is not the first keyboard target");
  await page.keyboard.press("Enter");
  assert(await page.evaluate(() => document.activeElement?.id === "main-content"), "Skip link did not focus the main content");
  await context.close();
  } finally {
    await browser.close();
  }

  console.log(`Sprint 12 browser acceptance passed for ${routes.length} routes at desktop and mobile widths.`);
}

void main();
