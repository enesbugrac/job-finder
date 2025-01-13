import { test, expect } from "@playwright/test";

test("user can apply to a job", async ({ page }) => {
  await page.goto("/");
  await page.click("text=Login");
  await page.fill('input[type="email"]', "test@example.com");
  await page.fill('input[type="password"]', "password");
  await page.click('button:text("Login")');

  await page.click("text=Browse Jobs");

  await page.click("text=View Details");
  await page.click('button:text("Apply Now")');

  const successMessage = await page.textContent("text=Successfully applied!");
  expect(successMessage).toBeTruthy();
});
