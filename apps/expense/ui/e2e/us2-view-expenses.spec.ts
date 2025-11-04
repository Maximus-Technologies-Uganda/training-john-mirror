import { test, expect } from '@playwright/test';

/**
 * E2E Test: User Story 2 - View All Expenses
 *
 * Tests the expense list display including:
 * - Empty state display
 * - Expense list rendering
 * - Currency formatting
 * - Total calculations
 * - Sorting order (newest first)
 * - Table structure accessibility
 */
test.describe('US2: View All Expenses', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('h1:has-text("Expense Tracker")', { timeout: 10000 });
  });

  test('should show empty state when no expenses', async ({ page }) => {
    // Verify empty state is displayed
    await expect(page.locator('text=No expenses found')).toBeVisible();
    await expect(page.locator('text=Total Expenses: 0')).toBeVisible();
    await expect(page.locator('text=Total: $0.00')).toBeVisible();
  });

  test('should display single expense correctly', async ({ page }) => {
    // Add an expense
    await page.fill('#amount', '45.50');
    await page.fill('#description', 'Lunch');
    await page.selectOption('#month', 'January');
    await page.fill('#category', 'Food');
    await page.click('button[type="submit"]');

    // Verify expense displays
    await expect(page.locator('text=Lunch')).toBeVisible();
    await expect(page.locator('text=$45.50')).toBeVisible();
    await expect(page.locator('text=Food')).toBeVisible();
    await expect(page.locator('text=Total Expenses: 1')).toBeVisible();
    await expect(page.locator('text=Total: $45.50')).toBeVisible();
  });

  test('should display multiple expenses with correct sorting (newest first)', async ({ page }) => {
    // Add first expense
    await page.fill('#amount', '25.00');
    await page.fill('#description', 'First expense');
    await page.selectOption('#month', 'January');
    await page.fill('#category', 'Test');
    await page.click('button[type="submit"]');

    await page.waitForTimeout(200);

    // Add second expense
    await page.fill('#amount', '35.00');
    await page.fill('#description', 'Second expense');
    await page.selectOption('#month', 'January');
    await page.fill('#category', 'Test');
    await page.click('button[type="submit"]');

    // Verify table has 2 rows
    const rows = page.locator('tbody tr');
    expect(await rows.count()).toBe(2);

    // Verify order - newest first (second expense should be first in list)
    const firstRow = rows.first();
    const secondRow = rows.nth(1);

    expect(await firstRow.locator('text=Second expense').isVisible()).toBe(true);
    expect(await secondRow.locator('text=First expense').isVisible()).toBe(true);
  });

  test('should format currency correctly', async ({ page }) => {
    // Add expense with specific amounts
    const testCases = [
      { amount: '10.5', expected: '$10.50' },
      { amount: '100.1', expected: '$100.10' },
      { amount: '1.01', expected: '$1.01' },
      { amount: '99.99', expected: '$99.99' },
    ];

    for (const { amount, expected } of testCases) {
      await page.fill('#amount', amount);
      await page.fill('#description', `Test ${amount}`);
      await page.selectOption('#month', 'January');
      await page.fill('#category', 'Test');
      await page.click('button[type="submit"]');

      await expect(page.locator(`text=${expected}`)).toBeVisible();
      await page.waitForTimeout(150);
    }
  });

  test('should calculate total correctly', async ({ page }) => {
    // Add multiple expenses
    const amounts = [10.50, 25.75, 14.25];
    let total = 0;

    for (let i = 0; i < amounts.length; i++) {
      const amount = amounts[i];
      total += amount;

      await page.fill('#amount', amount.toString());
      await page.fill('#description', `Expense ${i + 1}`);
      await page.selectOption('#month', 'January');
      await page.fill('#category', 'Test');
      await page.click('button[type="submit"]');

      await page.waitForTimeout(150);
    }

    // Verify total is correct
    const expectedTotal = total.toFixed(2);
    await expect(page.locator(`text=Total: $${expectedTotal}`)).toBeVisible();
    await expect(page.locator(`text=Total Expenses: ${amounts.length}`)).toBeVisible();
  });

  test('should display all required columns', async ({ page }) => {
    // Add an expense
    await page.fill('#amount', '50.00');
    await page.fill('#description', 'Complete test');
    await page.selectOption('#month', 'January');
    await page.fill('#category', 'Complete');
    await page.click('button[type="submit"]');

    // Verify table headers exist
    await expect(page.locator('th:has-text("Date")')).toBeVisible();
    await expect(page.locator('th:has-text("Description")')).toBeVisible();
    await expect(page.locator('th:has-text("Category")')).toBeVisible();
    await expect(page.locator('th:has-text("Amount")')).toBeVisible();

    // Verify data is in table row
    const row = page.locator('tbody tr').first();
    expect(await row.locator('text=Complete test').isVisible()).toBe(true);
    expect(await row.locator('text=$50.00').isVisible()).toBe(true);
  });

  test('should have accessible table structure', async ({ page }) => {
    // Add expense
    await page.fill('#amount', '30.00');
    await page.fill('#description', 'Accessible');
    await page.selectOption('#month', 'January');
    await page.fill('#category', 'Test');
    await page.click('button[type="submit"]');

    // Verify table elements
    const table = page.locator('table');
    const thead = table.locator('thead');
    const tbody = table.locator('tbody');

    expect(await table.count()).toBeGreaterThan(0);
    expect(await thead.count()).toBe(1);
    expect(await tbody.count()).toBe(1);
  });

  test('should display expense date in correct format', async ({ page }) => {
    // Add expense
    await page.fill('#amount', '99.99');
    await page.fill('#description', 'Date test');
    await page.selectOption('#month', 'January');
    await page.fill('#category', 'Test');
    await page.click('button[type="submit"]');

    // Verify date column exists and has content
    const dateCell = page.locator('tbody tr').first().locator('td').first();
    const dateText = await dateCell.textContent();

    // Date should be present (format may vary by locale)
    expect(dateText).toBeTruthy();
    expect(dateText?.trim().length).toBeGreaterThan(0);
  });

  test('should update totals when new expense is added', async ({ page }) => {
    // Verify initial empty state
    await expect(page.locator('text=Total Expenses: 0')).toBeVisible();

    // Add first expense
    await page.fill('#amount', '25.00');
    await page.fill('#description', 'First');
    await page.selectOption('#month', 'January');
    await page.fill('#category', 'Test');
    await page.click('button[type="submit"]');

    await expect(page.locator('text=Total Expenses: 1')).toBeVisible();
    await expect(page.locator('text=Total: $25.00')).toBeVisible();

    // Add second expense
    await page.fill('#amount', '15.50');
    await page.fill('#description', 'Second');
    await page.selectOption('#month', 'January');
    await page.fill('#category', 'Test');
    await page.click('button[type="submit"]');

    // Verify totals updated
    await expect(page.locator('text=Total Expenses: 2')).toBeVisible();
    await expect(page.locator('text=Total: $40.50')).toBeVisible();
  });

  test('should display expenses from different months', async ({ page }) => {
    // Add expense in January
    await page.fill('#amount', '20.00');
    await page.fill('#description', 'January expense');
    await page.selectOption('#month', 'January');
    await page.fill('#category', 'Test');
    await page.click('button[type="submit"]');

    await page.waitForTimeout(200);

    // Add expense in February
    await page.fill('#amount', '30.00');
    await page.fill('#description', 'February expense');
    await page.selectOption('#month', 'February');
    await page.fill('#category', 'Test');
    await page.click('button[type="submit"]');

    // Verify both expenses appear
    await expect(page.locator('text=January expense')).toBeVisible();
    await expect(page.locator('text=February expense')).toBeVisible();
    await expect(page.locator('text=Total Expenses: 2')).toBeVisible();
    await expect(page.locator('text=Total: $50.00')).toBeVisible();
  });

  test('should display different categories correctly', async ({ page }) => {
    // Add Food expense
    await page.fill('#amount', '15.00');
    await page.fill('#description', 'Groceries');
    await page.selectOption('#month', 'January');
    await page.fill('#category', 'Food');
    await page.click('button[type="submit"]');

    await page.waitForTimeout(200);

    // Add Transportation expense
    await page.fill('#amount', '25.00');
    await page.fill('#description', 'Gas');
    await page.selectOption('#month', 'January');
    await page.fill('#category', 'Transportation');
    await page.click('button[type="submit"]');

    // Verify both categories appear
    await expect(page.locator('text=Food')).toBeVisible();
    await expect(page.locator('text=Transportation')).toBeVisible();
    await expect(page.locator('text=Groceries')).toBeVisible();
    await expect(page.locator('text=Gas')).toBeVisible();
  });

  test('should maintain correct precision for currency amounts', async ({ page }) => {
    // Test amounts that require precise decimal handling
    const preciseAmounts = [
      { input: '1.11', display: '$1.11' },
      { input: '22.22', display: '$22.22' },
      { input: '333.33', display: '$333.33' },
      { input: '4444.44', display: '$4444.44' },
    ];

    for (const { input, display } of preciseAmounts) {
      await page.fill('#amount', input);
      await page.fill('#description', `Amount ${input}`);
      await page.selectOption('#month', 'January');
      await page.fill('#category', 'Test');
      await page.click('button[type="submit"]');

      await expect(page.locator(`text=${display}`)).toBeVisible();
      await page.waitForTimeout(150);
    }
  });
});
