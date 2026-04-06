import { expect, test, type Page } from '@playwright/test';

async function resetDemo(page: Page) {
  const response = await page.request.post('/api/test/reset');
  expect(response.ok()).toBeTruthy();
}

async function loginDemo(page: Page) {
  await page.goto('/auth');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.waitForURL('**/');
}

function sectionByHeading(page: Page, heading: string) {
  return page.locator('section').filter({ has: page.getByRole('heading', { name: heading }) }).first();
}

test.beforeEach(async ({ page }) => {
  await resetDemo(page);
  await loginDemo(page);
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

test('shows weekly guidance and comparison-based insights in the performance report', async ({ page }) => {
  await page.goto('/reports/performance');

  await expect(page.getByRole('heading', { name: 'What conditions are most associated with stronger sessions?' })).toBeVisible();
  await expect(page.getByText(/Weekly guidance state/i)).toBeVisible();
  await expect(page.getByText(/How to read this/i)).toBeVisible();
  await expect(page.getByText(/Top report signal/i)).toBeVisible();
  await expect(page.getByText(/Comparison:/).first()).toBeVisible();
  await expect(page.getByText(/Average normalized grade:/).first()).toBeVisible();
  await expect(page.getByText(/Threshold:/).first()).toBeVisible();
});

test('persists mobile capture guidance inputs through the API', async ({ page }) => {
  const loginResponse = await page.request.post('/api/auth/login', {
    headers: { 'Content-Type': 'application/json' },
    data: JSON.stringify({
      email: 'demo@cruxos.app',
      password: 'demo-pass-123',
    }),
  });
  expect(loginResponse.ok()).toBeTruthy();
  const { token } = await loginResponse.json();

  const createResponse = await page.request.post('/api/climbing-sessions', {
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    data: JSON.stringify({
      sessionDate: '2026-04-05',
      hardestGrade: 'V6',
      attemptCount: 11,
      sessionRpe: 7,
      sleepHours: 7.5,
      proteinGrams: 140,
      painScore: 2,
    }),
  });
  expect(createResponse.ok()).toBeTruthy();
  const { session } = await createResponse.json();
  expect(session?.attemptCount).toBe(11);

  const sessionsResponse = await page.request.get('/api/climbing-sessions', {
    headers: { Authorization: `Bearer ${token}` },
  });
  expect(sessionsResponse.ok()).toBeTruthy();
  const { sessions } = await sessionsResponse.json();
  const createdSession = sessions.find((session: { hardestGrade?: string; attemptCount?: number | null }) => session.hardestGrade === 'V6' && session.attemptCount === 11);
  expect(createdSession).toBeTruthy();

  const guidanceResponse = await page.request.get('/api/weekly-guidance', {
    headers: { Authorization: `Bearer ${token}` },
  });
  expect(guidanceResponse.ok()).toBeTruthy();
});
