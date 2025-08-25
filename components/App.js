import dotenv from "dotenv";
dotenv.config();
import React, { useEffect, useState } from "react";
import { Box, Text, useInput } from "ink";
import MultiCryptoDashboard from "./MultiCryptoDashboard.js";
import ConfigPanel from "./ConfigPanel.js";
import { readJsonFromFile } from "../utils/readJsonFile.js";
import { writeJsonToFile } from "../utils/writeJsonFile.js";
import os from "os";
import path from "path";
import fs from "fs/promises";

const clearTerminal = () => {
  console.clear();
};

const App = () => {
  const [isConfigPanelVisible, setIsConfigPanelVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [apiKey, setApiKey] = useState("");
  const [configData, setConfigData] = useState({});

  useInput((input, key) => {
    if (!isLoading && !isConfigPanelVisible) {
      if (input.toLowerCase() === 'c') {
        setIsConfigPanelVisible(true);
      }
    }
    
    // Handle ESC key to close config panel
    if (key.escape && isConfigPanelVisible) {
      setIsConfigPanelVisible(false);
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
        setIsLoading(false);
      } else {
        setIsConfigPanelVisible(true);
        setIsLoading(false);
      }
    } catch (err) {
      // Config file doesn't exist
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
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      await writeJsonToFile(configData, filePath);
      
      setApiKey(newApiKey);
      setIsConfigPanelVisible(false);
    } catch (err) {
      console.error("Error saving config:", err);
    }
  };

  const handleConfigCancel = () => {
    if (apiKey) {
      setIsConfigPanelVisible(false);
    } else {
      process.exit(0);
    }
  };

  const handleBack = () => {
    process.exit(0);
  };

  if (isLoading) {
    return (
      <Box flexDirection="column" padding={1}>
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

  return (
    <Box flexDirection="column" padding={1}>
      <MultiCryptoDashboard
        apiKey={apiKey}
        onBack={handleBack}
      />
    </Box>
  );
};

export default App;