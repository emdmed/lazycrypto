import React, { useState, useEffect } from 'react';
import { Box, Text, useInput } from 'ink';
import SelectInput from 'ink-select-input';
import CryptoData from './CryptoData/CryptoData.js';

const availableCryptos = [
  { label: 'Bitcoin (BTC)', value: 'bitcoin', ticker: 'BTC' },
  { label: 'Ethereum (ETH)', value: 'ethereum', ticker: 'ETH' },
  { label: 'Cardano (ADA)', value: 'cardano', ticker: 'ADA' },
  { label: 'Solana (SOL)', value: 'solana', ticker: 'SOL' },
  { label: 'Polygon (MATIC)', value: 'matic-network', ticker: 'MATIC' },
  { label: 'Chainlink (LINK)', value: 'chainlink', ticker: 'LINK' }
];

const MultiCryptoDashboard = ({ onBack, apiKey }) => {
  // Store API identifiers instead of tickers
  const [selectedCryptos, setSelectedCryptos] = useState(['bitcoin', 'ethereum']);
  const [showCryptoMenu, setShowCryptoMenu] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Clear terminal when component mounts
  useEffect(() => {
    process.stdout.write('\x1B[2J\x1B[0f');
  }, []);

  // Handle keyboard input - SINGLE useInput hook for the entire dashboard
  useInput((input, key) => {
    if (input === 's' || input === 'S') {
      setShowCryptoMenu(!showCryptoMenu);
    } else if (input === 'r' || input === 'R') {
      setRefreshKey(prev => prev + 1); // Force refresh all cards
    } else if (input === 'b' || input === 'B') {
      onBack();
    } else if (input === 'q' || input === 'Q' || (key.ctrl && input === 'c')) {
      process.exit(0);
    }
  });

  const handleCryptoSelect = (item) => {
    const cryptoId = item.value;
    if (selectedCryptos.includes(cryptoId)) {
      // Remove if already selected
      setSelectedCryptos(prev => prev.filter(c => c !== cryptoId));
    } else if (selectedCryptos.length < 5) {
      // Add if not at limit (reduced to 5 to prevent memory issues)
      setSelectedCryptos(prev => [...prev, cryptoId]);
    }
  };

  const cryptoMenuItems = availableCryptos.map(crypto => ({
    ...crypto,
    label: selectedCryptos.includes(crypto.value) 
      ? `✓ ${crypto.label}` 
      : `  ${crypto.label}`
  })).concat([
    { label: '── Done ──', value: 'done' }
  ]);

  const handleMenuSelect = (item) => {
    if (item.value === 'done') {
      setShowCryptoMenu(false);
    } else {
      handleCryptoSelect(item);
    }
  };

  // Helper function to get ticker for display
  const getTickerForCrypto = (cryptoId) => {
    const crypto = availableCryptos.find(c => c.value === cryptoId);
    return crypto ? crypto.ticker : cryptoId.toUpperCase();
  };

  if (showCryptoMenu) {
    return React.createElement(Box, { flexDirection: "column" },
      React.createElement(Box, { marginBottom: 1 },
        React.createElement(Text, { bold: true, color: "cyan" }, 
          `Select Cryptocurrencies (${selectedCryptos.length}/5 selected)`
        )
      ),
      React.createElement(Text, { dimColor: true, marginBottom: 1 }, 
        "Select/deselect cryptos to display. Press Enter on 'Done' when finished."
      ),
      React.createElement(SelectInput, { 
        items: cryptoMenuItems, 
        onSelect: handleMenuSelect
      })
    );
  }

  if (selectedCryptos.length === 0) {
    return React.createElement(Box, { flexDirection: "column" },
      React.createElement(Box, { marginBottom: 1 },
        React.createElement(Text, { bold: true, color: "cyan" }, "LazyCrypto")
      ),
      React.createElement(Text, { color: "yellow" }, "No cryptocurrencies selected."),
      React.createElement(Box, { marginTop: 1 },
        React.createElement(Text, { dimColor: true }, "Press 'S' to select cryptocurrencies")
      )
    );
  }

  // Calculate vertical layout - one card per row
  return React.createElement(Box, { flexDirection: "column" },
    // Header
    React.createElement(Box, { marginBottom: 1, justifyContent: "space-between" },
      React.createElement(Text, { bold: true, color: "cyan" }, 
        `LazyCrypto)`
      ),
      React.createElement(Text, { dimColor: true }, 
        new Date().toLocaleTimeString()
      )
    ),

    // Crypto cards - one per row, full width
    selectedCryptos.length > 0 ? 
      selectedCryptos.map((cryptoId, index) => {
        const ticker = getTickerForCrypto(cryptoId);
        return React.createElement(Box, { 
          key: `${cryptoId}-${index}-${refreshKey}`,
          marginBottom: index < selectedCryptos.length - 1 ? 1 : 0
        },
          React.createElement(CryptoData, { 
            crypto: cryptoId,
            ticker: ticker,
            apiKey: apiKey
          })
        );
      }) :
      React.createElement(Text, { color: "yellow" }, "Loading cryptocurrencies..."),

    // Footer with controls
    React.createElement(Box, { marginTop: 1, flexDirection: "column" },
      React.createElement(Text, { dimColor: true }, 
        "'S' select cryptos | 'R' refresh | 'B' back | 'Q' quit"
      )
    )
  );
};

export default MultiCryptoDashboard;