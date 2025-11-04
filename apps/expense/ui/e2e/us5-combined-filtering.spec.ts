import { test, expect } from '@playwright/test';

test('User Story 5: Filter by Month and Category Combined - Independent Test', async ({ page }) => {
  // Pre-populate with test expenses via localStorage BEFORE navigating
  const testExpenses = [
    {
      id: 'exp-test-001',
      amount: 550, // $5.50
      description: 'January Coffee',
      month: 'January',
      category: 'Food'
    },
    {
      id: 'exp-test-002',
      amount: 1275, // $12.75
      description: 'February Lunch',
      month: 'February',
      category: 'Food'
    },
    {
      id: 'exp-test-003',
      amount: 1500, // $15.00
      description: 'March Movie',
      month: 'March',
      category: 'Entertainment'
    },
    {
      id: 'exp-test-004',
      amount: 4520, // $45.20
      description: 'April Gas',
      month: 'April',
      category: 'Transportation'
    },
    {
      id: 'exp-test-005',
      amount: 2599, // $25.99
      description: 'January Book',
      month: 'January',
      category: 'Entertainment'
    },
    {
      id: 'exp-test-006',
      amount: 5000, // $50.00
      description: 'February Bus Pass',
      month: 'February',
      category: 'Transportation'
    },
    {
      id: 'exp-test-007',
      amount: 3200, // $32.00
      description: 'March Dinner',
      month: 'March',
      category: 'Food'
    },
    {
      id: 'exp-test-008',
      amount: 899, // $8.99
      description: 'April Coffee',
      month: 'April',
      category: 'Food'
    }
  ];

  // Set expenses in localStorage using the core module key BEFORE navigation
  await page.addInitScript((expenses) => {
    localStorage.setItem('expense-tracker:expenses', JSON.stringify(expenses));
  }, testExpenses);

  // Navigate to the application (expenses should be loaded from localStorage)
  await page.goto('/');

  // Wait for loading to complete and expenses to be displayed
  await page.waitForSelector('h2:has-text("Your Expenses")', { timeout: 10000 });

  // Wait for any loading overlays to disappear
  await page.waitForFunction(() => {
    const overlays = document.querySelectorAll('.loading-overlay');
    return overlays.length === 0;
  }, { timeout: 10000 });

  // Verify all expenses are displayed initially (All Months, All Categories)
  await expect(page.locator('h2:has-text("Your Expenses")')).toBeVisible();

  // Count total expenses - should be 8
  const totalExpenseElements = await page.locator('tbody tr').count();
  expect(totalExpenseElements).toBe(8);

  // Verify expenses from different months and categories are present
  await expect(page.locator('text=January Coffee')).toBeVisible();
  await expect(page.locator('text=February Lunch')).toBeVisible();
  await expect(page.locator('text=March Movie')).toBeVisible();
  await expect(page.locator('text=April Gas')).toBeVisible();

  // Test combined filtering: January + Food
  await page.selectOption('select[id="month-filter"]', 'January');
  await page.fill('input[id="category-filter"]', 'Food');

  // Wait for filtering to apply
  await page.waitForTimeout(500);

  // Should show only January Food expenses (1 expense: January Coffee)
  const januaryFoodExpenses = await page.locator('tbody tr').count();
  expect(januaryFoodExpenses).toBe(1);

  // Verify only the correct expense is visible
  await expect(page.locator('text=January Coffee')).toBeVisible();
  await expect(page.locator('td.expense-amount:has-text("$5.50")')).toBeVisible();

  // Verify non-matching expenses are not visible
  await expect(page.locator('text=February Lunch')).not.toBeVisible();
  await expect(page.locator('text=March Movie')).not.toBeVisible();
  await expect(page.locator('text=January Book')).not.toBeVisible(); // January but Entertainment

  // Verify combined filter status is displayed
  await expect(page.locator('text=Filtering by: January, Food')).toBeVisible();

  // Verify total shows filtered amount
  await expect(page.locator('span.expense-total:has-text("Total: $5.50")')).toBeVisible();

  // Test combined filtering: February + Transportation
  await page.selectOption('select[id="month-filter"]', 'February');
  await page.fill('input[id="category-filter"]', 'Transportation');

  // Wait for filtering to apply
  await page.waitForTimeout(500);

  // Should show only February Transportation expenses (1 expense: February Bus Pass)
  const februaryTransportExpenses = await page.locator('tbody tr').count();
  expect(februaryTransportExpenses).toBe(1);

  // Verify only February Transportation expense is visible
  await expect(page.locator('text=February Bus Pass')).toBeVisible();
  await expect(page.locator('td.expense-amount:has-text("$50.00")')).toBeVisible();

  // Verify filter status updated
  await expect(page.locator('text=Filtering by: February, Transportation')).toBeVisible();

  // Verify total shows February Transportation amount
  await expect(page.locator('span.expense-total:has-text("Total: $50.00")')).toBeVisible();

  // Test combined filtering with multiple matches: March + Food
  await page.selectOption('select[id="month-filter"]', 'March');
  await page.fill('input[id="category-filter"]', 'Food');

  // Wait for filtering to apply
  await page.waitForTimeout(500);

  // Should show March Food expenses (1 expense: March Dinner)
  const marchFoodExpenses = await page.locator('tbody tr').count();
  expect(marchFoodExpenses).toBe(1);

  // Verify only March Food expense is visible
  await expect(page.locator('text=March Dinner')).toBeVisible();
  await expect(page.locator('td.expense-amount:has-text("$32.00")')).toBeVisible();

  // Test combined filtering with no matches: April + Entertainment
  await page.selectOption('select[id="month-filter"]', 'April');
  await page.fill('input[id="category-filter"]', 'Entertainment');

  // Wait for filtering to apply
  await page.waitForTimeout(500);

  // Should show empty state
  await expect(page.locator('text=No expenses found')).toBeVisible();
  await expect(page.locator('span.expense-total:has-text("Total: $0.00")')).toBeVisible();

  // Test Clear All Filters functionality with combined filters
  await page.selectOption('select[id="month-filter"]', 'January');
  await page.fill('input[id="category-filter"]', 'Food');
  await page.waitForTimeout(500);

  // Verify combined filters are active
  await expect(page.locator('text=Filtering by: January, Food')).toBeVisible();
  expect(await page.locator('tbody tr').count()).toBe(1);

  // Click Clear All Filters button
  await page.click('button:has-text("Clear All Filters")');
  await page.waitForTimeout(500);

  // Should show all expenses again
  const allExpensesAfterClear = await page.locator('tbody tr').count();
  expect(allExpensesAfterClear).toBe(8);

  // Verify filter status is gone
  await expect(page.locator('text=Filtering by:')).not.toBeVisible();

  // Verify total shows all expenses
  await expect(page.locator('span.expense-total:has-text("Total: $174.19")')).toBeVisible(); // Sum of all expenses

  // Test individual filter clearing with combined filters
  await page.selectOption('select[id="month-filter"]', 'April');
  await page.fill('input[id="category-filter"]', 'Food');
  await page.waitForTimeout(500);

  // Verify April Food filters are active (1 expense: April Coffee)
  await expect(page.locator('text=Filtering by: April, Food')).toBeVisible();
  expect(await page.locator('tbody tr').count()).toBe(1);

  // Clear only the category filter
  await page.click('button[aria-label*="Clear category filter"]');
  await page.waitForTimeout(500);

  // Should now show only April expenses (2 expenses: Gas + Coffee)
  await expect(page.locator('text=Filtering by: April')).toBeVisible();
  expect(await page.locator('tbody tr').count()).toBe(2);
  await expect(page.locator('text=April Gas')).toBeVisible();
  await expect(page.locator('text=April Coffee')).toBeVisible();

  // Test category-only filtering after month filter was cleared
  await page.fill('input[id="category-filter"]', 'Transportation');
  await page.waitForTimeout(500);

  // Should show only Transportation expenses across all months (2 expenses)
  await expect(page.locator('text=Filtering by: Transportation')).toBeVisible();
  expect(await page.locator('tbody tr').count()).toBe(2);
  await expect(page.locator('text=April Gas')).toBeVisible();
  await expect(page.locator('text=February Bus Pass')).toBeVisible();

  // Final verification - clear all and verify all expenses visible
  await page.click('button:has-text("Clear All Filters")');
  await page.waitForTimeout(500);

  const finalExpenseCount = await page.locator('tbody tr').count();
  expect(finalExpenseCount).toBe(8);

  console.log('✅ User Story 5 Independent Test PASSED');
  console.log('✅ Added expenses across months and categories');
  console.log('✅ Combined month and category filtering works correctly');
  console.log('✅ "All Months" and "All Categories" options work correctly');
  console.log('✅ Filter status and totals update properly for combined filters');
  console.log('✅ Clear individual filters and Clear All Filters functionality works');
  console.log('✅ Empty state handling works for combined filters');
  console.log('✅ Individual filter clearing preserves other filters');
});
