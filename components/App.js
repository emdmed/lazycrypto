import dotenv from "dotenv"
dotenv.config();
import React, { useState, useEffect } from 'react';
import { Box, Text } from 'ink';
import SelectInput from 'ink-select-input';
import MultiCryptoDashboard from './MultiCryptoDashboard.js';

const modeOptions = [
  { label: '📊 Multi-Crypto Dashboard', value: 'multi' },
  { label: '🚀 Single Crypto View', value: 'single' },
  { label: '❌ Exit', value: 'exit' }
];

// Function to clear terminal
const clearTerminal = () => {
  process.stdout.write('\x1B[2J\x1B[0f');
};

const App = () => {
  const [currentMode, setCurrentMode] = useState('multi'); // Start with multi-crypto dashboard
  const [showModeSelection, setShowModeSelection] = useState(false);

  // Clear terminal on app start
  useEffect(() => {
    clearTerminal();
  }, []);

  const handleModeSelect = (item) => {
    if (item.value === 'exit') {
      process.exit(0);
    }
    setCurrentMode(item.value);
    setShowModeSelection(false);
  };

  const handleBack = () => {
    setShowModeSelection(true);
  };

  return React.createElement(Box, { flexDirection: "column", padding: 1 },
    showModeSelection ? 
      React.createElement(Box, { flexDirection: "column" },
        React.createElement(Box, { marginBottom: 1 },
          React.createElement(Text, { bold: true, color: "cyan" }, "🚀 LazyCrypto - Select Mode")
        ),
        React.createElement(Box, { marginBottom: 1 },
          React.createElement(Text, null, "Choose how you want to view cryptocurrency data:")
        ),
        React.createElement(SelectInput, { items: modeOptions, onSelect: handleModeSelect })
      ) :
      React.createElement(MultiCryptoDashboard, { onBack: handleBack })
  );
};

export default App;