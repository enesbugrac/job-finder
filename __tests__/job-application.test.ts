import { test, expect } from "@playwright/test";

test.describe("Job Application Flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/tr");
  });

  test("should allow user to login and apply for a job in Turkish", async ({ page }) => {
    const headerLoginButton = page.getByRole("button", { name: "Giriş Yap" }).first();
    await expect(headerLoginButton).toBeVisible();
    await headerLoginButton.click();

    const loginModal = page.locator('[role="dialog"]').first();
    await expect(loginModal).toBeVisible();

    await page.getByPlaceholder("E-posta adresinizi girin").fill("test12345@gmail.com");
    await page.getByPlaceholder("Şifrenizi girin").fill("12345678");

    const submitButton = loginModal.getByRole("button", { name: "Giriş Yap" });

    const loginResponse = page.waitForResponse(
      (response) =>
        response.url().includes("/api/auth/login") && response.status() === 200,
      { timeout: 30000 }
    );

    await submitButton.click();
    await loginResponse;

    const jobsLink = page.getByRole("link", { name: "İşler" });
    await expect(jobsLink).toBeVisible();
    await jobsLink.click();
    await page.waitForURL("**/tr/jobs");

    await page.waitForResponse(
      (response) => response.url().includes("/api/jobs") && response.status() === 200,
      { timeout: 30000 }
    );

    const firstJobDetails = page.getByRole("button", { name: "Detaylar" }).first();
    await expect(firstJobDetails).toBeVisible();
    await firstJobDetails.click();

    const jobModal = page.locator('[role="dialog"]').first();
    await expect(jobModal).toBeVisible({ timeout: 30000 });

    const applyButton = jobModal.getByRole("button", { name: /Başvur|Başvuruldu/ });
    await expect(applyButton).toBeVisible();

    if (await applyButton.isEnabled()) {
      const applyResponse = page.waitForResponse(
        (response) =>
          response.url().includes("/api/jobs") &&
          response.url().includes("/apply") &&
          response.status() === 200,
        { timeout: 30000 }
      );

      await applyButton.click();
      await applyResponse;

      await expect(page.getByText("Başvuru başarıyla yapıldı")).toBeVisible();
    }

    if (await jobModal.isVisible()) {
      const cancelButton = jobModal.getByRole("button", { name: "İptal" });
      if (await cancelButton.isVisible()) {
        await cancelButton.click();
      }
    }

    await expect(jobModal).not.toBeVisible({ timeout: 5000 });

    const userEmail = "test12345@gmail.com";
    const userMenu = page.getByTestId("user-menu");
    await expect(userMenu).toBeVisible({ timeout: 10000 });
    await expect(page.getByTestId("user-email")).toHaveText(userEmail);
    await userMenu.click();

    const applicationsPanel = page.getByRole("complementary", { name: "applications" });
    await expect(applicationsPanel).toBeVisible({ timeout: 10000 });

    const panelTitle = page.getByRole("heading", { name: "Başvurularım" });
    await expect(panelTitle).toBeVisible({ timeout: 10000 });

    const withdrawButton = page.getByRole("button", { name: "Geri Çek" }).first();
    if (await withdrawButton.isVisible()) {
      await page.waitForTimeout(1000);

      const withdrawResponse = page.waitForResponse(
        (response) =>
          response.url().includes("/api/jobs") &&
          response.url().includes("/withdraw") &&
          response.status() === 200,
        { timeout: 30000 }
      );

      await withdrawButton.click({ force: true });
      await withdrawResponse;

      await expect(
        page.getByText("Başvuru başarıyla geri çekildi", { exact: false })
      ).toBeVisible({ timeout: 10000 });

      await page.waitForTimeout(1000);
    }
  });
});
