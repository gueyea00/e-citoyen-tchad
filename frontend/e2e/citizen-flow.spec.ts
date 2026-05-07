import { test, expect } from '@playwright/test';

test.use({ locale: 'fr-FR' });

test('Citizen can navigate to information and search', async ({ page }) => {
  // Mock complet de l'API
  await page.route(/\/api\/services/, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        { 
          id: 'mock1', 
          titre_fr: 'MOCK_SERVICE_TITLE', 
          desc_fr: 'Description du service mocké', 
          slug: 'mock-slug',
          direction: { nom_fr: 'Service de Test' }
        }
      ]),
    });
  });

  await page.goto('/');
  await page.click('header a[href="/informations"]');
  
  // Attente du titre de la page pour confirmer le chargement du composant
  await expect(page.locator('h1')).toBeVisible();

  // On cherche le titre spécifiquement
  await expect(page.getByText('MOCK_SERVICE_TITLE')).toBeVisible({ timeout: 15000 });
});
