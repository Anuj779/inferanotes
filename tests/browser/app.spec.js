import { test, expect } from "@playwright/test";
test("home has no paid plans, language preview works, FAQ works", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Less replay. More recall." }),
  ).toBeVisible();
  await expect(page.getByText("Upgrade to Pro")).toHaveCount(0);
  await page.getByRole("button", { name: "हिन्दी", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "याद रखने का विज्ञान" }),
  ).toBeVisible();
  await page.locator('summary').filter({ hasText: 'Is InferaNotes free?' }).click();
  await expect(
    page.getByText(/There is no subscription or payment/),
  ).toBeVisible();
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await expect.poll(() => page.locator('.study-preview').evaluate(el => ['none', 'matrix(1, 0, 0, 1, 0, 0)'].includes(getComputedStyle(el).transform))).toBe(true);
  await page.screenshot({
    path: "test-results/home-desktop.png",
    fullPage: true,
  });
});
test("mobile fits viewport and theme can be toggled", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Less replay. More recall." }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.getByRole("button", { name: /Switch to .* theme/ }).click();
  await expect(page.locator('.study-preview')).toHaveCSS('opacity', '1');
  await page.screenshot({
    path: "test-results/home-mobile.png",
    fullPage: true,
  });
});
test("protected APIs reject missing tokens and legacy mutation endpoint is closed", async ({
  request,
}) => {
  for (const path of [
    "/api/notes",
    "/api/usage?uid=victim",
    "/api/notes/fake",
  ]) {
    const res = await request.get(path);
    expect(res.status()).toBe(401);
    expect(res.headers()["cache-control"]).toContain("no-store");
  }
  expect(
    (
      await request.post("/api/generate", {
        data: { uid: "victim", transcript: "test" },
      })
    ).status(),
  ).toBe(401);
  expect(
    (await request.post("/api/usage", { data: { uid: "victim" } })).status(),
  ).toBe(405);
  expect((await request.post("/api/translate", { data: {} })).status()).toBe(
    404,
  );
});
test("dashboard requires login and old pricing redirects", async ({ page }) => {
  await page.goto("/pricing");
  await expect(page).toHaveURL(/\/login$/);
  await expect(
    page.getByRole("heading", { name: "Welcome to InferaNotes." }),
  ).toBeVisible();
});
