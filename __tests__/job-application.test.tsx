import { test, expect } from "@playwright/test";

test("user can apply to a job", async ({ page }) => {
  // Login
  await page.goto("/");
  await page.click("text=Login");
  await page.fill('input[type="email"]', "test@example.com");
  await page.fill('input[type="password"]', "password");
  await page.click('button:text("Login")');

  // Navigate to jobs
  await page.click("text=Browse Jobs");

  // Apply to a job
  await page.click("text=View Details");
  await page.click('button:text("Apply Now")');

  // Verify application
  const successMessage = await page.textContent("text=Successfully applied!");
  expect(successMessage).toBeTruthy();
});
