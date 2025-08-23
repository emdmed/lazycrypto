import dotenv from "dotenv"
dotenv.config();
import React, { useEffect } from 'react';
import { Box } from 'ink';
import MultiCryptoDashboard from './MultiCryptoDashboard.js';

// Function to clear terminal
const clearTerminal = () => {
  process.stdout.write('\x1B[2J\x1B[0f');
};

const App = () => {
  // Clear terminal on app start
  useEffect(() => {
    //clearTerminal();
  }, []);

  const handleBack = () => {
    // Since we only have multi-crypto mode, back should exit
    process.exit(0);
  };

  // Always render MultiCryptoDashboard as the only mode
  return React.createElement(Box, { flexDirection: "column", padding: 1 },
    React.createElement(MultiCryptoDashboard, { onBack: handleBack })
  );
};

export default App;