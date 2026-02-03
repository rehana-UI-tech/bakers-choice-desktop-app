import { test, expect } from '@playwright/test';

test('Login page loads', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
});

test('Login button visible', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
});

test('Email and Password fields visible', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByPlaceholder('Enter your email')).toBeVisible();
  await expect(page.getByPlaceholder('Enter your password')).toBeVisible();
});
