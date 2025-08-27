import dotenv from "dotenv";
dotenv.config();
import React, { useEffect, useState } from "react";
import { Box, Text, useInput } from "ink";
import MultiCryptoDashboard from "./MultiCryptoDashboard.js";
import ConfigPanel from "./ConfigPanel.js";
import TimeframeSelector from "./TimeframeSelector.js";
import { readJsonFromFile } from "../utils/readJsonFile.js";
import { writeJsonToFile } from "../utils/writeJsonFile.js";
import os from "os";
import path from "path";
import fs from "fs/promises";
import { getArgs } from "../utils/getArgs.js";

const clearTerminal = () => {
  console.clear();
};

const App = () => {
  const [isConfigPanelVisible, setIsConfigPanelVisible] = useState(false);
  const [isTimeframeSelectorVisible, setIsTimeframeSelectorVisible] =
    useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [apiKey, setApiKey] = useState("");
  const [configData, setConfigData] = useState({});
  const [selectedTimeframe, setSelectedTimeframe] = useState("15min");

  const { isMin } = getArgs();

  useInput((input, key) => {
    if (!isLoading && !isConfigPanelVisible && !isTimeframeSelectorVisible) {
      if (input.toLowerCase() === "c") {
        setIsConfigPanelVisible(true);
      }
      if (input.toLowerCase() === "t") {
        setIsTimeframeSelectorVisible(true);
      }
    }

    if (key.escape) {
      if (isConfigPanelVisible) {
        setIsConfigPanelVisible(false);
      }
      if (isTimeframeSelectorVisible) {
        setIsTimeframeSelectorVisible(false);
      }
    }
  });

  useEffect(() => {
    clearTerminal();
    checkConfig();
  }, []);

  const checkConfig = async () => {
    const configDir = path.join(os.homedir(), ".config/lazycrypto");
    const filePath = path.join(configDir, "config.json");

    try {
      const configData = await readJsonFromFile(filePath);

      if (configData && configData.apiKey) {
        setApiKey(configData.apiKey);
        setConfigData(configData);

        // Load saved timeframe if exists
        if (configData.timeframe) {
          setSelectedTimeframe(configData.timeframe);
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

  const handleApiKeySave = async (newApiKey) => {
    const configDir = path.join(os.homedir(), ".config/lazycrypto");
    const filePath = path.join(configDir, "config.json");

    try {
      await fs.mkdir(configDir, { recursive: true });

      const configData = {
        apiKey: newApiKey,
        timeframe: selectedTimeframe,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await writeJsonToFile(configData, filePath);

      setApiKey(newApiKey);
      setConfigData(configData);
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
      // Still update the state even if save fails
      setSelectedTimeframe(timeframe);
      setIsTimeframeSelectorVisible(false);
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

  return (
    <Box flexDirection="column" padding={isMin ? 0 : 1}>
      <MultiCryptoDashboard
        apiKey={apiKey}
        selectedTimeframe={selectedTimeframe}
        onBack={handleBack}
      />
    </Box>
  );
};

export default App;
