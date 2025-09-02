import React, { useState, useEffect } from "react";
import { Box, Text, useInput } from "ink";
import SelectInput from "ink-select-input";
import CryptoData from "./CryptoData/CryptoData.js";
import { getArgs } from "../utils/getArgs.js";
import {
  expandPanelZellij,
  contractPanelZellij,
} from "./CryptoData/terminals/zellij.js";
import {
  expandPanelTMUX,
  contractPanelTMUX,
} from "./CryptoData/terminals/tmux.js";
import { cryptoOptions } from "../constants/cryptoOptions.js";

const expandTerminal = (lines) => {
  expandPanelZellij(lines);
  expandPanelTMUX(lines);
};

const contractTerminal = (lines) => {
  contractPanelZellij(6);
  contractPanelTMUX(6);
};

const MultiCryptoDashboard = ({
  onBack,
  apiKey,
  selectedTimeframe,
  isTradesVisible,
}) => {
  const [selectedCryptos, setSelectedCryptos] = useState(["bitcoin", "monero"]);
  const [showCryptoMenu, setShowCryptoMenu] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showKeybinds, setShowKeyBinds] = useState(false);

  const { isMin } = getArgs();

  useEffect(() => {
    process.stdout.write("\x1B[2J\x1B[0f");
  }, []);

  useInput((input, key) => {
    if (input.toLowerCase() === "s") {
      expandTerminal(6);
      console.clear();
      setTimeout(() => {
        setShowCryptoMenu(!showCryptoMenu);
      }, 200);
    } else if (input.toLocaleLowerCase() === "r") {
      setRefreshKey((prev) => prev + 1);
    } else if (
      input.toLocaleLowerCase() === "q" ||
      (key.ctrl && input === "c")
    ) {
      process.exit(0);
    } else if (input.toLocaleLowerCase() === "h") {
      setShowKeyBinds((prev) => !prev);
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
      contractTerminal(6);
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
      borderStyle={isMin ? null : "double"}
      borderColor={isMin ? null : "cyan"}
      paddingLeft={1}
      paddingRight={1}
    >
      {!isMin && (
        <Box marginBottom={1} justifyContent="space-between">
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
                ao
                selectedTimeframe={selectedTimeframe}
                isTradesVisible={isTradesVisible}
              />
            </Box>
          );
        })
      ) : (
        <Text color="yellow">Loading cryptocurrencies...</Text>
      )}

      <Box flexDirection="row" justifyContent="flex-end" >
        {showKeybinds ? (
          <Text dimColor>
            'S' cryptos | 'O' order | 'R' refresh | 'T' timeframe | 'shift' +
            't' toggle trades | 'C' config
          </Text>
        ) : (
          <Text dimColor>'h' for help</Text>
        )}
      </Box>
    </Box>
  );
};

export default MultiCryptoDashboard;
