import { test, expect } from '@playwright/test';

test('User Story 3: Filter Expenses by Month - debug check', async ({ page }) => {
  // Navigate to the application
  await page.goto('/');

  // Check basic elements are present (use first h1)
  await expect(page.locator('h1').first()).toBeVisible();
  await expect(page.locator('#description')).toBeVisible();
  await expect(page.locator('#amount')).toBeVisible();
  await expect(page.locator('#month')).toBeVisible();
  await expect(page.locator('#category')).toBeVisible();

  // Check filtering elements
  await expect(page.locator('#month-filter')).toBeVisible();
  await expect(page.locator('h2:has-text("Your Expenses")')).toBeVisible();

  console.log('✅ Page loaded successfully with all elements present');
});

test('User Story 3: Filter Expenses by Month - Independent Test', async ({ page }) => {
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
      }
    ];

    // Set expenses in localStorage using the core module key BEFORE navigation
    await page.addInitScript((expenses) => {
      localStorage.setItem('expense-tracker:expenses', JSON.stringify(expenses));
    }, testExpenses);

    // Navigate to the application (expenses should be loaded from localStorage)
    await page.goto('/');

    // Verify all expenses are displayed initially (All Months)
    await expect(page.locator('h2:has-text("Your Expenses")')).toBeVisible();

    // Count total expenses - should be 6
    const totalExpenseElements = await page.locator('tbody tr').count();
    expect(totalExpenseElements).toBe(6);

    // Verify expenses from different months are present
    await expect(page.locator('text=January Coffee')).toBeVisible();
    await expect(page.locator('text=February Lunch')).toBeVisible();
    await expect(page.locator('text=March Movie')).toBeVisible();
    await expect(page.locator('text=April Gas')).toBeVisible();

    // Test month filtering - Filter by January
    await page.selectOption('select[id="month-filter"]', 'January');

    // Should show only January expenses (2 expenses)
    await page.waitForTimeout(100);
    const januaryExpenses = await page.locator('tbody tr').count();
    expect(januaryExpenses).toBe(2);

    // Verify only January expenses are visible
    await expect(page.locator('text=January Coffee')).toBeVisible();
    await expect(page.locator('text=January Book')).toBeVisible();

    // Verify non-January expenses are not visible
    await expect(page.locator('text=February Lunch')).not.toBeVisible();
    await expect(page.locator('text=March Movie')).not.toBeVisible();
    await expect(page.locator('text=April Gas')).not.toBeVisible();

    // Verify filter status is displayed
    await expect(page.locator('text=Filtering by: January')).toBeVisible();

    // Verify total shows filtered amount
    await expect(page.locator('text=Total: $31.49')).toBeVisible(); // $5.50 + $25.99

    // Test filtering by February
    await page.selectOption('select[id="month-filter"]', 'February');

    // Should show only February expenses (2 expenses)
    await page.waitForTimeout(100);
    const februaryExpenses = await page.locator('tbody tr').count();
    expect(februaryExpenses).toBe(2);

    // Verify only February expenses are visible
    await expect(page.locator('text=February Lunch')).toBeVisible();
    await expect(page.locator('text=February Bus Pass')).toBeVisible();

    // Verify filter status updated
    await expect(page.locator('text=Filtering by: February')).toBeVisible();

    // Verify total shows February amount
    await expect(page.locator('text=Total: $62.75')).toBeVisible(); // $12.75 + $50.00

    // Test "All Months" option (reset filter)
    await page.selectOption('select[id="month-filter"]', '');

    // Should show all expenses again (6 expenses)
    await page.waitForTimeout(100);
    const allExpenses = await page.locator('tbody tr').count();
    expect(allExpenses).toBe(6);

    // Verify all expenses are visible again
    await expect(page.locator('text=January Coffee')).toBeVisible();
    await expect(page.locator('text=February Lunch')).toBeVisible();
    await expect(page.locator('text=March Movie')).toBeVisible();
    await expect(page.locator('text=April Gas')).toBeVisible();

    // Verify filter status is gone
    await expect(page.locator('text=Filtering by:')).not.toBeVisible();

    // Verify total shows all expenses
    await expect(page.locator('text=Total: $154.44')).toBeVisible(); // Sum of all expenses

    // Test clear filter button functionality
    await page.selectOption('select[id="month-filter"]', 'March');
    await page.waitForTimeout(100);
    await expect(page.locator('text=Filtering by: March')).toBeVisible();

    // Click clear filter button
    await page.click('button[aria-label*="Clear month filter"]');
    await page.waitForTimeout(100);

    // Should show all expenses again
    const allExpensesAfterClear = await page.locator('tbody tr').count();
    expect(allExpensesAfterClear).toBe(6);
    await expect(page.locator('text=Filtering by:')).not.toBeVisible();

    // Test month with no expenses (edge case)
    await page.selectOption('select[id="month-filter"]', 'December');

    // Should show empty state
    await expect(page.locator('text=No expenses found')).toBeVisible();
    await expect(page.locator('text=Total: $0.00')).toBeVisible();

    // Reset to show all expenses
    await page.selectOption('select[id="month-filter"]', '');

    // Final verification - all expenses should be visible
    const finalExpenseCount = await page.locator('tbody tr').count();
    expect(finalExpenseCount).toBe(6);

  console.log('✅ User Story 3 Independent Test PASSED');
  console.log('✅ Added expenses across multiple months');
  console.log('✅ Month filtering works correctly');
  console.log('✅ "All Months" option works correctly');
  console.log('✅ Filter status and totals update properly');
  console.log('✅ Clear filter functionality works');
  console.log('✅ Empty state handling works');
});
