/**
 * Playwright E2E Smoke Test: Temp Converter UI
 * 
 * This test verifies the complete temperature converter functionality:
 * 1. Convert 0°C to F (expect 32)
 * 2. Convert 32°F to C (expect 0)
 * 3. Test non-numeric error
 * 4. Test identical unit error
 * 
 * Test Coverage:
 * - User Story 5: Convert Celsius to Fahrenheit
 * - User Story 6: Convert Fahrenheit to Celsius
 * - User Story 7: Handle invalid input with error messages
 * - User Story 8: Prevent identical unit conversion with error messages
 */

import { test, expect } from '@playwright/test';

test.describe('Temp Converter UI - E2E Smoke Test', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application
    await page.goto('/');
    
    // Wait for the application to load
    await page.waitForSelector('h1:has-text("Temperature Converter")', { timeout: 10000 });
    await page.waitForSelector('[data-testid="temperature-input"]', { timeout: 10000 });
  });

  test('should convert 0°C to Fahrenheit (expect 32°F)', async ({ page }) => {
    const input = page.locator('[data-testid="temperature-input"]');
    const sourceSelector = page.locator('[data-testid="source-unit-selector"]');
    const targetSelector = page.locator('[data-testid="target-unit-selector"]');
    const convertButton = page.locator('button:has-text("Convert")');
    const result = page.locator('[data-testid="conversion-result"]');
    
    // ===== STEP 1: Enter temperature value =====
    console.log('🌡️ Entering 0 as temperature value...');
    await input.fill('0');
    
    // ===== STEP 2: Select source unit as Celsius =====
    console.log('📋 Selecting Celsius as source unit...');
    await sourceSelector.selectOption('C');
    
    // ===== STEP 3: Select target unit as Fahrenheit =====
    console.log('📋 Selecting Fahrenheit as target unit...');
    await targetSelector.selectOption('F');
    
    // ===== STEP 4: Click Convert button =====
    console.log('🔄 Clicking Convert button...');
    await convertButton.click();
    
    // ===== STEP 5: Verify conversion result =====
    await page.waitForTimeout(500); // Wait for conversion to complete
    
    // Wait for result to appear
    await page.waitForSelector('[data-testid="conversion-result"]', { timeout: 5000 });
    
    // Verify result shows 32.00°F (0°C = 32°F)
    const resultText = await result.textContent();
    expect(resultText).toContain('32.00');
    expect(resultText).toContain('°F');
    console.log(`✅ Conversion result: ${resultText}`);
    
    // Verify exact format: should be "32.00°F" or similar
    expect(resultText).toMatch(/32\.00.*°F/i);
  });

  test('should convert 32°F to Celsius (expect 0°C)', async ({ page }) => {
    const input = page.locator('[data-testid="temperature-input"]');
    const sourceSelector = page.locator('[data-testid="source-unit-selector"]');
    const targetSelector = page.locator('[data-testid="target-unit-selector"]');
    const convertButton = page.locator('button:has-text("Convert")');
    const result = page.locator('[data-testid="conversion-result"]');
    
    // ===== STEP 1: Enter temperature value =====
    console.log('🌡️ Entering 32 as temperature value...');
    await input.fill('32');
    
    // ===== STEP 2: Select source unit as Fahrenheit =====
    console.log('📋 Selecting Fahrenheit as source unit...');
    await sourceSelector.selectOption('F');
    
    // ===== STEP 3: Select target unit as Celsius =====
    console.log('📋 Selecting Celsius as target unit...');
    await targetSelector.selectOption('C');
    
    // ===== STEP 4: Click Convert button =====
    console.log('🔄 Clicking Convert button...');
    await convertButton.click();
    
    // ===== STEP 5: Verify conversion result =====
    await page.waitForTimeout(500); // Wait for conversion to complete
    
    // Wait for result to appear
    await page.waitForSelector('[data-testid="conversion-result"]', { timeout: 5000 });
    
    // Verify result shows 0.00°C (32°F = 0°C)
    const resultText = await result.textContent();
    expect(resultText).toContain('0.00');
    expect(resultText).toContain('°C');
    console.log(`✅ Conversion result: ${resultText}`);
    
    // Verify exact format: should be "0.00°C" or similar
    expect(resultText).toMatch(/0\.00.*°C/i);
  });

  test('should show error for non-numeric input', async ({ page }) => {
    const input = page.locator('[data-testid="temperature-input"]');
    const convertButton = page.locator('button:has-text("Convert")');
    
    // ===== STEP 1: Enter non-numeric value =====
    console.log('⚠️ Entering non-numeric value "abc"...');
    await input.fill('');
    await input.evaluate((element, value) => {
      const inputElement = element as HTMLInputElement;
      inputElement.value = value;
      inputElement.dispatchEvent(new Event('input', { bubbles: true }));
      inputElement.dispatchEvent(new Event('change', { bubbles: true }));
    }, 'abc');
    
    // ===== STEP 2: Click Convert button =====
    console.log('🔄 Clicking Convert button...');
    await convertButton.click();
    
    // ===== STEP 3: Wait for error banner to appear =====
    await page.waitForSelector('role=alert', { timeout: 5000 });
    
    // ===== STEP 4: Verify error message is displayed =====
    const errorBanner = page.locator('role=alert');
    await expect(errorBanner).toBeVisible();
    
    // Verify error message content (should mention numeric or valid)
    const errorText = await errorBanner.textContent();
    expect(errorText?.toLowerCase()).toMatch(/numeric|valid|invalid/i);
    console.log(`⚠️ Error message: ${errorText}`);
    
    // ===== STEP 5: Verify no conversion result is shown =====
    // Result should not appear when there's an error
    const result = page.locator('[data-testid="conversion-result"]');
    const resultCount = await result.count();
    // Result might not exist or might show empty state
    if (resultCount > 0) {
      const resultText = await result.textContent();
      // If result exists, it should be empty or show placeholder
      expect(resultText).not.toMatch(/\d+\.\d+.*°[CF]/);
    }
    
    // ===== STEP 6: Enter valid numeric value to clear error =====
    console.log('✅ Entering valid numeric value to clear error...');
    await input.fill('25');
    
    // Trigger conversion by clicking Convert
    await convertButton.click();
    
    // Wait for error to clear
    await page.waitForTimeout(500);
    await expect(errorBanner).not.toBeVisible();
    
    console.log('✅ Error handling test passed!');
  });

  test('should show error when source and target units are identical', async ({ page }) => {
    const input = page.locator('[data-testid="temperature-input"]');
    const sourceSelector = page.locator('[data-testid="source-unit-selector"]');
    const targetSelector = page.locator('[data-testid="target-unit-selector"]');
    const convertButton = page.locator('button:has-text("Convert")');
    
    // ===== STEP 1: Enter a temperature value =====
    console.log('🌡️ Entering 25 as temperature value...');
    await input.fill('25');
    
    // ===== STEP 2: Set source unit to Celsius =====
    console.log('📋 Setting source unit to Celsius...');
    await sourceSelector.selectOption('C');
    
    // ===== STEP 3: Set target unit to Celsius (same as source) =====
    console.log('⚠️ Setting target unit to Celsius (same as source)...');
    await targetSelector.selectOption('C');
    
    // Wait a moment for the error to appear
    await page.waitForTimeout(500);
    
    // ===== STEP 4: Wait for error banner to appear =====
    await page.waitForSelector('role=alert', { timeout: 5000 });
    
    // ===== STEP 5: Verify error message is displayed =====
    const errorBanner = page.locator('role=alert');
    await expect(errorBanner).toBeVisible();
    
    // Verify error message content (should mention same, identical, or cannot)
    const errorText = await errorBanner.textContent();
    expect(errorText?.toLowerCase()).toMatch(/same|identical|cannot|different/i);
    console.log(`⚠️ Error message: ${errorText}`);
    
    // ===== STEP 6: Verify no conversion result is shown =====
    // Result should not appear when units are identical
    const result = page.locator('[data-testid="conversion-result"]');
    const resultCount = await result.count();
    if (resultCount > 0) {
      const resultText = await result.textContent();
      // If result exists, it should not show a valid conversion
      expect(resultText).not.toMatch(/\d+\.\d+.*°[CF]/);
    }
    
    // ===== STEP 7: Change target unit to Fahrenheit to clear error =====
    console.log('✅ Changing target unit to Fahrenheit to clear error...');
    await targetSelector.selectOption('F');
    
    // Wait for error to clear
    await page.waitForTimeout(500);
    await expect(errorBanner).not.toBeVisible();
    
    // ===== STEP 8: Verify conversion now works =====
    await convertButton.click();
    await page.waitForTimeout(500);
    
    // Result should now appear
    await page.waitForSelector('[data-testid="conversion-result"]', { timeout: 5000 });
    const resultText = await result.textContent();
    expect(resultText).toMatch(/\d+\.\d+.*°F/i);
    console.log(`✅ Conversion result after fixing units: ${resultText}`);
    
    console.log('✅ Identical unit error handling test passed!');
  });
});

