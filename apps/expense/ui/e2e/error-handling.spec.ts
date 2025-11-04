import { test, expect } from '@playwright/test';

/**
 * E2E Test: Error Handling & Recovery
 *
 * Tests error scenarios including:
 * - Validation error handling
 * - Error messages display
 * - User recovery from errors
 * - Form state preservation
 * - User-friendly error messages
 */
test.describe('Error Handling & Recovery', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('h1:has-text("Expense Tracker")', { timeout: 10000 });
    await page.waitForSelector('#amount', { timeout: 10000 });
  });

  test('should handle validation errors gracefully', async ({ page }) => {
    // Try to submit form with no data
    await page.click('button[type="submit"]');

    // Verify error messages appear
    await expect(page.locator('text=Amount is required')).toBeVisible();
  });

  test('should display specific error message for invalid amount', async ({ page }) => {
    // Enter invalid amount
    await page.fill('#amount', 'not-a-number');
    await page.fill('#description', 'Test');
    await page.selectOption('#month', 'January');
    await page.fill('#category', 'Test');

    await page.click('button[type="submit"]');

    // Verify specific error message
    await expect(page.locator('text=Amount must be a valid number')).toBeVisible();
  });

  test('should allow user to fix errors and resubmit', async ({ page }) => {
    // First attempt with error
    await page.fill('#amount', 'invalid');
    await page.fill('#description', 'Test');
    await page.selectOption('#month', 'January');
    await page.fill('#category', 'Test');

    await page.click('button[type="submit"]');
    await expect(page.locator('text=Amount must be a valid number')).toBeVisible();

    // Fix the error
    await page.fill('#amount', '25.50');

    // Resubmit
    await page.click('button[type="submit"]');

    // Verify success
    await page.waitForSelector('text=Test', { timeout: 5000 });
    await expect(page.locator('text=$25.50')).toBeVisible();
  });

  test('should maintain form state on error', async ({ page }) => {
    // Fill form with invalid data
    await page.fill('#amount', '-10');
    await page.fill('#description', 'Negative amount');
    await page.selectOption('#month', 'January');
    await page.fill('#category', 'Test');

    await page.click('button[type="submit"]');

    // Verify error shown
    await expect(page.locator('text=Amount must be greater than 0')).toBeVisible();

    // Verify form data is preserved
    expect(await page.inputValue('#description')).toBe('Negative amount');
  });

  test('should show clear, user-friendly error messages', async ({ page }) => {
    // Test various validation errors show clear messages
    const errorScenarios = [
      { amount: '', field: 'Amount is required' },
      { amount: 'abc', field: 'Amount must be a valid number' },
      { amount: '-5', field: 'Amount must be greater than 0' },
    ];

    for (const scenario of errorScenarios) {
      await page.fill('#amount', scenario.amount);
      await page.fill('#description', 'Test');
      await page.selectOption('#month', 'January');
      await page.fill('#category', 'Test');

      await page.click('button[type="submit"]');

      // Verify user-friendly message appears
      await expect(page.locator(`text=${scenario.field}`)).toBeVisible();

      // Clear for next iteration
      await page.fill('#amount', '');
      await page.fill('#description', '');
    }
  });

  test('should allow recovery from all error states', async ({ page }) => {
    // Introduce error
    await page.fill('#amount', 'invalid');
    await page.fill('#description', 'Error test');
    await page.selectOption('#month', 'January');
    await page.fill('#category', 'Test');
    await page.click('button[type="submit"]');

    await expect(page.locator('text=Amount must be a valid number')).toBeVisible();

    // Recover by entering valid data
    await page.fill('#amount', '75.25');

    // Should be able to submit again
    await page.click('button[type="submit"]');

    // Verify recovery successful
    await page.waitForSelector('text=Error test', { timeout: 5000 });
    await expect(page.locator('text=$75.25')).toBeVisible();
  });

  test('should show validation error for missing description', async ({ page }) => {
    await page.fill('#amount', '50.00');
    // Leave description empty
    await page.selectOption('#month', 'January');
    await page.fill('#category', 'Test');

    await page.click('button[type="submit"]');

    await expect(page.locator('text=Description is required')).toBeVisible();
  });

  test('should show validation error for negative amount', async ({ page }) => {
    await page.fill('#amount', '-25.00');
    await page.fill('#description', 'Negative test');
    await page.selectOption('#month', 'January');
    await page.fill('#category', 'Test');

    await page.click('button[type="submit"]');

    await expect(page.locator('text=Amount must be greater than 0')).toBeVisible();
  });

  test('should show validation error for amount exceeding max', async ({ page }) => {
    await page.fill('#amount', '10000.00');
    await page.fill('#description', 'Too much');
    await page.selectOption('#month', 'January');
    await page.fill('#category', 'Test');

    await page.click('button[type="submit"]');

    await expect(page.locator('text=Amount cannot exceed $9999.99')).toBeVisible();
  });

  test('should show validation error for description too long', async ({ page }) => {
    const longDescription = 'a'.repeat(101);
    await page.fill('#amount', '50.00');
    await page.fill('#description', longDescription);
    await page.selectOption('#month', 'January');
    await page.fill('#category', 'Test');

    await page.click('button[type="submit"]');

    await expect(page.locator('text=Description must be 100 characters or less')).toBeVisible();
  });

  test('should clear errors when user corrects input', async ({ page }) => {
    // First, trigger an error
    await page.fill('#amount', 'invalid');
    await page.fill('#description', 'Test');
    await page.selectOption('#month', 'January');
    await page.fill('#category', 'Test');

    await page.click('button[type="submit"]');
    await expect(page.locator('text=Amount must be a valid number')).toBeVisible();

    // Now fix the input
    await page.fill('#amount', '50.00');

    // Wait a bit and verify error is gone or user can resubmit successfully
    await page.click('button[type="submit"]');
    await page.waitForSelector('text=Test', { timeout: 5000 });

    // Error should not appear anymore since we successfully submitted
    const errorVisible = await page.locator('text=Amount must be a valid number').isVisible();
    expect(errorVisible).toBe(false);
  });

  test('should handle multiple field validation errors', async ({ page }) => {
    // Submit with multiple errors
    await page.fill('#amount', 'invalid');
    // Leave description empty
    // Leave month as default
    await page.fill('#category', 'Test');

    await page.click('button[type="submit"]');

    // Should show multiple errors
    await expect(page.locator('text=Amount must be a valid number')).toBeVisible();
    await expect(page.locator('text=Description is required')).toBeVisible();
  });

  test('should preserve other field values when one field has error', async ({ page }) => {
    // Fill form with one invalid field
    await page.fill('#amount', 'invalid');
    await page.fill('#description', 'Preserved description');
    await page.selectOption('#month', 'February');
    await page.fill('#category', 'Preserved category');

    await page.click('button[type="submit"]');

    // Verify error shown
    await expect(page.locator('text=Amount must be a valid number')).toBeVisible();

    // Verify other values are preserved
    expect(await page.inputValue('#description')).toBe('Preserved description');
    expect(await page.inputValue('#category')).toBe('Preserved category');
    const monthValue = await page.inputValue('#month');
    expect(monthValue).toBe('February');
  });

  test('should allow multiple error correction cycles', async ({ page }) => {
    // First error cycle
    await page.fill('#amount', 'invalid');
    await page.fill('#description', 'Test 1');
    await page.selectOption('#month', 'January');
    await page.fill('#category', 'Test');

    await page.click('button[type="submit"]');
    await expect(page.locator('text=Amount must be a valid number')).toBeVisible();

    // Fix first error
    await page.fill('#amount', '-50');
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Amount must be greater than 0')).toBeVisible();

    // Fix second error
    await page.fill('#amount', '50.00');
    await page.click('button[type="submit"]');

    // Should succeed
    await page.waitForSelector('text=Test 1', { timeout: 5000 });
    await expect(page.locator('text=$50.00')).toBeVisible();
  });

  test('should handle edge case amounts correctly', async ({ page }) => {
    const edgeCases = [
      { amount: '0.01', shouldPass: true },  // Smallest valid amount
      { amount: '9999.99', shouldPass: true }, // Largest valid amount
      { amount: '0', shouldPass: false }, // Zero not allowed
      { amount: '0.00', shouldPass: false }, // Zero not allowed
    ];

    for (const { amount, shouldPass } of edgeCases) {
      await page.fill('#amount', amount);
      await page.fill('#description', `Edge case: ${amount}`);
      await page.selectOption('#month', 'January');
      await page.fill('#category', 'Test');

      await page.click('button[type="submit"]');

      if (shouldPass) {
        // Should appear in list
        await expect(page.locator(`text=${amount.replace(/\.0+$/, '')}`)).toBeVisible();
      } else {
        // Should show error
        await expect(
          page.locator('text=Amount must be greater than 0').or(
            page.locator('text=Amount is required')
          )
        ).toBeVisible();
      }

      // Clear for next test
      await page.fill('#amount', '');
      await page.fill('#description', '');
      await page.waitForTimeout(100);
    }
  });
});
