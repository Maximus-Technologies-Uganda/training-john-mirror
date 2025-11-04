import { test, expect } from '@playwright/test';

test('User Story 4: Filter Expenses by Category - debug check', async ({ page }) => {
    // Navigate to the application
    await page.goto('/');

    // Check basic elements are present (use first h1)
    await expect(page.locator('h1').first()).toBeVisible();
    await expect(page.locator('#description')).toBeVisible();
    await expect(page.locator('#amount')).toBeVisible();
    await expect(page.locator('#month')).toBeVisible();
    await expect(page.locator('#category')).toBeVisible();

    // Check filtering elements
    await expect(page.locator('#category-filter')).toBeVisible();
    await expect(page.locator('h2:has-text("Your Expenses")')).toBeVisible();

    console.log('✅ Page loaded successfully with all elements present');
  });

  test('should verify category filtering works correctly with existing expenses', async ({ page }) => {
    // Pre-populate with test expenses via localStorage BEFORE navigating
    const testExpenses = [
      {
        id: 'exp-test-001',
        amount: 550, // $5.50
        description: 'Coffee Shop',
        month: 'January',
        category: 'Food'
      },
      {
        id: 'exp-test-002',
        amount: 1275, // $12.75
        description: 'Restaurant Dinner',
        month: 'February',
        category: 'Food'
      },
      {
        id: 'exp-test-003',
        amount: 1500, // $15.00
        description: 'Movie Theater',
        month: 'March',
        category: 'Entertainment'
      },
      {
        id: 'exp-test-004',
        amount: 4520, // $45.20
        description: 'Gas Station',
        month: 'April',
        category: 'Transportation'
      },
      {
        id: 'exp-test-005',
        amount: 2599, // $25.99
        description: 'Concert Tickets',
        month: 'January',
        category: 'Entertainment'
      },
      {
        id: 'exp-test-006',
        amount: 5000, // $50.00
        description: 'Bus Pass',
        month: 'February',
        category: 'Transportation'
      },
      {
        id: 'exp-test-007',
        amount: 3200, // $32.00
        description: 'Electricity Bill',
        month: 'March',
        category: 'Utilities'
      }
    ];

    // Set expenses in localStorage using the core module key BEFORE navigation
    await page.addInitScript((expenses) => {
      localStorage.setItem('expense-tracker:expenses', JSON.stringify(expenses));
    }, testExpenses);

    // Navigate to the application (expenses should be loaded from localStorage)
    await page.goto('/');

    // Verify all expenses are displayed initially (All Categories)
    await expect(page.locator('h2:has-text("Your Expenses")')).toBeVisible();

    // Count total expenses - should be 7
    const totalExpenseElements = await page.locator('tbody tr').count();
    expect(totalExpenseElements).toBe(7);

    // Verify expenses from different categories are present
    await expect(page.locator('text=Coffee Shop')).toBeVisible();
    await expect(page.locator('text=Restaurant Dinner')).toBeVisible();
    await expect(page.locator('text=Movie Theater')).toBeVisible();
    await expect(page.locator('text=Gas Station')).toBeVisible();

    // Test category filtering - Filter by Food
    await page.fill('#category-filter', 'Food');

    // Should show only Food expenses (2 expenses)
    await page.waitForTimeout(100);
    const foodExpenses = await page.locator('tbody tr').count();
    expect(foodExpenses).toBe(2);

    // Verify only Food expenses are visible
    await expect(page.locator('text=Coffee Shop')).toBeVisible();
    await expect(page.locator('text=Restaurant Dinner')).toBeVisible();

    // Verify non-Food expenses are not visible
    await expect(page.locator('text=Movie Theater')).not.toBeVisible();
    await expect(page.locator('text=Gas Station')).not.toBeVisible();
    await expect(page.locator('text=Electricity Bill')).not.toBeVisible();

    // Verify filter status is displayed
    await expect(page.locator('text=Filtering by: Food')).toBeVisible();

    // Verify total shows filtered amount
    await expect(page.locator('text=Total: $18.25')).toBeVisible(); // $5.50 + $12.75

    // Test filtering by Entertainment
    await page.fill('#category-filter', 'Entertainment');

    // Should show only Entertainment expenses (2 expenses)
    await page.waitForTimeout(100);
    const entertainmentExpenses = await page.locator('tbody tr').count();
    expect(entertainmentExpenses).toBe(2);

    // Verify only Entertainment expenses are visible
    await expect(page.locator('text=Movie Theater')).toBeVisible();
    await expect(page.locator('text=Concert Tickets')).toBeVisible();

    // Verify filter status updated
    await expect(page.locator('text=Filtering by: Entertainment')).toBeVisible();

    // Verify total shows Entertainment amount
    await expect(page.locator('text=Total: $40.99')).toBeVisible(); // $15.00 + $25.99

    // Test custom category input
    await page.fill('#category-filter', 'CustomCategory');

    // Should show empty state (no expenses match custom category)
    await expect(page.locator('text=No expenses found')).toBeVisible();
    await expect(page.locator('text=Total: $0.00')).toBeVisible();

    // Test "All Categories" by clearing the input
    await page.fill('#category-filter', '');

    // Should show all expenses again (7 expenses)
    await page.waitForTimeout(100);
    const allExpenses = await page.locator('tbody tr').count();
    expect(allExpenses).toBe(7);

    // Verify all expenses are visible again
    await expect(page.locator('text=Coffee Shop')).toBeVisible();
    await expect(page.locator('text=Restaurant Dinner')).toBeVisible();
    await expect(page.locator('text=Movie Theater')).toBeVisible();
    await expect(page.locator('text=Gas Station')).toBeVisible();

    // Verify filter status is gone
    await expect(page.locator('text=Filtering by:')).not.toBeVisible();

    // Verify total shows all expenses
    await expect(page.locator('text=Total: $181.44')).toBeVisible(); // Sum of all expenses

    // Test clear filter button functionality
    await page.fill('#category-filter', 'Transportation');
    await page.waitForTimeout(100);
    await expect(page.locator('text=Filtering by: Transportation')).toBeVisible();

    // Click clear filter button
    await page.click('button[aria-label*="Clear category filter"]');
    await page.waitForTimeout(100);

    // Should show all expenses again
    const allExpensesAfterClear = await page.locator('tbody tr').count();
    expect(allExpensesAfterClear).toBe(7);
    await expect(page.locator('text=Filtering by:')).not.toBeVisible();

    // Test category with no expenses (edge case)
    await page.fill('#category-filter', 'Healthcare');

    // Should show empty state
    await expect(page.locator('text=No expenses found')).toBeVisible();
    await expect(page.locator('text=Total: $0.00')).toBeVisible();

    // Reset to show all expenses
    await page.fill('#category-filter', '');

    // Final verification - all expenses should be visible
    const finalExpenseCount = await page.locator('tbody tr').count();
    expect(finalExpenseCount).toBe(7);

  console.log('✅ User Story 4 Independent Test PASSED');
  console.log('✅ Added expenses across multiple categories');
  console.log('✅ Category filtering works correctly');
  console.log('✅ "All Categories" option works correctly');
  console.log('✅ Custom category input works');
  console.log('✅ Filter status and totals update properly');
  console.log('✅ Clear filter functionality works');
  console.log('✅ Empty state handling works');
});
