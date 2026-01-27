const { test, expect } = require('@playwright/test');

test('homepage has correct title', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle(/My Chat Client/);
});

test.describe('Chat page', () => {
  test('message input is disabled when username is empty', async ({ page }) => {
    await page.goto('/chat');

    const messageInput = page.locator('input[name="message"]');
    await expect(messageInput).toBeDisabled();
  });

  test('send button is disabled when username is empty', async ({ page }) => {
    await page.goto('/chat');

    const sendButton = page.getByRole('button', { name: /send/i });
    await expect(sendButton).toBeDisabled();
  });

  test('message input enables when username is entered', async ({ page }) => {
    await page.goto('/chat');

    await page.locator('input[name="username"]').fill('TestUser');

    const messageInput = page.locator('input[name="message"]');
    await expect(messageInput).toBeEnabled();
  });

  test('send button enables when username and message are entered', async ({ page }) => {
    await page.goto('/chat');

    await page.locator('input[name="username"]').fill('TestUser');
    await page.locator('input[name="message"]').fill('Hello world');

    const sendButton = page.getByRole('button', { name: /send/i });
    await expect(sendButton).toBeEnabled();
  });
});
