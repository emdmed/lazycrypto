import React, { useState, useEffect, useMemo, useCallback, useContext, createContext } from "react";
import { Box, Text, useInput } from "ink";
import CryptoData from "./CryptoData/CryptoData.js";
import {
  contractPanelZellij,
} from "./CryptoData/terminals/zellij.js";
import {
  contractPanelTMUX,
} from "./CryptoData/terminals/tmux.js";
import { cryptoOptions } from "../constants/cryptoOptions.js";
import { usePersistSelectedCryptos } from "../hooks/usePersistSelectedCryptos.js";

const MAX_CRYPTOS = 20;

const SelectedCryptosContext = createContext([]);

const CryptoMenuItem = ({ label, value, isHighlighted }) => {
  const selectedCryptos = useContext(SelectedCryptosContext);
  const isChecked = selectedCryptos.includes(value);
  const prefix = value === "done" ? "" : (isChecked ? "✓ " : "  ");
  return (
    <Text color={isHighlighted ? "blue" : undefined}>
      {prefix}{label}
    </Text>
  );
};

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
  refreshKey,
  isMinified,
  terminalWidth
}) => {
  const { selectedCryptos, setSelectedCryptos } = usePersistSelectedCryptos();
  const [pendingSelections, setPendingSelections] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  useEffect(() => {
    process.stdout.write("\x1B[2J\x1B[0f");
  }, []);

  useEffect(() => {
    if (showCryptoMenu) {
      setPendingSelections([...selectedCryptos]);
      setHighlightedIndex(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showCryptoMenu]); // Only re-init when menu opens, not when selectedCryptos changes

  const tickerMap = useMemo(() =>
    Object.fromEntries(cryptoOptions.map(c => [c.value, c.ticker])),
    []
  );

  const cryptosPerRow = useMemo(() => {
    if (terminalWidth >= 180 && !isMinified) return 3;
    if (terminalWidth >= 120 && !isMinified) return 2;
    if (terminalWidth >= 210 && isMinified) return 2;
    return 1;
  }, [terminalWidth, isMinified]);

  const cryptoRows = useMemo(() => {
    const rows = [];
    for (let i = 0; i < selectedCryptos.length; i += cryptosPerRow) {
      rows.push(selectedCryptos.slice(i, i + cryptosPerRow));
    }
    return rows;
  }, [selectedCryptos, cryptosPerRow]);

  const handleCryptoSelect = useCallback((item) => {
    const cryptoId = item.value;
    setPendingSelections((prev) => {
      if (prev.includes(cryptoId)) {
        return prev.filter((c) => c !== cryptoId);
      } else if (prev.length < MAX_CRYPTOS) {
        return [...prev, cryptoId];
      }
      return prev;
    });
  }, []);

  const cryptoMenuItems = useMemo(() =>
    cryptoOptions.map((crypto) => ({
      ...crypto,
    })).concat([{ label: "── Confirm ──", value: "done" }]),
    []
  );

  useInput((input, key) => {
    if (!showCryptoMenu) return;

    if (key.upArrow) {
      setHighlightedIndex(prev => prev > 0 ? prev - 1 : cryptoMenuItems.length - 1);
    } else if (key.downArrow) {
      setHighlightedIndex(prev => prev < cryptoMenuItems.length - 1 ? prev + 1 : 0);
    } else if (input === ' ') {
      const item = cryptoMenuItems[highlightedIndex];
      if (item.value !== 'done') {
        handleCryptoSelect(item);
      }
    } else if (key.return) {
      setSelectedCryptos(pendingSelections);
      isMinified && contractTerminal(3);
      setShowCryptoMenu(false);
    }
  }, { isActive: showCryptoMenu });

  if (showCryptoMenu) {
    return (
      <SelectedCryptosContext.Provider value={pendingSelections}>
        <Box flexDirection="column">
          <Box marginBottom={1}>
            <Text bold color="cyan">
              Select Cryptocurrencies ({String(pendingSelections.length).padStart(2, ' ')}/{MAX_CRYPTOS} selected)
            </Text>
          </Box>
          <Text dimColor marginBottom={1}>
            Space to select/deselect, Enter to confirm
          </Text>
          <Box flexDirection="column">
            {cryptoMenuItems.map((item, index) => (
              <CryptoMenuItem
                key={item.value}
                label={item.label}
                value={item.value}
                isHighlighted={index === highlightedIndex}
              />
            ))}
          </Box>
        </Box>
      </SelectedCryptosContext.Provider>
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
      paddingLeft={1}
      paddingRight={1}
    >
      {!isMinified && (
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
      {cryptoRows.map((row, rowIndex) => (
        <Box key={`row-${rowIndex}`} flexDirection="row" justifyContent="flex-start">
          {row.map((cryptoId, cryptoIndex) => {
            const ticker = tickerMap[cryptoId] || cryptoId.toUpperCase();
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
                  totalCards={selectedCryptos.length}
                  cardNumber={globalIndex + 1}
                  isLastRow={(cryptoRows.length - 1) === rowIndex}
                  cryptosPerRow={cryptosPerRow}
                />
              </Box>
            );
          })}
        </Box>
      ))}
    </Box>
  );
};

export default MultiCryptoDashboard;
