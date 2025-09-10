import React, { useState, useEffect } from "react";
import { Box, Text } from "ink";
import SelectInput from "ink-select-input";
import CryptoData from "./CryptoData/CryptoData.js";
import { getArgs } from "../utils/getArgs.js";
import {
  contractPanelZellij,
} from "./CryptoData/terminals/zellij.js";
import {
  contractPanelTMUX,
} from "./CryptoData/terminals/tmux.js";
import { cryptoOptions } from "../constants/cryptoOptions.js";

const contractTerminal = (lines) => {
  contractPanelZellij(lines);
  contractPanelTMUX(lines);
};

const MultiCryptoDashboard = ({
  apiKey,
  selectedTimeframe,
  isTradesVisible,
  showCryptoMenu,
  setShowCryptoMenu,
  refreshKey
}) => {
  const [selectedCryptos, setSelectedCryptos] = useState(["bitcoin", "monero"]);

  const { isMin } = getArgs();

  useEffect(() => {
    process.stdout.write("\x1B[2J\x1B[0f");
  }, []);

  const handleCryptoSelect = (item) => {
    const cryptoId = item.value;
    if (selectedCryptos.includes(cryptoId)) {
      setSelectedCryptos((prev) => prev.filter((c) => c !== cryptoId));
    } else if (selectedCryptos.length < 25) {
      setSelectedCryptos((prev) => [...prev, cryptoId]);
    }
  };

  const cryptoMenuItems = cryptoOptions
    .map((crypto) => ({
      ...crypto,
      label: selectedCryptos.includes(crypto.value)
        ? `✓ ${crypto.label}`
        : `  ${crypto.label}`,
    }))
    .concat([{ label: "── Done ──", value: "done" }]);

  const handleMenuSelect = (item) => {
    if (item.value === "done") {
      isMin && contractTerminal(3);
      setShowCryptoMenu(false);
    } else {
      handleCryptoSelect(item);
    }
  };

  const getTickerForCrypto = (cryptoId) => {
    const crypto = cryptoOptions.find((c) => c.value === cryptoId);
    return crypto ? crypto.ticker : cryptoId.toUpperCase();
  };

  if (showCryptoMenu) {
    return (
      <Box flexDirection="column">
        <Box marginBottom={1}>
          <Text bold color="cyan">
            Select Cryptocurrencies ({selectedCryptos.length}/20 selected)
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
            LazyCrypto Timeframe: {selectedTimeframe} | Periods: 20 | Refresh:
            15min
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
    <Box
      flexDirection="column"
      borderStyle="round"
      borderColor={isMin ? "white" : "cyan"}
      paddingLeft={1}
      paddingRight={1}
    >
      {!isMin && (
        <Box
          marginBottom={1}
          justifyContent="space-between"
          borderStyle="single"
          borderColor="cyan"
          borderTop={false}
          borderLeft={false}
          borderRight={false}
        >
          <Text bold color="cyan">
            LazyCrypto Timeframe: {selectedTimeframe} | Periods: 20 | Refresh:
            15min
          </Text>
          <Text dimColor>{new Date().toLocaleTimeString()}</Text>
        </Box>
      )}

      {selectedCryptos.length > 0 ? (
        selectedCryptos.map((cryptoId, index) => {
          const ticker = getTickerForCrypto(cryptoId);
          return (
            <Box key={`${cryptoId}-${index}-${refreshKey}`}>
              <CryptoData
                crypto={cryptoId}
                ticker={ticker}
                apiKey={apiKey}
                selectedTimeframe={selectedTimeframe}
                isTradesVisible={isTradesVisible}
                totalCards={selectedCryptos?.length}
                cardNumber={index + 1}
              />
            </Box>
          );
        })
      ) : (
        <Text color="yellow">Loading cryptocurrencies...</Text>
      )}

    </Box>
  );
};

export default MultiCryptoDashboard;
