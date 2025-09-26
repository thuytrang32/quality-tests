import { test, expect } from "@playwright/test";

test.describe("Signup flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:5173/");

  });

  test("user can create an account", async ({ page }) => {
    await page.getByLabel("Username").fill("tt");
    await page.getByLabel("Email").fill("tt@example.com");
    await page.getByLabel("Password").fill("123456");
    await page.getByRole("button", { name: /create account/i }).click();

    await expect(page.getByText(/account created/i)).toBeVisible();
    await expect(page.getByText(/welcome, tt/i)).toBeVisible();
  });

  test("shows error if email is invalid", async ({ page }) => {
  await page.goto("http://localhost:5173/"); 
  await page.getByLabel("Username").fill("ex");
  await page.getByLabel("Email").fill("not-an-email");
  await page.getByLabel("Password").fill("123456");
  await page.getByRole("button", { name: /create account/i }).click();
  await expect(page.getByText(/email is not valid/i)).toBeVisible();
  });

  test("shows error if fields are missing", async ({ page }) => {
  await page.goto("http://localhost:5173/");
  await page.getByRole("button", { name: /create account/i }).click();
  await expect(page.getByText(/all fields are required/i)).toBeVisible();
  });
});
