import dotenv from "dotenv";
dotenv.config();
import React, { useEffect, useState } from "react";
import { Box, Text } from "ink";
import MultiCryptoDashboard from "./MultiCryptoDashboard.js";
import ConfigPanel from "./ConfigPanel.js";
import { readJsonFromFile } from "../utils/readJsonFile.js";
import { writeJsonToFile } from "../utils/writeJsonFile.js";
import os from "os";
import path from "path";
import fs from "fs/promises";

const clearTerminal = () => {
  process.stdout.write("\x1B[2J\x1B[0f");
};

const App = () => {
  const [isConfigPanelVisible, setIsConfigPanelVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [apiKey, setApiKey] = useState("");

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
        setIsLoading(false);
      } else {
        // Config exists but no API key
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
      // Ensure directory exists
      await fs.mkdir(configDir, { recursive: true });
      
      // Save the config
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

  const handleBack = () => {
    process.exit(0);
  };

  if (isLoading) {
    return React.createElement(
      Box,
      { flexDirection: "column", padding: 1 },
      React.createElement(Text, { color: "cyan" }, "Loading configuration...")
    );
  }

  if (isConfigPanelVisible) {
    return React.createElement(ConfigPanel, {
      onSave: handleApiKeySave,
      onCancel: handleBack
    });
  }

  return React.createElement(
    Box,
    { flexDirection: "column", padding: 1 },
    React.createElement(MultiCryptoDashboard, {
      apiKey: apiKey,
      onBack: handleBack
    })
  );
};

export default App;