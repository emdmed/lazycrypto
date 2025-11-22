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
import { usePersistSelectedCryptos } from "../hooks/usePersistSelectedCryptos.js";
import { useStdoutDimensions } from "../hooks/useStdoutDimensions.js";

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
  const { isMin } = getArgs();
  const { selectedCryptos, setSelectedCryptos } = usePersistSelectedCryptos();
  const [terminalWidth] = useStdoutDimensions();

  useEffect(() => {
    process.stdout.write("\x1B[2J\x1B[0f");
  }, []);

  const getCryptosPerRow = () => {
    if (terminalWidth >= 180 && !isMin) return 3;
    if (terminalWidth >= 120 && !isMin) return 2;
    if (terminalWidth >= 210 && isMin) return 2;
    return 1;
  };

  const groupCryptosIntoRows = (cryptos, cryptosPerRow) => {
    const rows = [];
    for (let i = 0; i < cryptos.length; i += cryptosPerRow) {
      rows.push(cryptos.slice(i, i + cryptosPerRow));
    }
    return rows;
  };

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

  const cryptosPerRow = getCryptosPerRow();
  const cryptoRows = groupCryptosIntoRows(selectedCryptos, cryptosPerRow);

  return (
    <Box
      flexDirection="column"
      paddingLeft={1}
      paddingRight={1}
    >
      {!isMin && (
        <Box
          justifyContent="space-between"
          borderStyle="single"
          borderColor="cyan"
          borderTop={false}
          borderLeft={false}
          borderRight={false}
        >
          <Box width="100%" gap="1" flexDirection="row" justifyContent="space-between">
            <Box>
              <Text bold color="cyan">LazyCrypto</Text>
            </Box>
            <Box>
              <Text color="cyan">
                Timeframe: {selectedTimeframe} | Periods: 20 | Refresh:
                15min
              </Text>
            </Box>
          </Box>
        </Box>
      )}
      {selectedCryptos.length > 0 ? (
        cryptoRows.map((row, rowIndex) => (
          <Box key={`row-${rowIndex}`} flexDirection="row" justifyContent="flex-start">

            {row.map((cryptoId, cryptoIndex) => {
              const ticker = getTickerForCrypto(cryptoId);
              const globalIndex = rowIndex * cryptosPerRow + cryptoIndex;
              return (
                <Box
                  key={`${cryptoId}-${globalIndex}-${refreshKey}`}
                  marginRight={cryptoIndex < row.length - 1 ? 1 : 0}
                >
                  <CryptoData
                    crypto={cryptoId}
                    ticker={ticker}
                    apiKey={apiKey}
                    selectedTimeframe={selectedTimeframe}
                    isTradesVisible={isTradesVisible}
                    totalCards={selectedCryptos?.length}
                    cardNumber={globalIndex + 1}
                    isLastRow={(cryptoRows.length - 1) === rowIndex}
                    cryptosPerRow={cryptosPerRow}
                  />
                </Box>
              );
            })}
          </Box>
        ))
      ) : (
        <Text color="yellow">Loading cryptocurrencies...</Text>
      )}

    </Box>
  );
};

export default MultiCryptoDashboard;
