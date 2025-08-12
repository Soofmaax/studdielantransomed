import { test, expect } from '@playwright/test';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

test.describe('Critical User Journeys', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.afterAll(async () => {
    await prisma.$disconnect();
  });

  test('complete booking flow', async ({ page }) => {
    // Navigate to reservation page
    await page.click('text=Réserver');
    await page.waitForURL('/reservation');
    
    // Select a course
    await page.click('[data-testid="course-card-yoga-vinyasa"]');
    
    // Login if not authenticated
    if (page.url().includes('/login')) {
      await page.fill('[name="email"]', 'client@example.com');
      await page.fill('[name="password"]', 'client123');
      await page.click('text=Se connecter');
      await page.waitForURL('/reservation');
    }
    
    // Select date and time
    await page.click('[data-testid="date-picker"]');
    await page.click('text=15'); // Select 15th of current month
    await page.click('[data-testid="time-slot-10:00"]');
    
    // Complete booking
    await page.click('text=Procéder au paiement');
    
    // Verify redirect to Stripe
    await expect(page.url()).toContain('stripe.com');
  });

  test('authentication and admin access', async ({ page }) => {
    // Login as admin
    await page.goto('/login');
    await page.fill('[name="email"]', 'admin@studio-elan.fr');
    await page.fill('[name="password"]', 'admin123');
    await page.click('text=Se connecter');
    
    // Verify admin dashboard access
    await expect(page.url()).toBe('/admin');
    await expect(page.locator('text=Tableau de bord')).toBeVisible();
    
    // Check admin functionalities
    await page.click('text=Cours');
    await expect(page.url()).toContain('/admin/courses');
    await expect(page.locator('text=Yoga Vinyasa')).toBeVisible();
    
    // Create new course
    await page.click('text=Ajouter un cours');
    await page.fill('[name="title"]', 'Nouveau Cours');
    await page.fill('[name="description"]', 'Description du nouveau cours');
    await page.fill('[name="price"]', '30');
    await page.fill('[name="duration"]', '60');
    await page.selectOption('[name="level"]', 'ALL_LEVELS');
    await page.fill('[name="capacity"]', '15');
    await page.click('text=Sauvegarder');
    
    // Verify course creation
    await expect(page.locator('text=Nouveau Cours')).toBeVisible();
  });

  test('contact form submission', async ({ page }) => {
    await page.goto('/contact');
    
    // Fill contact form
    await page.fill('[name="name"]', 'Test User');
    await page.fill('[name="email"]', 'test@example.com');
    await page.selectOption('[name="subject"]', 'Demande d\'information');
    await page.fill('[name="message"]', 'Ceci est un message de test');
    
    // Submit form
    await page.click('text=Envoyer');
    
    // Verify success message
    await expect(page.locator('text=Message envoyé')).toBeVisible();
  });

  test('responsive navigation', async ({ page }) => {
    // Test mobile menu
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Open mobile menu
    await page.click('button[aria-label="Toggle menu"]');
    
    // Verify menu items
    await expect(page.locator('text=À propos')).toBeVisible();
    await expect(page.locator('text=Services')).toBeVisible();
    await expect(page.locator('text=Contact')).toBeVisible();
    
    // Navigate using mobile menu
    await page.click('text=Services');
    await expect(page.url()).toContain('/services');
  });
});