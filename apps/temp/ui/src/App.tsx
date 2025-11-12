/**
 * Temp Converter App Entry Point
 * 
 * Main application component that renders the TempConverter container.
 * This serves as the root component for the Temperature Converter UI application.
 * 
 * Features:
 * - Renders the complete TempConverter component with all sub-components
 * - Provides application-level styling and layout
 * - Handles application initialization
 */

import React from 'react';
import { TempConverter } from './components/TempConverter';

function App(): JSX.Element {
  return (
    <div
      className="temp-converter-app"
      style={{
        minHeight: '100vh',
        backgroundColor: '#f9f9f9',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {/* Main TempConverter Component */}
      <TempConverter />
    </div>
  );
}

export default App;

