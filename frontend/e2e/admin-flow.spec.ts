import { test, expect } from '@playwright/test';

test('Admin can login and see the dashboard', async ({ page }) => {
  // Mock login API
  await page.route('*/**/api/admin/login', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        token: 'fake_jwt_token',
        user: { id: '1', email: 'admin@ministere.gov', role: 'SUPER_ADMIN' }
      }),
    });
  });

  // Mock services API for dashboard
  await page.route('*/**/api/admin/services', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        { id: '1', titre_fr: 'Service Admin Test', direction: { nom_fr: 'Direction Test' } }
      ]),
    });
  });

  await page.goto('/admin/login');
  
  // Fill the form
  await page.fill('input[type="email"]', 'admin@ministere.gov');
  await page.fill('input[type="password"]', 'admin');
  await page.click('button:has-text("Connexion")');

  // Should be redirected to dashboard
  await expect(page).toHaveURL(/.*admin/);
  await expect(page.locator('h2')).toContainText('Tableau de Bord');
  
  // Should see the mocked service
  await expect(page.locator('text=Service Admin Test')).toBeVisible();
});
