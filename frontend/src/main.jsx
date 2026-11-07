import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';
import './index.css';

/**
 * Mounts the TransitHub JU React application.
 *
 * @returns {void}
 */
function initializeApplication() {
  const rootElement = document.getElementById('root');

  if (!rootElement) {
    throw new Error('Root element was not found.');
  }

  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}

initializeApplication();