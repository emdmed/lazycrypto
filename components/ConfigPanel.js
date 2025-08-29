import React, { useEffect, useState } from "react";
import { Box, Text, useInput } from "ink";

const ConfigPanel = ({ onSave, onCancel, configData, includeTrading = false }) => {
  const [apiKey, setApiKey] = useState(""); // LiveCoinWatch
  const [kucoinApiKey, setKucoinApiKey] = useState("");
  const [kucoinApiSecret, setKucoinApiSecret] = useState("");
  const [kucoinApiPassphrase, setKucoinApiPassphrase] = useState("");
  const [error, setError] = useState("");
  const [showInstructions, setShowInstructions] = useState(true);
  const [currentField, setCurrentField] = useState(0);
  
  const fields = includeTrading 
    ? ['apiKey', 'kucoinApiKey', 'kucoinApiSecret', 'kucoinApiPassphrase']
    : ['apiKey'];
  
  useEffect(() => {
    setApiKey(configData?.apiKey || "");
    setKucoinApiKey(configData?.kucoinApiKey || "");
    setKucoinApiSecret(configData?.kucoinApiSecret || "");
    setKucoinApiPassphrase(configData?.kucoinApiPassphrase || "");
  }, [configData]);

  useInput((input, key) => {
    if (key.escape) {
      onCancel();
      return;
    }
    
    if (key.tab) {
      if (includeTrading) {
        setCurrentField((prev) => (prev + 1) % fields.length);
        setError("");
      }
      return;
    }
    
    if (key.return) {
      if (includeTrading && currentField < fields.length - 1) {
        // Move to next field
        setCurrentField(currentField + 1);
        setError("");
      } else {
        // Save configuration
        handleSave();
      }
      return;
    }
    
    if (key.backspace || key.delete) {
      const currentValue = getCurrentValue();
      if (currentValue.length > 0) {
        updateCurrentField(currentValue.slice(0, -1));
        setError("");
      }
    } else if (input && !key.ctrl && !key.meta && !key.shift) {
      const currentValue = getCurrentValue();
      updateCurrentField(currentValue + input);
      setError("");
    }
  });

  const getCurrentValue = () => {
    switch (currentField) {
      case 0: return apiKey;
      case 1: return kucoinApiKey;
      case 2: return kucoinApiSecret;
      case 3: return kucoinApiPassphrase;
      default: return apiKey;
    }
  };

  const updateCurrentField = (value) => {
    switch (currentField) {
      case 0: setApiKey(value); break;
      case 1: setKucoinApiKey(value); break;
      case 2: setKucoinApiSecret(value); break;
      case 3: setKucoinApiPassphrase(value); break;
    }
  };


  const handleSave = () => {
      
    if (!apiKey.trim()) {
      setError("LiveCoinWatch API key cannot be empty");
      setCurrentField(0);
      return;
    }
    
    if (apiKey.length < 10) {
      setError("LiveCoinWatch API key seems too short");
      setCurrentField(0);
      return;
    }
  
    if (includeTrading) {
      if (!kucoinApiKey.trim()) {
        setError("KuCoin API key cannot be empty for trading");
        setCurrentField(1);
        return;
      }
  
      if (kucoinApiKey.length < 10) {
        setError("KuCoin API key seems too short");
        setCurrentField(1);
        return;
      }
  
      if (!kucoinApiSecret.trim()) {
        setError("KuCoin API secret cannot be empty for trading");
        setCurrentField(2);
        return;
      }
  
      if (kucoinApiSecret.length < 10) {
        setError("KuCoin API secret seems too short");
        setCurrentField(2);
        return;
      }
  
      if (!kucoinApiPassphrase.trim()) {
        setError("KuCoin API passphrase cannot be empty for trading");
        setCurrentField(3);
        return;
      }
  
      const credentialsToSave = {
        apiKey: apiKey.trim(),
        kucoinApiKey: kucoinApiKey.trim(),
        kucoinApiSecret: kucoinApiSecret.trim(),
        kucoinApiPassphrase: kucoinApiPassphrase.trim()
      };
      onSave(credentialsToSave);
    } else {
      const credentialsToSave = {
        apiKey: apiKey.trim()
      };
      onSave(credentialsToSave);
    }
  };

  const renderField = (label, value, fieldIndex, placeholder, provider = "") => {
    const isActive = currentField === fieldIndex;
    const maskedValue = value ? "*".repeat(value.length) : "";
    
    return (
      <Box marginTop={1} marginBottom={1}>
        <Text bold color={isActive ? "cyan" : "white"}>
          {provider && <Text color="dim">({provider}) </Text>}
          {label}: 
        </Text>
        <Text color={value ? "green" : "gray"}>
          {maskedValue || placeholder}
        </Text>
        {isActive && <Text color="cyan">█</Text>}
      </Box>
    );
  };

  const getFieldLabel = (fieldName) => {
    switch (fieldName) {
      case 'apiKey': return 'LiveCoinWatch API Key';
      case 'kucoinApiKey': return 'KuCoin API Key';
      case 'kucoinApiSecret': return 'KuCoin API Secret';
      case 'kucoinApiPassphrase': return 'KuCoin API Passphrase';
      default: return fieldName;
    }
  };

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
              {configData?.apiKey 
                ? "Update your API configuration" 
                : "No configuration file found. Please enter your API credentials to continue."
              }
            </Text>
            <Text fontSize={12}>
              This will be saved to ~/.config/lazycrypto/config.json
            </Text>
            {includeTrading && (
              <Text color="orange" marginTop={1}>
                ⚠️  KuCoin trading credentials required for buy/sell functionality
              </Text>
            )}
          </Box>
        )}

        {renderField(
          "API Key", 
          apiKey, 
          0, 
          "Enter your LiveCoinWatch API key...", 
          "LiveCoinWatch"
        )}
        
        {includeTrading && (
          <>
            {renderField(
              "API Key", 
              kucoinApiKey, 
              1, 
              "Enter your KuCoin API key...", 
              "KuCoin"
            )}
            {renderField(
              "API Secret", 
              kucoinApiSecret, 
              2, 
              "Enter your KuCoin API secret...", 
              "KuCoin"
            )}
            {renderField(
              "API Passphrase", 
              kucoinApiPassphrase, 
              3, 
              "Enter your KuCoin API passphrase...", 
              "KuCoin"
            )}
          </>
        )}

        {error && (
          <Box marginTop={1}>
            <Text color="red">❌ {error}</Text>
          </Box>
        )}

        <Box marginTop={1} flexDirection="column">
          {includeTrading && currentField < fields.length - 1 ? (
            <>
              <Text color="green" fontSize={12}>
                Press <Text bold>Enter</Text> or <Text bold>Tab</Text> to go to next field
              </Text>
              <Text color="gray" fontSize={12}>
                Press <Text bold>Esc</Text> to cancel
              </Text>
            </>
          ) : (
            <>
              <Text color="green" fontSize={12}>
                Press <Text bold>Enter</Text> to save
              </Text>
              <Text color="gray" fontSize={12}>
                Press <Text bold>Esc</Text> to cancel
                {includeTrading && " | Press <Text bold>Tab</Text> to navigate fields"}
              </Text>
            </>
          )}
        </Box>
      </Box>

      <Box marginTop={1}>
        <Text color="gray" fontSize={11}>
          💡 Tip: LiveCoinWatch for price data, KuCoin for trading
          {includeTrading && " (ensure KuCoin API has trading permissions)"}
        </Text>
      </Box>

      {includeTrading && (
        <Box marginTop={1}>
          <Text color="dim">
            Current field: {getFieldLabel(fields[currentField])} 
            ({currentField + 1}/{fields.length})
          </Text>
        </Box>
      )}

      <Box marginTop={1}>
        <Text color="dim">
          Credentials length: LiveCoinWatch({apiKey.length}) 
          {includeTrading && `KuCoin Key(${kucoinApiKey.length}) Secret(${kucoinApiSecret.length}) Passphrase(${kucoinApiPassphrase.length})`}
        </Text>
      </Box>
    </Box>
  );
};

export default ConfigPanel;