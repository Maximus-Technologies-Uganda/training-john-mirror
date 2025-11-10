/**
 * Stopwatch UI Root Entry Point
 * 
 * This is the root entry point for the Stopwatch UI application.
 * It initializes React and renders the App component into the DOM.
 * 
 * Usage:
 * - This file is referenced in index.html as the main entry point
 * - It sets up React StrictMode for development warnings
 * - It handles root element validation
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found. Make sure index.html has a <div id="root"></div> element.');
}

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

