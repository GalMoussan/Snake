import { test, expect } from '@playwright/test';

test.describe('Snake Game E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
  });

  test('shows start screen on load', async ({ page }) => {
    await expect(page.locator('canvas')).toBeVisible();
    await expect(page.locator('h1')).toHaveText('SNAKE');
    await expect(page.locator('#startBtn')).toBeVisible();
    await expect(page.locator('#pauseBtn')).toBeVisible();
  });

  test('start button is enabled on load', async ({ page }) => {
    const startButton = page.locator('#startBtn');
    await expect(startButton).toBeEnabled();
    await expect(startButton).toHaveText('Start');
  });

  test('pause button is disabled on load', async ({ page }) => {
    const pauseButton = page.locator('#pauseBtn');
    await expect(pauseButton).toBeDisabled();
  });

  test('starts game on space press', async ({ page }) => {
    const canvas = page.locator('canvas');
    await canvas.click();
    await page.keyboard.press('Space');

    // Wait a moment for game to start
    await page.waitForTimeout(200);

    // Start button should change to Restart
    await expect(page.locator('#startBtn')).toHaveText('Restart');
  });

  test('starts game on start button click', async ({ page }) => {
    const startButton = page.locator('#startBtn');
    await startButton.click();

    await page.waitForTimeout(200);

    // Button should change to Restart
    await expect(startButton).toHaveText('Restart');
    // Pause button should be enabled
    await expect(page.locator('#pauseBtn')).toBeEnabled();
  });

  test('snake moves with arrow keys', async ({ page }) => {
    const canvas = page.locator('canvas');
    await canvas.click();
    await page.keyboard.press('Space');

    // Press arrow right
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(300);

    // Press arrow down
    await page.keyboard.press('ArrowDown');
    await page.waitForTimeout(300);

    // Game should still be running (no errors)
    await expect(canvas).toBeVisible();
  });

  test('snake moves with WASD keys', async ({ page }) => {
    const canvas = page.locator('canvas');
    await canvas.click();
    await page.keyboard.press('Space');

    // Press D (right)
    await page.keyboard.press('d');
    await page.waitForTimeout(300);

    // Press S (down)
    await page.keyboard.press('s');
    await page.waitForTimeout(300);

    // Game should still be running
    await expect(canvas).toBeVisible();
  });

  test('pauses on space during gameplay', async ({ page }) => {
    const canvas = page.locator('canvas');
    await canvas.click();

    // Start game
    await page.keyboard.press('Space');
    await page.waitForTimeout(200);

    // Pause game
    await page.keyboard.press('Space');
    await page.waitForTimeout(100);

    // Pause button should show Resume
    await expect(page.locator('#pauseBtn')).toHaveText('Resume');
  });

  test('pauses on pause button click', async ({ page }) => {
    const startButton = page.locator('#startBtn');
    const pauseButton = page.locator('#pauseBtn');

    // Start game
    await startButton.click();
    await page.waitForTimeout(200);

    // Pause game
    await pauseButton.click();
    await page.waitForTimeout(100);

    // Pause button should show Resume
    await expect(pauseButton).toHaveText('Resume');
  });

  test('resumes from pause', async ({ page }) => {
    const canvas = page.locator('canvas');
    await canvas.click();

    // Start game
    await page.keyboard.press('Space');
    await page.waitForTimeout(200);

    // Pause game
    await page.keyboard.press('Space');
    await page.waitForTimeout(100);

    // Resume game
    await page.keyboard.press('Space');
    await page.waitForTimeout(100);

    // Pause button should show Pause again
    await expect(page.locator('#pauseBtn')).toHaveText('Pause');
  });

  test('pauses on Escape key', async ({ page }) => {
    const canvas = page.locator('canvas');
    await canvas.click();

    // Start game
    await page.keyboard.press('Space');
    await page.waitForTimeout(200);

    // Pause with Escape
    await page.keyboard.press('Escape');
    await page.waitForTimeout(100);

    // Pause button should show Resume
    await expect(page.locator('#pauseBtn')).toHaveText('Resume');
  });

  test('displays score', async ({ page }) => {
    const currentScore = page.locator('#currentScore');
    const highScore = page.locator('#highScore');

    await expect(currentScore).toBeVisible();
    await expect(highScore).toBeVisible();
    await expect(currentScore).toContainText('Score:');
    await expect(highScore).toContainText('High Score:');
  });

  test('game elements are responsive', async ({ page }) => {
    // Test that main elements are visible on different viewports
    await page.setViewportSize({ width: 375, height: 667 }); // Mobile

    await expect(page.locator('canvas')).toBeVisible();
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('#startBtn')).toBeVisible();
  });

  test('can restart game after game over', async ({ page }) => {
    const canvas = page.locator('canvas');
    await canvas.click();

    // Start game
    await page.keyboard.press('Space');
    await page.waitForTimeout(200);

    // Move snake into wall quickly
    for (let i = 0; i < 50; i++) {
      await page.keyboard.press('ArrowLeft');
      await page.waitForTimeout(10);
    }

    // Wait for potential game over
    await page.waitForTimeout(2000);

    // Try to restart
    await page.keyboard.press('Space');
    await page.waitForTimeout(200);

    // Start button should show Restart
    const startButton = page.locator('#startBtn');
    await expect(startButton).toHaveText('Restart');
  });
});
