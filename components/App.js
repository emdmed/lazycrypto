import dotenv from "dotenv";
dotenv.config();
import React, { useEffect, useState } from "react";
import { Box, Text, useApp } from "ink";
import MultiCryptoDashboard from "./MultiCryptoDashboard.js";
import ConfigPanel from "./ConfigPanel.js";
import TimeframeSelector from "./TimeframeSelector.js";
import OrderPanel from "./CryptoData/orderPanel/OrderPanel.js";
import { readJsonFromFile } from "../utils/readJsonFile.js";
import { writeJsonToFile } from "../utils/writeJsonFile.js";
import os from "os";
import path from "path";
import fs from "fs/promises";
import { getArgs } from "../utils/getArgs.js";
import { setupZellijLayout } from "./CryptoData/terminals/zellij.js";
import { setupTmuxLayout } from "./CryptoData/terminals/tmux.js";
import { useKeyBinds } from "../hooks/useKeybinds.js";
import { useStdoutDimensions } from "../hooks/useStdoutDimensions.js";
import { useDebounced } from "../hooks/useDebounced.js";

const clearTerminal = () => {
  console.clear();
};

const App = () => {
  const [isConfigPanelVisible, setIsConfigPanelVisible] = useState(false);
  const [isTimeframeSelectorVisible, setIsTimeframeSelectorVisible] =
    useState(false);
  const [isOrderPanelVisible, setIsOrderPanelVisible] = useState(false);
  const [isTradesVisible, setIsTradesVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [apiKey, setApiKey] = useState("");
  const [apiSecret, setApiSecret] = useState("");
  const [apiPassphrase, setApiPassphrase] = useState("");
  const [configData, setConfigData] = useState({});
  const [selectedTimeframe, setSelectedTimeframe] = useState("15min");
  const [currentSymbol, setCurrentSymbol] = useState("BTC-USDT");
  const [showKeybinds, setShowKeyBinds] = useState(false);
  const [showCryptoMenu, setShowCryptoMenu] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const [rawColumns, rawRows] = useStdoutDimensions();
  const columns = useDebounced(rawColumns, 150);
  const rows = useDebounced(rawRows, 150);

  const { exit } = useApp();
  const { isMin } = getArgs();

  useKeyBinds({
    isLoading,
    isConfigPanelVisible,
    isTimeframeSelectorVisible,
    isOrderPanelVisible,
    apiSecret,
    apiPassphrase,
    setIsConfigPanelVisible,
    setIsTradesVisible,
    setIsTimeframeSelectorVisible,
    setIsOrderPanelVisible,
    setShowKeyBinds,
    setShowCryptoMenu,
    setRefreshKey
  });

  useEffect(() => {
    clearTerminal();

    if (isMin) {
      setupZellijLayout();
      setupTmuxLayout();
    }

    checkConfig();
  }, [isMin]);

  const checkConfig = async () => {
    const configDir = path.join(os.homedir(), ".config/lazycrypto");
    const filePath = path.join(configDir, "config.json");

    try {
      const configData = await readJsonFromFile(filePath);

      if (configData) {
        setApiSecret(configData.kucoinApiSecret || "");
        setApiPassphrase(configData.kucoinApiPassphrase || "");
        setConfigData(configData);

        if (configData.timeframe) {
          setSelectedTimeframe(configData.timeframe);
        }

        if (configData.currentSymbol) {
          setCurrentSymbol(configData.currentSymbol);
        }

        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    } catch (err) {
      setIsLoading(false);
    }
  };

  const handleApiKeySave = async (credentials) => {
    const configDir = path.join(os.homedir(), ".config/lazycrypto");
    const filePath = path.join(configDir, "config.json");

    try {
      await fs.mkdir(configDir, { recursive: true });

      const newConfigData = {
        apiKey:
          typeof credentials === "string" ? credentials : credentials.apiKey,

        ...(credentials.kucoinApiKey && {
          kucoinApiKey: credentials.kucoinApiKey,
          kucoinApiSecret: credentials.kucoinApiSecret,
          kucoinApiPassphrase: credentials.kucoinApiPassphrase,
        }),

        timeframe: selectedTimeframe,
        currentSymbol: currentSymbol,
        createdAt: configData.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await writeJsonToFile(newConfigData, filePath);

      setApiKey(newConfigData.kucoinApiKey);
      setApiSecret(newConfigData.kucoinApiSecret || "");
      setApiPassphrase(newConfigData.kucoinApiPassphrase || "");
      setConfigData(newConfigData);
      setIsConfigPanelVisible(false);
    } catch (err) {
      console.error("Error saving config:", err);
    }
  };

  const handleTimeframeSelect = async (timeframe) => {
    const configDir = path.join(os.homedir(), ".config/lazycrypto");
    const filePath = path.join(configDir, "config.json");

    try {
      const updatedConfig = {
        ...configData,
        timeframe: timeframe,
        updatedAt: new Date().toISOString(),
      };

      await writeJsonToFile(updatedConfig, filePath);

      setSelectedTimeframe(timeframe);
      setConfigData(updatedConfig);
      setIsTimeframeSelectorVisible(false);
    } catch (err) {
      console.error("Error saving timeframe config:", err);
      setSelectedTimeframe(timeframe);
      setIsTimeframeSelectorVisible(false);
    }
  };

  const handleSymbolChange = async (symbol) => {
    const configDir = path.join(os.homedir(), ".config/lazycrypto");
    const filePath = path.join(configDir, "config.json");

    setCurrentSymbol(symbol);

    try {
      const updatedConfig = {
        ...configData,
        currentSymbol: symbol,
        updatedAt: new Date().toISOString(),
      };

      await writeJsonToFile(updatedConfig, filePath);
      setConfigData(updatedConfig);
    } catch (err) {
      console.error("Error saving symbol config:", err);
    }
  };

  const handleConfigCancel = () => {
    if (apiKey) {
      setIsConfigPanelVisible(false);
    } else {
      exit();
    }
  };

  const handleTimeframeSelectorCancel = () => {
    setIsTimeframeSelectorVisible(false);
  };

  const handleOrderPanelClose = () => {
    setIsOrderPanelVisible(false);
  };

  const handleBack = () => {
    exit();
  };

  if (columns !== rawColumns || rows !== rawRows) {
    return (
      <Box justifyContent="center" alignItems="center" minHeight={10}>
        <Text>⚡</Text>
      </Box>
    );
  }

  if (isLoading) {
    return (
      <Box flexDirection="column" padding={isMin ? 0 : 1}>
        <Text color="cyan">Loading configuration...</Text>
      </Box>
    );
  }

  if (isConfigPanelVisible) {
    return (
      <ConfigPanel
        onSave={handleApiKeySave}
        onCancel={handleConfigCancel}
        configData={configData}
        includeTrading={true}
      />
    );
  }

  if (isTimeframeSelectorVisible) {
    return (
      <TimeframeSelector
        currentTimeframe={selectedTimeframe}
        onSelect={handleTimeframeSelect}
        onCancel={handleTimeframeSelectorCancel}
      />
    );
  }

  if (isOrderPanelVisible) {
    return (
      <OrderPanel
        apiKey={apiKey}
        apiSecret={apiSecret}
        apiPassphrase={apiPassphrase}
        onClose={handleOrderPanelClose}
        currentSymbol={currentSymbol}
        selectedTimeframe={selectedTimeframe}
      />
    );
  }

  return (
    <Box flexDirection="column" width={columns} height={rows}>
      <MultiCryptoDashboard
        apiKey={apiKey}
        selectedTimeframe={selectedTimeframe}
        onBack={handleBack}
        onSymbolChange={handleSymbolChange}
        isMinified={isMin}
        isTradesVisible={isTradesVisible}
        showCryptoMenu={showCryptoMenu}
        setShowCryptoMenu={setShowCryptoMenu}
        refreshKey={refreshKey}
        setRefreshKey={setRefreshKey}
      />
      <Box flexDirection="row" justifyContent="flex-end">
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

export default App;
