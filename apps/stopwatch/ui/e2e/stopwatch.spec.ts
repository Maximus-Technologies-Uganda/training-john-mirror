/**
 * Playwright E2E Smoke Test: Stopwatch UI
 * 
 * This test verifies the complete stopwatch functionality:
 * 1. Start stopwatch, record 3 laps, stop, reset
 * 2. Test error state (lap before start)
 * 3. Verify MM:SS:MS display format
 * 
 * Test Coverage:
 * - User Story 1: Start and track time
 * - User Story 2: Record and view laps
 * - User Story 3: Stop and reset
 * - User Story 4: Handle invalid state transitions with error messages
 */

import { test, expect } from '@playwright/test';

test.describe('Stopwatch UI - E2E Smoke Test', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application
    await page.goto('/');
    
    // Wait for the application to load
    await page.waitForSelector('h1:has-text("Stopwatch")', { timeout: 10000 });
    await page.waitForSelector('[data-testid="stopwatch-display"]', { timeout: 10000 });
  });

  test('should start stopwatch, record 3 laps, stop, and reset', async ({ page }) => {
    // Verify initial state - display shows 00:00:00
    const display = page.locator('[data-testid="stopwatch-display"]');
    await expect(display).toHaveText(/00:00:00/);
    
    // Verify initial empty state
    await expect(page.locator('text=No laps recorded yet')).toBeVisible();
    
    // ===== STEP 1: Start the stopwatch =====
    console.log('▶️ Starting stopwatch...');
    await page.click('[data-testid="button-start"]');
    
    // Verify start button is disabled
    await expect(page.locator('[data-testid="button-start"]')).toBeDisabled();
    
    // Verify stop button is enabled
    await expect(page.locator('[data-testid="button-stop"]')).toBeEnabled();
    
    // Wait a moment for time to advance
    await page.waitForTimeout(500);
    
    // Verify display has updated (not 00:00:00)
    const timeAfterStart = await display.textContent();
    expect(timeAfterStart).not.toBe('00:00:00');
    console.log(`⏱️ Time after start: ${timeAfterStart}`);
    
    // ===== STEP 2: Record first lap =====
    console.log('📝 Recording first lap...');
    await page.waitForTimeout(200);
    await page.click('[data-testid="button-lap"]');
    
    // Wait for lap to appear
    await page.waitForSelector('[data-testid="lap-item-1"]', { timeout: 5000 });
    await expect(page.locator('text=Laps (1)')).toBeVisible();
    
    // ===== STEP 3: Record second lap =====
    console.log('📝 Recording second lap...');
    await page.waitForTimeout(200);
    await page.click('[data-testid="button-lap"]');
    
    // Wait for second lap to appear
    await page.waitForSelector('[data-testid="lap-item-2"]', { timeout: 5000 });
    await expect(page.locator('text=Laps (2)')).toBeVisible();
    
    // ===== STEP 4: Record third lap =====
    console.log('📝 Recording third lap...');
    await page.waitForTimeout(200);
    await page.click('[data-testid="button-lap"]');
    
    // Wait for third lap to appear
    await page.waitForSelector('[data-testid="lap-item-3"]', { timeout: 5000 });
    await expect(page.locator('text=Laps (3)')).toBeVisible();
    
    // Verify all 3 laps are displayed
    await expect(page.locator('[data-testid="lap-item-1"]')).toBeVisible();
    await expect(page.locator('[data-testid="lap-item-2"]')).toBeVisible();
    await expect(page.locator('[data-testid="lap-item-3"]')).toBeVisible();
    
    // ===== STEP 5: Stop the stopwatch =====
    console.log('⏸️ Stopping stopwatch...');
    const timeBeforeStop = await display.textContent();
    await page.click('[data-testid="button-stop"]');
    
    // Verify stop button is disabled
    await expect(page.locator('[data-testid="button-stop"]')).toBeDisabled();
    
    // Verify start button is enabled
    await expect(page.locator('[data-testid="button-start"]')).toBeEnabled();
    
    // Wait a moment and verify time is frozen
    await page.waitForTimeout(500);
    const timeAfterStop = await display.textContent();
    expect(timeAfterStop).toBe(timeBeforeStop);
    console.log(`⏱️ Time frozen at: ${timeAfterStop}`);
    
    // ===== STEP 6: Reset the stopwatch =====
    console.log('🔄 Resetting stopwatch...');
    await page.click('[data-testid="button-reset"]');
    
    // Verify display is reset to 00:00:00
    await expect(display).toHaveText(/00:00:00/);
    
    // Verify laps are cleared
    await expect(page.locator('text=No laps recorded yet')).toBeVisible();
    await expect(page.locator('text=Laps')).not.toBeVisible();
    
    // Verify start button is enabled
    await expect(page.locator('[data-testid="button-start"]')).toBeEnabled();
    
    console.log('✅ Complete workflow test passed!');
  });

  test('should show error when attempting to lap before start', async ({ page }) => {
    // Verify initial state
    await expect(page.locator('[data-testid="stopwatch-display"]')).toHaveText(/00:00:00/);
    
    // ===== STEP 1: Try to lap without starting =====
    console.log('⚠️ Attempting to lap before start...');
    
    // Verify lap button is visible (may be disabled)
    const lapButton = page.locator('[data-testid="button-lap"]');
    await expect(lapButton).toBeVisible();
    
    // Try to click lap button (should trigger error)
    await lapButton.click();
    
    // Wait for error banner to appear
    await page.waitForSelector('role=alert', { timeout: 5000 });
    
    // Verify error message is displayed
    const errorBanner = page.locator('role=alert');
    await expect(errorBanner).toBeVisible();
    
    // Verify error message content (should mention lap or cannot)
    const errorText = await errorBanner.textContent();
    expect(errorText?.toLowerCase()).toMatch(/lap|cannot|error/i);
    console.log(`⚠️ Error message: ${errorText}`);
    
    // Verify no laps were recorded
    await expect(page.locator('text=No laps recorded yet')).toBeVisible();
    await expect(page.locator('[data-testid="lap-item-1"]')).not.toBeVisible();
    
    // ===== STEP 2: Start stopwatch to clear error =====
    console.log('▶️ Starting stopwatch to clear error...');
    await page.click('[data-testid="button-start"]');
    
    // Wait for error to clear (error banner should disappear)
    await page.waitForTimeout(500);
    await expect(errorBanner).not.toBeVisible();
    
    console.log('✅ Error handling test passed!');
  });

  test('should display time in MM:SS:MS format', async ({ page }) => {
    const display = page.locator('[data-testid="stopwatch-display"]');
    
    // ===== STEP 1: Verify initial format =====
    console.log('📐 Verifying initial time format...');
    await expect(display).toHaveText(/00:00:00/);
    
    // Verify format matches MM:SS:MS pattern (2 digits:2 digits:2 digits)
    const initialTime = await display.textContent();
    expect(initialTime).toMatch(/^\d{2}:\d{2}:\d{2}$/);
    console.log(`✅ Initial format correct: ${initialTime}`);
    
    // ===== STEP 2: Start and verify format updates =====
    console.log('▶️ Starting stopwatch to verify format updates...');
    await page.click('[data-testid="button-start"]');
    
    // Wait for time to advance
    await page.waitForTimeout(1000);
    
    // Get updated time
    const updatedTime = await display.textContent();
    expect(updatedTime).not.toBe('00:00:00');
    
    // Verify format still matches MM:SS:MS pattern
    expect(updatedTime).toMatch(/^\d{2}:\d{2}:\d{2}$/);
    console.log(`✅ Updated format correct: ${updatedTime}`);
    
    // Verify format components
    const [minutes, seconds, centiseconds] = updatedTime!.split(':');
    expect(minutes.length).toBe(2);
    expect(seconds.length).toBe(2);
    expect(centiseconds.length).toBe(2);
    
    // Verify values are numeric
    expect(Number.parseInt(minutes, 10)).toBeGreaterThanOrEqual(0);
    expect(Number.parseInt(seconds, 10)).toBeGreaterThanOrEqual(0);
    expect(Number.parseInt(centiseconds, 10)).toBeGreaterThanOrEqual(0);
    
    console.log(`✅ Format validation passed: ${minutes}:${seconds}:${centiseconds}`);
    
    // ===== STEP 3: Stop and verify format persists =====
    console.log('⏸️ Stopping to verify format persists...');
    await page.click('[data-testid="button-stop"]');
    
    await page.waitForTimeout(200);
    const stoppedTime = await display.textContent();
    expect(stoppedTime).toMatch(/^\d{2}:\d{2}:\d{2}$/);
    console.log(`✅ Stopped format correct: ${stoppedTime}`);
    
    // ===== STEP 4: Reset and verify format =====
    console.log('🔄 Resetting to verify format...');
    await page.click('[data-testid="button-reset"]');
    
    await expect(display).toHaveText(/00:00:00/);
    const resetTime = await display.textContent();
    expect(resetTime).toMatch(/^\d{2}:\d{2}:\d{2}$/);
    console.log(`✅ Reset format correct: ${resetTime}`);
    
    console.log('✅ Format verification test passed!');
  });
});

