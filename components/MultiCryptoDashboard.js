import React, { useState, useEffect } from "react";
import { Box, Text, useInput } from "ink";
import SelectInput from "ink-select-input";
import CryptoData from "./CryptoData/CryptoData.js";

const availableCryptos = [
  { label: "Bitcoin (BTC)", value: "bitcoin", ticker: "BTC" },
  { label: "Monero (XMR)", value: "monero", ticker: "XMR" },
  { label: "Ethereum (ETH)", value: "ethereum", ticker: "ETH" },
  { label: "Cardano (ADA)", value: "cardano", ticker: "ADA" },
  { label: "Solana (SOL)", value: "solana", ticker: "SOL" },
  { label: "Polygon (MATIC)", value: "matic-network", ticker: "MATIC" },
  { label: "Chainlink (LINK)", value: "chainlink", ticker: "LINK" },
];

const MultiCryptoDashboard = ({ onBack, apiKey }) => {
  const [selectedCryptos, setSelectedCryptos] = useState([
    "bitcoin",
    "monero",
  ]);
  const [showCryptoMenu, setShowCryptoMenu] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    process.stdout.write("\x1B[2J\x1B[0f");
  }, []);

  useInput((input, key) => {
    if (input === "s" || input === "S") {
      setShowCryptoMenu(!showCryptoMenu);
    } else if (input === "r" || input === "R") {
      setRefreshKey((prev) => prev + 1); // Force refresh all cards
    } else if (input === "b" || input === "B") {
      onBack();
    } else if (input === "q" || input === "Q" || (key.ctrl && input === "c")) {
      process.exit(0);
    }
  });

  const handleCryptoSelect = (item) => {
    const cryptoId = item.value;
    if (selectedCryptos.includes(cryptoId)) {
      setSelectedCryptos((prev) => prev.filter((c) => c !== cryptoId));
    } else if (selectedCryptos.length < 5) {
      setSelectedCryptos((prev) => [...prev, cryptoId]);
    }
  };

  const cryptoMenuItems = availableCryptos
    .map((crypto) => ({
      ...crypto,
      label: selectedCryptos.includes(crypto.value)
        ? `✓ ${crypto.label}`
        : `  ${crypto.label}`,
    }))
    .concat([{ label: "── Done ──", value: "done" }]);

  const handleMenuSelect = (item) => {
    if (item.value === "done") {
      setShowCryptoMenu(false);
    } else {
      handleCryptoSelect(item);
    }
  };

  const getTickerForCrypto = (cryptoId) => {
    const crypto = availableCryptos.find((c) => c.value === cryptoId);
    return crypto ? crypto.ticker : cryptoId.toUpperCase();
  };

  if (showCryptoMenu) {
    return (
      <Box flexDirection="column">
        <Box marginBottom={1}>
          <Text bold color="cyan">
            Select Cryptocurrencies ({selectedCryptos.length}/5 selected)
          </Text>
        </Box>
        <Text dimColor marginBottom={1}>
          Select/deselect cryptos to display. Press Enter on 'Done' when
          finished.
        </Text>
        <SelectInput items={cryptoMenuItems} onSelect={handleMenuSelect} />
      </Box>
    );
  }

  if (selectedCryptos.length === 0) {
    return (
      <Box flexDirection="column">
        <Box marginBottom={1}>
          <Text bold color="cyan">
            LazyCrypto Timeframe: 15m | Periods: 20 | Refresh: 15min
          </Text>
        </Box>
        <Text color="yellow">No cryptocurrencies selected.</Text>
        <Box marginTop={1}>
          <Text dimColor>Press 'S' to select cryptocurrencies</Text>
        </Box>
      </Box>
    );
  }

  return (
    <Box flexDirection="column">
      <Box marginBottom={1} justifyContent="space-between">
        <Text bold color="cyan">
          LazyCrypto Timeframe: 15m | Periods: 20 | Refresh: 15min
        </Text>
        <Text dimColor>{new Date().toLocaleTimeString()}</Text>
      </Box>

      {selectedCryptos.length > 0 ? (
        selectedCryptos.map((cryptoId, index) => {
          const ticker = getTickerForCrypto(cryptoId);
          return (
            <Box
              key={`${cryptoId}-${index}-${refreshKey}`}
              marginBottom={index < selectedCryptos.length - 1 ? 1 : 0}
            >
              <CryptoData crypto={cryptoId} ticker={ticker} apiKey={apiKey} />
            </Box>
          );
        })
      ) : (
        <Text color="yellow">Loading cryptocurrencies...</Text>
      )}

      {/* Footer with controls */}
      <Box marginTop={1} flexDirection="column">
        <Text dimColor>
          'S' select cryptos | 'R' refresh | 'C' config | 'Q' quit
        </Text>
      </Box>
    </Box>
  );
};

export default MultiCryptoDashboard;
