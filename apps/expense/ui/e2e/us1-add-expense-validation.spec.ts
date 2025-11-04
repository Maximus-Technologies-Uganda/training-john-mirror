import { test, expect } from '@playwright/test';

/**
 * E2E Test: User Story 1 - Add Expense with Validation
 *
 * Tests the complete add expense workflow including:
 * - Form submission with valid data
 * - Validation error handling
 * - Invalid input scenarios
 * - Error message display
 * - Form reset after submission
 * - Amount cents conversion
 */
test.describe('US1: Add Expense with Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('h1:has-text("Expense Tracker")', { timeout: 10000 });
    await page.waitForSelector('#amount', { timeout: 10000 });
  });

  test('should add expense with valid data', async ({ page }) => {
    // Fill in form with valid data
    await page.fill('#amount', '50.25');
    await page.fill('#description', 'Groceries');
    await page.selectOption('#month', 'January');
    await page.fill('#category', 'Food');

    // Submit form
    await page.click('button[type="submit"]');

    // Verify expense added
    await page.waitForSelector('text=Groceries', { timeout: 5000 });
    await expect(page.locator('text=$50.25')).toBeVisible();
    await expect(page.locator('text=Food')).toBeVisible();
    await expect(page.locator('text=Total Expenses: 1')).toBeVisible();
  });

  test('should show validation error for empty amount', async ({ page }) => {
    // Leave amount empty
    await page.fill('#description', 'Test expense');
    await page.selectOption('#month', 'January');
    await page.fill('#category', 'Test');

    // Try to submit
    await page.click('button[type="submit"]');

    // Check for error message
    await expect(page.locator('text=Amount is required')).toBeVisible();
  });

  test('should show validation error for invalid amount format', async ({ page }) => {
    // Invalid amount format
    await page.fill('#amount', 'abc');
    await page.fill('#description', 'Test');
    await page.selectOption('#month', 'January');
    await page.fill('#category', 'Test');

    await page.click('button[type="submit"]');

    await expect(page.locator('text=Amount must be a valid number')).toBeVisible();
  });

  test('should show validation error for negative amount', async ({ page }) => {
    // Negative amount
    await page.fill('#amount', '-25.50');
    await page.fill('#description', 'Test');
    await page.selectOption('#month', 'January');
    await page.fill('#category', 'Test');

    await page.click('button[type="submit"]');

    await expect(page.locator('text=Amount must be greater than 0')).toBeVisible();
  });

  test('should show validation error for amount > 9999.99', async ({ page }) => {
    // Too large amount
    await page.fill('#amount', '10000.00');
    await page.fill('#description', 'Test');
    await page.selectOption('#month', 'January');
    await page.fill('#category', 'Test');

    await page.click('button[type="submit"]');

    await expect(page.locator('text=Amount cannot exceed $9999.99')).toBeVisible();
  });

  test('should show validation error for missing description', async ({ page }) => {
    // Leave description empty
    await page.fill('#amount', '25.50');
    await page.selectOption('#month', 'January');
    await page.fill('#category', 'Test');

    await page.click('button[type="submit"]');

    await expect(page.locator('text=Description is required')).toBeVisible();
  });

  test('should show validation error for description too long', async ({ page }) => {
    // Description too long (>100 chars)
    const longDescription = 'a'.repeat(101);
    await page.fill('#amount', '25.50');
    await page.fill('#description', longDescription);
    await page.selectOption('#month', 'January');
    await page.fill('#category', 'Test');

    await page.click('button[type="submit"]');

    await expect(page.locator('text=Description must be 100 characters or less')).toBeVisible();
  });

  test('should show validation error for invalid month', async ({ page }) => {
    await page.fill('#amount', '25.50');
    await page.fill('#description', 'Test expense');
    // Don't select a month - leave as default
    await page.fill('#category', 'Test');

    // Try to submit
    await page.click('button[type="submit"]');

    // Should show month validation error
    await expect(page.locator('text=Month is required').or(page.locator('text=Please select a month'))).toBeVisible();
  });

  test('should clear form after successful submission', async ({ page }) => {
    // Add expense
    await page.fill('#amount', '50.25');
    await page.fill('#description', 'Test');
    await page.selectOption('#month', 'January');
    await page.fill('#category', 'Test');

    await page.click('button[type="submit"]');
    await page.waitForSelector('text=Test', { timeout: 5000 });

    // Verify form is cleared
    const amountValue = await page.inputValue('#amount');
    const descriptionValue = await page.inputValue('#description');

    expect(amountValue).toBe('');
    expect(descriptionValue).toBe('');
  });

  test('should convert decimal amount to cents correctly', async ({ page }) => {
    // Add expense with specific amount
    await page.fill('#amount', '12.99');
    await page.fill('#description', 'Test cents');
    await page.selectOption('#month', 'January');
    await page.fill('#category', 'Test');

    await page.click('button[type="submit"]');

    // Verify expense stored and displayed correctly
    await page.waitForSelector('text=Test cents', { timeout: 5000 });
    await expect(page.locator('text=$12.99')).toBeVisible();
  });

  test('should allow user to fix validation errors and resubmit', async ({ page }) => {
    // First attempt with invalid data
    await page.fill('#amount', 'invalid');
    await page.fill('#description', 'Test');
    await page.selectOption('#month', 'January');
    await page.fill('#category', 'Test');

    await page.click('button[type="submit"]');
    await expect(page.locator('text=Amount must be a valid number')).toBeVisible();

    // Fix the error
    await page.fill('#amount', '35.75');

    // Resubmit
    await page.click('button[type="submit"]');

    // Verify success
    await page.waitForSelector('text=Test', { timeout: 5000 });
    await expect(page.locator('text=$35.75')).toBeVisible();
  });

  test('should maintain form state when validation fails', async ({ page }) => {
    // Fill form with invalid data
    await page.fill('#amount', '-10');
    await page.fill('#description', 'Negative amount test');
    await page.selectOption('#month', 'January');
    await page.fill('#category', 'Test');

    await page.click('button[type="submit"]');

    // Verify error shown
    await expect(page.locator('text=Amount must be greater than 0')).toBeVisible();

    // Verify form data is preserved
    expect(await page.inputValue('#description')).toBe('Negative amount test');
    expect(await page.inputValue('#amount')).toBe('-10');
  });

  test('should validate multiple fields independently', async ({ page }) => {
    // Submit with only amount (rest empty)
    await page.fill('#amount', '50.00');

    await page.click('button[type="submit"]');

    // Should show description error
    await expect(page.locator('text=Description is required')).toBeVisible();
  });

  test('should format currency preview correctly', async ({ page }) => {
    // Test various amounts
    const testCases = [
      { input: '10.5', expected: '10.50' },
      { input: '100.1', expected: '100.10' },
      { input: '1', expected: '1.00' },
    ];

    for (const { input, expected } of testCases) {
      await page.fill('#amount', input);
      await page.fill('#description', 'Test');
      await page.selectOption('#month', 'January');
      await page.fill('#category', 'Test');

      await page.click('button[type="submit"]');
      await page.waitForSelector(`text=$${expected}`, { timeout: 5000 });

      // Clear for next test
      await page.fill('#amount', '');
      await page.waitForTimeout(100);
    }
  });
});
