import React, { useEffect, useState } from "react";
import { Box, Text, useInput } from "ink";

const ConfigPanel = ({ onSave, onCancel, configData }) => {
  const [apiKey, setApiKey] = useState("");
  const [error, setError] = useState("");
  const [showInstructions, setShowInstructions] = useState(true);
  const [cursorPosition, setCursorPosition] = useState(0);
  
  useEffect(() => {
    setApiKey(configData?.apiKey || "")
  }, [configData?.apiKey])

  useInput((input, key) => {
    if (key.escape) {
      onCancel();
    }
    
    if (key.return) {
      handleSave();
    }
    
    if (key.backspace || key.delete) {
      if (apiKey.length > 0) {
        setApiKey(apiKey.slice(0, -1));
        setCursorPosition(Math.max(0, cursorPosition - 1));
        setError("");
      }
    } else if (input && !key.ctrl && !key.meta && !key.shift) {
      setApiKey(apiKey + input);
      setCursorPosition(cursorPosition + input.length);
      setError(""); 
    }
  });

  const handleSave = () => {
    if (!apiKey.trim()) {
      setError("API key cannot be empty");
      return;
    }
    
    if (apiKey.length < 10) {
      setError("API key seems too short");
      return;
    }
    
    onSave(apiKey.trim());
  };

  const maskedKey = apiKey ? "*".repeat(apiKey.length) : "";
  const displayValue = maskedKey || "";

  return (
    <Box flexDirection="column" padding={1}>
      <Box marginBottom={1}>
        <Text bold color="cyan">
          ⚙️  LazyCrypto Configuration
        </Text>
      </Box>

      <Box 
        flexDirection="column" 
        borderStyle="round" 
        borderColor="cyan" 
        padding={1}
      >
        {showInstructions && (
          <Box flexDirection="column" marginBottom={1}>
            <Text color="yellow">
              No configuration file found. Please enter your API key to continue.
            </Text>
            <Text color="gray" fontSize={12}>
              This will be saved to ~/.config/lazycrypto/config.json
            </Text>
          </Box>
        )}

        <Box marginTop={1} marginBottom={1}>
          <Text bold>API Key: </Text>
          <Text color={apiKey ? "green" : "gray"}>
            {displayValue || "Enter your API key..."}
          </Text>
          <Text color="cyan">█</Text>
        </Box>

        {error && (
          <Box marginTop={1}>
            <Text color="red">❌ {error}</Text>
          </Box>
        )}

        <Box marginTop={1} flexDirection="column">
          <Text color="green" fontSize={12}>
            Press <Text bold>Enter</Text> to save
          </Text>
          <Text color="gray" fontSize={12}>
            Press <Text bold>Esc</Text> to cancel
          </Text>
        </Box>
      </Box>

      <Box marginTop={1}>
        <Text color="gray" fontSize={11}>
          💡 Tip: Make sure you have a valid API key from your crypto service provider
        </Text>
      </Box>

      {apiKey.length > 0 && (
        <Box marginTop={1}>
          <Text color="dim">
            Key length: {apiKey.length} characters
          </Text>
        </Box>
      )}
    </Box>
  );
};

export default ConfigPanel;