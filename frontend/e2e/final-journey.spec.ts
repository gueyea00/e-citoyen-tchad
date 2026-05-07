import { test, expect } from '@playwright/test';

test.use({ viewport: { width: 1440, height: 900 }, locale: 'fr-FR' });

test('Final User Journey: Citizen Exploration & Localization', async ({ page }) => {
  // Mocking the Backend API
  await page.route(/\/api\/services/, async (route) => {
    const url = route.request().url();
    if (url.includes('certificat-residence')) {
      await route.fulfill({ 
        status: 200, 
        contentType: 'application/json', 
        body: JSON.stringify({ 
          id: 'svc-1', 
          slug: 'certificat-residence', 
          titre_fr: 'Certificat de Résidence', 
          desc_fr: 'Description de test.', 
          direction: { nom_fr: 'Dir Test', adresse: 'Avenue Test', telephone: '123' }, 
          etapes: [{ id: 's1', ordre: 1, titre_fr: 'Etape 1', desc_fr: 'Desc 1' }], 
          documents: [{ id: 'd1', titre_fr: 'Doc 1' }] 
        }) 
      });
    } else {
      await route.fulfill({ 
        status: 200, 
        contentType: 'application/json', 
        body: JSON.stringify([{ id: 'svc-1', titre_fr: 'Certificat de Résidence', slug: 'certificat-residence', direction: { nom_fr: 'Dir Test' } }]) 
      });
    }
  });

  await page.goto('/');
  await page.click('header a[href="/informations"]');
  
  // 3. Select the service
  await expect(page.locator('h3').filter({ hasText: 'Certificat de Résidence' }).first()).toBeVisible({ timeout: 15000 });
  await page.click('text=En savoir plus');

  // 4. Detail Check
  await expect(page.locator('h1')).toContainText('Certificat de Résidence', { timeout: 15000 });
  
  // 5. Switching AR
  await page.click('button:has-text("AR")');
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');

  // 6. Chat widget
  await page.click('button[aria-label="Open chat"]');
  // On vérifie le titre du chatbot (span dans le header du widget) en arabe
  await expect(page.locator('span').filter({ hasText: 'المساعد الافتراضي' })).toBeVisible();
  
  // Facultatif: Vérification que le texte de bienvenue est aussi en arabe
  await expect(page.locator('text=مرحباً!')).toBeVisible();
});
