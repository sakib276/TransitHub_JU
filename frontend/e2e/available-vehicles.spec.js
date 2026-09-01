import { expect, test } from '@playwright/test';

test('a passenger can browse vehicles and request a ride', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'Available Vehicles' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Vehicles at CSE' })).toBeVisible();
  await expect(page.locator('.av-vehicle-card')).toHaveCount(2);

  await page.getByRole('button', { name: 'Dairy Gate' }).click();
  await expect(page.getByRole('heading', { name: 'Vehicles at Dairy Gate' })).toBeVisible();
  await expect(page.locator('.av-vehicle-card')).toHaveCount(1);
  await expect(page.getByText('Selim Mia')).toBeVisible();

  await page.getByRole('button', { name: 'CSE' }).click();
  await expect(page.getByRole('heading', { name: 'Vehicles at CSE' })).toBeVisible();
  await page.locator('.av-vehicle-card').first().getByRole('button', { name: 'Request Ride' }).click();

  await expect(page.getByRole('status')).toContainText('Ride request sent. The driver will be notified.');
  await expect(page.getByRole('button', { name: 'Request Sent' })).toHaveCount(2);
  await expect(page.getByRole('button', { name: 'Request Sent' }).first()).toBeDisabled();

  await page.getByRole('button', { name: 'Join Queue' }).click();
  await expect(page.getByRole('button', { name: 'Joined Queue' })).toBeDisabled();
  await expect(page.getByRole('status')).toContainText('You joined the queue.');
});
