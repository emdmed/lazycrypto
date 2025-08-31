import dotenv from "dotenv";
dotenv.config();
import React, { useEffect, useState } from "react";
import { Box, Text, useInput } from "ink";
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
import {
  setupZellijLayout,
  expandPanelZellij,
  contractPanelZellij,
} from "./CryptoData/terminals/zellij.js";
import {
  contractPanelTMUX,
  expandPanelTMUX,
  setupTmuxLayout,
} from "./CryptoData/terminals/tmux.js";

const clearTerminal = () => {
  console.clear();
};

const App = () => {
  const [isConfigPanelVisible, setIsConfigPanelVisible] = useState(false);
  const [isTimeframeSelectorVisible, setIsTimeframeSelectorVisible] =
    useState(false);
  const [isOrderPanelVisible, setIsOrderPanelVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [apiKey, setApiKey] = useState("");
  const [apiSecret, setApiSecret] = useState("");
  const [apiPassphrase, setApiPassphrase] = useState("");
  const [configData, setConfigData] = useState({});
  const [selectedTimeframe, setSelectedTimeframe] = useState("15min");
  const [currentSymbol, setCurrentSymbol] = useState("BTC-USDT");

  const { isMin } = getArgs();

  const expandTerminal = (lines) => {
    expandPanelZellij(lines);
    expandPanelTMUX(lines);
  };

  const contractTerminal = (lines) => {
    contractPanelZellij(lines);
    contractPanelTMUX(lines);
  };

  useInput((input, key) => {
    if (
      !isLoading &&
      !isConfigPanelVisible &&
      !isTimeframeSelectorVisible &&
      !isOrderPanelVisible
    ) {
      if (input.toLowerCase() === "c") {
        expandTerminal(3);
        setTimeout(() => {
          setIsConfigPanelVisible(true);
        }, 200);
      }
      if (input.toLowerCase() === "t") {
        expandTerminal(3);
        console.clear();
        setTimeout(() => {
          setIsTimeframeSelectorVisible(true);
        }, 200);
      }
      if (input.toLowerCase() === "o") {
        if (apiSecret && apiPassphrase) {
          setIsOrderPanelVisible(true);
        } else {
          setIsConfigPanelVisible(true);
        }
      }
    }

    if (key.escape) {
      contractTerminal(6);

      if (isConfigPanelVisible) {
        setIsConfigPanelVisible(false);
      }
      if (isTimeframeSelectorVisible) {
        setIsTimeframeSelectorVisible(false);
      }
      if (isOrderPanelVisible) {
        setIsOrderPanelVisible(false);
      }
    }
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

      if (configData && configData.apiKey) {
        setApiKey(configData.apiKey);

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
        setIsConfigPanelVisible(true);
        setIsLoading(false);
      }
    } catch (err) {
      setIsConfigPanelVisible(true);
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

      setApiKey(newConfigData.apiKey);
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
      process.exit(0);
    }
  };

  const handleTimeframeSelectorCancel = () => {
    setIsTimeframeSelectorVisible(false);
  };

  const handleOrderPanelClose = () => {
    setIsOrderPanelVisible(false);
  };

  const handleBack = () => {
    process.exit(0);
  };

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
    if (!apiSecret || !apiPassphrase) {
      return (
        <Box
          flexDirection="column"
          padding={1}
          borderStyle="round"
          borderColor="red"
        >
          <Text color="red">⚠ Trading credentials not configured</Text>
          <Text color="yellow">
            Press 'c' to configure API credentials with trading permissions
          </Text>
          <Text color="gray" dimColor>
            Press ESC to go back
          </Text>
        </Box>
      );
    }

    return (
      <OrderPanel
        apiKey={apiKey}
        apiSecret={apiSecret}
        apiPassphrase={apiPassphrase}
        onClose={handleOrderPanelClose}
        currentSymbol={currentSymbol}
      />
    );
  }

  return (
    <Box flexDirection="column" padding={isMin ? 0 : 1}>
      <MultiCryptoDashboard
        apiKey={apiKey}
        selectedTimeframe={selectedTimeframe}
        onBack={handleBack}
        onSymbolChange={handleSymbolChange}
        isMinified={isMin}
      />
    </Box>
  );
};

export default App;
