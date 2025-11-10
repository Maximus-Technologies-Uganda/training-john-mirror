/**
 * Stopwatch App Entry Point
 * 
 * Main application component that renders the Stopwatch container.
 * This serves as the root component for the Stopwatch UI application.
 * 
 * Features:
 * - Renders the complete Stopwatch component with all sub-components
 * - Provides application-level styling and layout
 * - Handles application initialization
 */

import React from 'react';
import { Stopwatch } from './components/Stopwatch';

function App() {
  return (
    <div
      className="stopwatch-app"
      style={{
        minHeight: '100vh',
        backgroundColor: '#f9f9f9',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {/* Main Stopwatch Component */}
      <Stopwatch />
    </div>
  );
}

export default App;
