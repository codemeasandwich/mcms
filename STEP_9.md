# Step 9: Playwright E2E Testing

Learn end-to-end testing with Playwright. E2E tests simulate real user interactions in a browser.

---

## Install

```bash
npm install --save-dev @playwright/test
```

Then install the browsers:

```bash
npx playwright install
```

**Check it worked:** Look in `package.json` for `"@playwright/test"` in devDependencies.

---

## Configure

### Add test script to `package.json`

In the `"scripts"` section, add:

```json
"test:e2e": "npx playwright install && playwright test"
```

### Create Playwright config file `playwright.config.js`

Create this file in the project root:

```javascript
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './src/__tests__/e2e',
  use: {
    baseURL: 'http://localhost:3000',
  },
  webServer: {
    command: 'npm start',
    url: 'http://localhost:3000',
    reuseExistingServer: true,
  },
});
```

**Key concepts:**
- `testDir` - Where Playwright looks for test files
- `baseURL` - Allows using relative URLs in tests
- `webServer` - Starts your dev server before tests run

---

## 1. Basic Test: Page Navigation

**Feature:** Navigate to a page and verify its title

Create the folder and file `src/__tests__/e2e/basic.spec.js`:

```javascript
const { test, expect } = require('@playwright/test');

test('homepage has correct title', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle(/My Chat Client/);
});
```

**Key concepts:**
- `test` - Defines a single test case
- `page` - Browser page object (provided by Playwright)
- `page.goto('/')` - Navigates to the URL
- `expect(page).toHaveTitle()` - Asserts the page title matches

---

## Verify Your Changes

Run the E2E tests:

```bash
npm run test:e2e
```

You should see output like:

```
Running 1 test using 1 worker

  ✓ basic.spec.js:3:1 › homepage has correct title (500ms)

  1 passed
```

---

## What You Learned

| Feature | Example | Use Case |
|---------|---------|----------|
| test | `test('name', async ({ page }) => {...})` | Define a test |
| page.goto | `await page.goto('/')` | Navigate to URL |
| expect | `await expect(page).toHaveTitle(...)` | Make assertions |
| baseURL | Set in config | Avoid repeating full URLs |

---

## 2. Testing Element States: Disabled/Enabled

**Feature:** Verify elements are disabled or enabled based on application state

```javascript
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
```

**Key concepts:**
- `test.describe` - Groups related tests together
- `page.locator()` - Finds elements using CSS selectors
- `page.getByRole()` - Finds elements by their accessibility role
- `locator.fill()` - Types text into an input
- `toBeDisabled()` - Asserts element has disabled attribute
- `toBeEnabled()` - Asserts element is not disabled

---

## After Step 9: File Structure

```
src/
  __tests__/
    e2e/
      basic.spec.js
    matchers.test.js
    objects.test.js
    mocks.test.js
playwright.config.js
```

---

## After Step 9: package.json scripts

```json
"scripts": {
  "start": "webpack serve",
  "build": "webpack --mode production",
  "test": "jest",
  "test:e2e": "npx playwright install && playwright test"
}
```

---

## Troubleshooting

**"browserType.launch: Executable doesn't exist"**
- Run `npx playwright install` to download browsers

**"Target page, context or browser has been closed"**
- Make sure your dev server is running
- Check `baseURL` matches your server port

**Tests timeout**
- Increase timeout in config: `timeout: 30000`
- Check your app actually starts at the configured URL
