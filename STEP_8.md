# Step 8: Jest Testing

Learn unit testing with Jest. We'll write 3 tests, each showcasing a different Jest feature.

---

## Install

```bash
npm install --save-dev jest @babel/preset-env
```

**Check it worked:** Look in `package.json` for `"jest"` in devDependencies.

---

## Configure

### Add test script to `package.json`

In the `"scripts"` section, add:

```json
"test": "jest"
```

### Create Jest config file `jest.config.js`

Create this file in the project root:

```javascript
module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.js$': 'babel-jest'
  }
};
```

**Key concept:** Jest needs Babel to understand modern JavaScript (ES modules, arrow functions, etc.).

---

## 1. Basic Test: Matchers

**Feature:** Using `expect` with different matchers

Create `src/__tests__/matchers.test.js`:

```javascript
// A simple function to test
function add(a, b) {
  return a + b;
}

describe('add function', () => {
  it('adds two positive numbers', () => {
    expect(add(2, 3)).toBe(5);
  });

  it('adds negative numbers', () => {
    expect(add(-1, -1)).toBe(-2);
  });

  it('returns a number type', () => {
    expect(typeof add(1, 1)).toBe('number');
  });
});
```

**Key concepts:**
- `describe` - Groups related tests together
- `it` - Defines a single test case (alias for `test`)
- `expect` - Creates an assertion
- `toBe` - Matcher for exact equality (uses `===`)

---

## 2. Object & Array Matchers

**Feature:** Testing objects and arrays with specialized matchers

Create `src/__tests__/objects.test.js`:

```javascript
function createUser(name, role) {
  return {
    name,
    role,
    createdAt: new Date().toISOString()
  };
}

describe('createUser function', () => {
  it('creates user with correct name and role', () => {
    const user = createUser('Alice', 'admin');

    // toEqual for object comparison (not toBe!)
    expect(user).toEqual(expect.objectContaining({
      name: 'Alice',
      role: 'admin'
    }));
  });

  it('includes a createdAt timestamp', () => {
    const user = createUser('Bob', 'user');

    // toHaveProperty checks if property exists
    expect(user).toHaveProperty('createdAt');
  });

  it('does not include password', () => {
    const user = createUser('Charlie', 'user');

    // not.toHaveProperty for absence
    expect(user).not.toHaveProperty('password');
  });
});
```

**Key concepts:**
- `toEqual` - Deep equality for objects/arrays (not `toBe`!)
- `expect.objectContaining` - Partial object matching
- `toHaveProperty` - Check if property exists
- `not` - Negates any matcher

---

## 3. Mocking Functions

**Feature:** Using `jest.fn()` to create mock functions

Create `src/__tests__/mocks.test.js`:

```javascript
describe('mock functions', () => {
  it('tracks function calls', () => {
    const mockFn = jest.fn();

    mockFn('hello');
    mockFn('world');

    // Check how many times it was called
    expect(mockFn).toHaveBeenCalledTimes(2);
  });

  it('tracks call arguments', () => {
    const mockFn = jest.fn();

    mockFn('first', 'second');

    // Check what arguments were passed
    expect(mockFn).toHaveBeenCalledWith('first', 'second');
  });

  it('can return custom values', () => {
    const mockFn = jest.fn().mockReturnValue(42);

    const result = mockFn();

    expect(result).toBe(42);
  });

  it('can mock implementation', () => {
    const mockFn = jest.fn((x) => x * 2);

    expect(mockFn(5)).toBe(10);
    expect(mockFn(3)).toBe(6);
  });
});
```

**Key concepts:**
- `jest.fn()` - Creates a mock function that tracks calls
- `toHaveBeenCalledTimes` - Verify call count
- `toHaveBeenCalledWith` - Verify call arguments
- `mockReturnValue` - Set what the mock returns
- `mockImplementation` or pass function to `jest.fn()` - Custom behavior

---

## Verify Your Changes

Run the tests:

```bash
npm test
```

You should see output like:

```
PASS  src/__tests__/matchers.test.js
PASS  src/__tests__/objects.test.js
PASS  src/__tests__/mocks.test.js

Test Suites: 3 passed, 3 total
Tests:       10 passed, 10 total
```

---

## What You Learned

| Feature | Example | Use Case |
|---------|---------|----------|
| describe/it | `describe('add', () => { it('works', ...) })` | Organize tests |
| toBe | `expect(1 + 1).toBe(2)` | Exact equality |
| toEqual | `expect(obj).toEqual({...})` | Object/array equality |
| toHaveProperty | `expect(obj).toHaveProperty('name')` | Check property exists |
| not | `expect(x).not.toBe(y)` | Negate any matcher |
| jest.fn() | `const mock = jest.fn()` | Create mock function |
| toHaveBeenCalledWith | `expect(mock).toHaveBeenCalledWith('arg')` | Verify mock arguments |

---

## After Step 8: File Structure

```
src/
  __tests__/
    matchers.test.js
    objects.test.js
    mocks.test.js
```

---

## After Step 8: package.json scripts

```json
"scripts": {
  "start": "webpack serve",
  "build": "webpack --mode production",
  "test": "jest"
}
```

---

## Troubleshooting

**"SyntaxError: Cannot use import statement"**
- Make sure `jest.config.js` exists with the transform config
- Make sure `@babel/preset-env` is installed

**Tests not found**
- Jest looks for files matching `*.test.js` or in `__tests__/` folder
- Check your file is named correctly
