import React from 'react';
import { createRoot } from 'react-dom/client';
import { AuthFeature } from './features/auth/index.jsx';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthFeature />
  </React.StrictMode>,
);
