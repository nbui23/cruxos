import { expect, test, type Page } from '@playwright/test';

async function resetDemo(page: Page) {
  const response = await page.request.post('/api/test/reset');
  expect(response.ok()).toBeTruthy();
}

function sectionByHeading(page: Page, heading: string) {
  return page.locator('section').filter({ has: page.getByRole('heading', { name: heading }) }).first();
}

test.beforeEach(async ({ page }) => {
  await resetDemo(page);
});

test('logs a climbing session and supporting data', async ({ page }) => {
  await page.goto('/log');

  const today = '2026-04-04';
  const climbing = sectionByHeading(page, 'Climbing session');
  await climbing.getByLabel('Session date').fill(today);
  await climbing.getByLabel('Hardest grade sent').fill('V8');
  await climbing.getByLabel('Discipline').fill('Bouldering');
  await climbing.getByLabel('Session RPE').fill('6');
  await climbing.getByRole('button', { name: 'Save entry' }).click();
  await page.waitForTimeout(400);

  await expect(page.getByText('V8')).toBeVisible();

  const sleep = sectionByHeading(page, 'Sleep');
  await sleep.getByLabel('Date').fill(today);
  await sleep.getByLabel('Hours slept').fill('8.5');
  await sleep.getByRole('button', { name: 'Save entry' }).click();
  await page.waitForTimeout(400);

  const nutrition = sectionByHeading(page, 'Nutrition');
  await nutrition.getByLabel('Date').fill(today);
  await nutrition.getByLabel('Protein (g)').fill('175');
  await nutrition.getByRole('button', { name: 'Save entry' }).click();
  await page.waitForTimeout(400);

  await page.goto('/history');
  await expect(page.getByText('V8')).toBeVisible();
  await expect(page.getByText(/Sleep 8\.5h/i)).toBeVisible();
  await expect(page.getByText(/Protein 175g/i)).toBeVisible();
});

test('shows comparison-based insights in the performance report', async ({ page }) => {
  await page.goto('/reports/performance');

  await expect(page.getByRole('heading', { name: 'What conditions are most associated with stronger sessions?' })).toBeVisible();
  await expect(page.getByText('How to read this')).toBeVisible();
  await expect(page.getByText(/Top report signal/i)).toBeVisible();
  await expect(page.getByText(/Comparison:/).first()).toBeVisible();
  await expect(page.getByText(/Average normalized grade:/).first()).toBeVisible();
  await expect(page.getByText(/Threshold:/).first()).toBeVisible();
});
