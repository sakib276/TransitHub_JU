import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

/**
 * Application entry point.
 *
 * Mounts the React component tree onto the `#root` DOM node,
 * wrapping the app in `BrowserRouter` for client-side routing
 * and `React.StrictMode` for highlighting potential issues
 * during development.
 */
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element with id "root" was not found in the DOM.');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);