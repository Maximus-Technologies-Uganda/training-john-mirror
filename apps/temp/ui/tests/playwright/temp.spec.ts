import { test, expect } from '@playwright/test';

test.describe('Temp UI smoke', () => {
  test('renders placeholder messaging', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Temp UI');
    await expect(
      page.getByText('Replace this placeholder with the Temp Converter experience.')
    ).toBeVisible();
  });
});

