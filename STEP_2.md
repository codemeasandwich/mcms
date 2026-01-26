# Step 2: Install and Display Mantine Text Input

This step introduces the Mantine design system by adding a text input component.

---

## Step 2.1: Install the Mantine Component Library

Open your terminal in the project root folder and run:

```bash
npm install @mantine/core
```

**What this does:**
- Adds the Mantine React component library to your project
- Updates `package.json` with the new dependency
- Downloads the package to `node_modules/`

> **Note:** Mantine is a public npm package available from the npm registry.

---

## Step 2.2: Add MantineProvider to index.js

Mantine components require a `MantineProvider` wrapper to function properly.

Open `src/index.js` and update it:

```jsx
import { createRoot } from 'react-dom/client';
import { MantineProvider } from '@mantine/core';
import App from './App';
import '@mantine/core/styles.css';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <MantineProvider>
    <App />
  </MantineProvider>
);
```

**What this does:**

| Change | Purpose |
|--------|---------|
| `import { MantineProvider }` | Imports the provider component from Mantine |
| `import '@mantine/core/styles.css'` | Imports Mantine's required CSS styles |
| `<MantineProvider>` wrapper | Provides theme context to all Mantine components |

> **Note:** Without MantineProvider, Mantine components will not render correctly.

---

## Step 2.3: Import the TextInput Component in App.jsx

Open `src/App.jsx` in your code editor.

Add this import statement at the **top** of the file:

```jsx
import { TextInput } from '@mantine/core';
```

**What this does:**
- Imports the `TextInput` component from the Mantine library
- Makes the component available to use in your JSX

---

## Step 2.4: Update the App Component

Replace the entire contents of `src/App.jsx` with:

```jsx
import { TextInput } from '@mantine/core';

function App() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      fontFamily: 'Arial, sans-serif',
      padding: '20px'
    }}>
      <h1>Chat Client Demo</h1>

      <TextInput
        name="username"
        label="Username"
        placeholder="Enter your username"
        helperText="This is a sample text input"
      />
    </div>
  );
}

export default App;
```

**Understanding the changes:**

| Change | Purpose |
|--------|---------|
| `import { TextInput }` | Brings in the Mantine text input component |
| `flexDirection: 'column'` | Stacks elements vertically (title above input) |
| `padding: '20px'` | Adds spacing around the content |
| `<h1>Chat Client Demo</h1>` | New page title |
| `<TextInput ... />` | The Mantine text input component |

**TextInput props explained:**

| Prop | Value | Purpose |
|------|-------|---------|
| `name` | `"username"` | HTML name attribute for form submission |
| `label` | `"Username"` | Text displayed above the input field |
| `placeholder` | `"Enter your username"` | Hint text inside the empty input |
| `helperText` | `"This is a sample text input"` | Descriptive text below the input |

---

## Step 2.5: Run the Development Server

If not already running, start your dev server:

```bash
npm start
```

If already running, the page will hot-reload automatically when you save.

---

## What You Should See After Step 2

Open your browser to `http://localhost:3000`. You should see:

1. **Page Title:** "Chat Client Demo" centered at the top
2. **Text Input Component** with:
   - A label reading "Username"
   - An input field with placeholder text "Enter your username"
   - Helper text below reading "This is a sample text input"

The page layout is centered both horizontally and vertically.

---

## File Changes Summary

| File | Change |
|------|--------|
| `package.json` | New dependency added |
| `package-lock.json` | Auto-generated |
| `src/index.js` | MantineProvider wrapper added |
| `src/App.jsx` | Import added, component updated |

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `npm install` fails with 404 | Verify access to private npm registry |
| `Module not found` error | Check the import statement spelling exactly |
| Component not rendering | Check browser DevTools console for errors |
| Styles look wrong | Component may need additional CSS setup |

---

## TextInput Props Reference

The Mantine TextInput component accepts these props:

| Prop | Type | Options | Description |
|------|------|---------|-------------|
| `name` | string | — | Input field name attribute |
| `label` | string | — | Label text displayed above input |
| `placeholder` | string | — | Placeholder text inside input |
| `helperText` | string | — | Hint text displayed below input |
| `state` | string | `"default"`, `"disabled"`, `"error"`, `"success"` | Visual state of the input |
| `validationText` | string | — | Message for error/success states |
| `icon` | boolean | — | Whether to show an icon |
| `iconPosition` | string | `"left"`, `"right"` | Position of the icon |

**More info:** [Mantine Documentation](https://mantine.dev)

---

## Verification Checklist

- [ ] `npm install` completed without errors
- [ ] `npm start` runs without errors
- [ ] Browser shows "Chat Client Demo" title
- [ ] TextInput component renders with label
- [ ] Placeholder text is visible in input
- [ ] Helper text appears below input
- [ ] Input accepts keyboard typing
