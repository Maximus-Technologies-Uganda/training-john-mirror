import { test, expect } from '@playwright/test';

/**
 * E2E Smoke Test: Complete Expense Tracker Workflow
 *
 * This test verifies the complete user workflow:
 * 1. Add multiple expenses
 * 2. Filter expenses by month and category
 * 3. Verify filtering results and totals
 */
test('Complete Expense Tracker Workflow - E2E Smoke Test', async ({ page }) => {
  // Note: Not clearing localStorage to avoid loading overlay issues
  // The app should work with existing or empty localStorage

  // Navigate to the application
  await page.goto('/');

  // Wait for the application to load
  await page.waitForSelector('h1:has-text("Expense Tracker")', { timeout: 10000 });

  // Wait for the form to be ready (loading should be complete)
  await page.waitForSelector('#amount', { timeout: 10000 });
  await page.waitForSelector('#description', { timeout: 10000 });
  await page.waitForSelector('#month', { timeout: 10000 });
  await page.waitForSelector('#category', { timeout: 10000 });

  // Verify initial state - no expenses
  await expect(page.locator('h2:has-text("Your Expenses")')).toBeVisible();
  await expect(page.locator('text=No expenses found')).toBeVisible();
  await expect(page.locator('text=Total Expenses: 0')).toBeVisible();

  // ===== STEP 1: Add First Expense =====
  console.log('📝 Adding first expense...');

  // Fill out the add expense form
  await page.fill('#amount', '25.50');
  await page.fill('#description', 'Lunch at restaurant');
  await page.selectOption('#month', 'January');
  await page.fill('#category', 'Food');

  // Wait for form to be ready (not disabled and no loading states)
  await page.waitForFunction(() => {
    const submitButton = document.querySelector('button[type="submit"]');
    const fieldset = document.querySelector('fieldset');
    return submitButton && !submitButton.disabled && fieldset && !fieldset.disabled;
  }, { timeout: 10000 });

  // Submit the form
  await page.click('button[type="submit"]');

  // Wait for the expense to appear in the list (indicates successful submission)
  await page.waitForSelector(`text=${'Lunch at restaurant'}`, { timeout: 5000 });

  // Verify expense was added
  await expect(page.locator('text=Lunch at restaurant')).toBeVisible();
  await expect(page.locator('text=$25.50')).toBeVisible();
  await expect(page.locator('text=January')).toBeVisible();
  await expect(page.locator('text=Food')).toBeVisible();
  await expect(page.locator('text=Total Expenses: 1')).toBeVisible();

  // ===== STEP 2: Add Second Expense =====
  console.log('📝 Adding second expense...');

  // Wait for form to be ready again
  await page.waitForFunction(() => {
    const submitButton = document.querySelector('button[type="submit"]');
    const fieldset = document.querySelector('fieldset');
    return submitButton && !submitButton.disabled && fieldset && !fieldset.disabled;
  }, { timeout: 10000 });

  await page.fill('#amount', '45.00');
  await page.fill('#description', 'Gas station');
  await page.selectOption('#month', 'January');
  await page.fill('#category', 'Transportation');

  await page.click('button[type="submit"]');

  // Wait for the expense to appear in the list (indicates successful submission)
  await page.waitForSelector('text=Gas station', { timeout: 5000 });

  // Verify second expense was added
  await expect(page.locator('text=Gas station')).toBeVisible();
  await expect(page.locator('text=$45.00')).toBeVisible();
  await expect(page.locator('text=Total Expenses: 2')).toBeVisible();

  // ===== STEP 3: Add Third Expense =====
  console.log('📝 Adding third expense...');

  // Wait for form to be ready again
  await page.waitForFunction(() => {
    const submitButton = document.querySelector('button[type="submit"]');
    const fieldset = document.querySelector('fieldset');
    return submitButton && !submitButton.disabled && fieldset && !fieldset.disabled;
  }, { timeout: 10000 });

  await page.fill('#amount', '12.99');
  await page.fill('#description', 'Movie tickets');
  await page.selectOption('#month', 'February');
  await page.fill('#category', 'Entertainment');

  await page.click('button[type="submit"]');

  // Wait for the expense to appear in the list (indicates successful submission)
  await page.waitForSelector('text=Movie tickets', { timeout: 5000 });

  // Verify third expense was added
  await expect(page.locator('text=Movie tickets')).toBeVisible();
  await expect(page.locator('text=$12.99')).toBeVisible();
  await expect(page.locator('text=Total Expenses: 3')).toBeVisible();

  // Verify all expenses are visible
  const expenseCount = await page.locator('tbody tr').count();
  expect(expenseCount).toBe(3);

  // Verify total amount calculation
  await expect(page.locator('span.expense-total:has-text("Total: $83.49")')).toBeVisible();

  // ===== STEP 4: Filter by Month =====
  console.log('🔍 Testing month filtering...');

  // Filter by January
  await page.selectOption('select[id="month-filter"]', 'January');

  // Give filtering a moment to complete
  await page.waitForTimeout(500);

  // Verify only January expenses are shown (2 expenses)
  const januaryExpenses = await page.locator('tbody tr').count();
  expect(januaryExpenses).toBe(2);

  // Verify correct expenses are visible
  await expect(page.locator('text=Lunch at restaurant')).toBeVisible();
  await expect(page.locator('text=Gas station')).toBeVisible();
  await expect(page.locator('text=Movie tickets')).not.toBeVisible();

  // Verify filter status and total
  await expect(page.locator('text=Filtering by: January')).toBeVisible();
  await expect(page.locator('span.expense-total:has-text("Total: $70.50")')).toBeVisible();
  await expect(page.locator('text=Showing: 2')).toBeVisible();

  // ===== STEP 5: Filter by Category =====
  console.log('🔍 Testing category filtering...');

  // Clear month filter and filter by category
  await page.selectOption('select[id="month-filter"]', '');
  await page.fill('input[id="category-filter"]', 'Food');

  // Give filtering a moment to complete
  await page.waitForTimeout(500);

  // Verify only Food expenses are shown (1 expense)
  const foodExpenses = await page.locator('tbody tr').count();
  expect(foodExpenses).toBe(1);

  // Verify correct expense is visible
  await expect(page.locator('text=Lunch at restaurant')).toBeVisible();
  await expect(page.locator('text=Gas station')).not.toBeVisible();
  await expect(page.locator('text=Movie tickets')).not.toBeVisible();

  // Verify filter status and total
  await expect(page.locator('text=Filtering by: Food')).toBeVisible();
  await expect(page.locator('span.expense-total:has-text("Total: $25.50")')).toBeVisible();
  await expect(page.locator('text=Showing: 1')).toBeVisible();

  // ===== STEP 6: Combined Month + Category Filtering =====
  console.log('🔍 Testing combined filtering...');

  // Apply both month and category filters
  await page.selectOption('select[id="month-filter"]', 'January');
  await page.fill('input[id="category-filter"]', 'Transportation');

  // Give filtering a moment to complete
  await page.waitForTimeout(500);

  // Verify combined filtering works (1 expense: January Transportation)
  const combinedExpenses = await page.locator('tbody tr').count();
  expect(combinedExpenses).toBe(1);

  // Verify correct expense is visible
  await expect(page.locator('text=Gas station')).toBeVisible();
  await expect(page.locator('text=Lunch at restaurant')).not.toBeVisible();
  await expect(page.locator('text=Movie tickets')).not.toBeVisible();

  // Verify filter status and total
  await expect(page.locator('text=Filtering by: January, Transportation')).toBeVisible();
  await expect(page.locator('span.expense-total:has-text("Total: $45.00")')).toBeVisible();
  await expect(page.locator('text=Showing: 1')).toBeVisible();

  // ===== STEP 7: Clear Filters =====
  console.log('🧹 Testing filter clearing...');

  // Clear all filters
  await page.click('button:has-text("Clear All Filters")');

  // Give clearing a moment to complete
  await page.waitForTimeout(500);

  // Verify all expenses are visible again
  const allExpenses = await page.locator('tbody tr').count();
  expect(allExpenses).toBe(3);

  // Verify all expenses are present
  await expect(page.locator('text=Lunch at restaurant')).toBeVisible();
  await expect(page.locator('text=Gas station')).toBeVisible();
  await expect(page.locator('text=Movie tickets')).toBeVisible();

  // Verify filter status is cleared
  await expect(page.locator('text=Filtering by:')).not.toBeVisible();
  await expect(page.locator('text=Total Expenses: 3')).toBeVisible();
  await expect(page.locator('span.expense-total:has-text("Total: $83.49")')).toBeVisible();

  // ===== STEP 8: Test Empty Filter Results =====
  console.log('🔍 Testing empty filter results...');

  // Filter by a month with no expenses
  await page.selectOption('select[id="month-filter"]', 'December');

  // Give filtering a moment to complete
  await page.waitForTimeout(500);

  // Verify empty state
  await expect(page.locator('text=No expenses match your current filters.')).toBeVisible();
  await expect(page.locator('text=Try adjusting your filters or clearing them to see all expenses.')).toBeVisible();
  await expect(page.locator('span.expense-total:has-text("Total: $0.00")')).toBeVisible();

  // Clear filter to restore normal state
  await page.click('button:has-text("Clear All Filters")');
  await page.waitForTimeout(500);

  // Final verification - all expenses visible
  const finalExpenseCount = await page.locator('tbody tr').count();
  expect(finalExpenseCount).toBe(3);

  console.log('✅ E2E Smoke Test PASSED');
  console.log('✅ Complete workflow verified:');
  console.log('   - Added 3 expenses successfully');
  console.log('   - Month filtering works correctly');
  console.log('   - Category filtering works correctly');
  console.log('   - Combined filtering works correctly');
  console.log('   - Filter clearing works correctly');
  console.log('   - Empty filter state handled properly');
  console.log('   - All totals and counts are accurate');
});
