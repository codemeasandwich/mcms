import { createRoot } from 'react-dom/client';
import { MantineProvider } from '@mantine/core';
import App from './App';
import '@mantine/core/styles.css';

// Get the root DOM element we created in index.html
const container = document.getElementById('root');

// Create a React root - this is the entry point for React 18+
const root = createRoot(container);

// Render your App component into the root
root.render(
  <MantineProvider>
    <App />
  </MantineProvider>
);
