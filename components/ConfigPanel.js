import React, { useEffect, useState } from "react";
import { Box, Text, useInput } from "ink";

const ConfigPanel = ({
  onSave,
  onCancel,
  configData,
}) => {
  const [kucoinApiKey, setKucoinApiKey] = useState("");
  const [kucoinApiSecret, setKucoinApiSecret] = useState("");
  const [kucoinApiPassphrase, setKucoinApiPassphrase] = useState("");
  const [error, setError] = useState("");
  const [showInstructions, setShowInstructions] = useState(true);
  const [currentField, setCurrentField] = useState(0);

  const fields = ["kucoinApiKey", "kucoinApiSecret", "kucoinApiPassphrase"];

  useEffect(() => {
    setKucoinApiKey(configData?.kucoinApiKey || "");
    setKucoinApiSecret(configData?.kucoinApiSecret || "");
    setKucoinApiPassphrase(configData?.kucoinApiPassphrase || "");
  }, [configData]);

  useInput((input, key) => {
    if (key.escape) {
      //onCancel();
      return;
    }

    if (key.tab) {
      setCurrentField((prev) => (prev + 1) % fields.length);
      setError("");
      return;
    }

    if (key.return) {
      if (currentField < fields.length - 1) {
        setCurrentField(currentField + 1);
        setError("");
      } else {
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
      case 0:
        return kucoinApiKey;
      case 1:
        return kucoinApiSecret;
      case 2:
        return kucoinApiPassphrase;
      default:
        return kucoinApiKey;
    }
  };

  const updateCurrentField = (value) => {
    switch (currentField) {
      case 0:
        setKucoinApiKey(value);
        break;
      case 1:
        setKucoinApiSecret(value);
        break;
      case 2:
        setKucoinApiPassphrase(value);
        break;
    }
  };

  const handleSave = () => {
    if (!kucoinApiKey.trim()) {
      setError("KuCoin API key cannot be empty");
      setCurrentField(0);
      return;
    }

    if (kucoinApiKey.length < 10) {
      setError("KuCoin API key seems too short");
      setCurrentField(0);
      return;
    }

    if (!kucoinApiSecret.trim()) {
      setError("KuCoin API secret cannot be empty");
      setCurrentField(1);
      return;
    }

    if (kucoinApiSecret.length < 10) {
      setError("KuCoin API secret seems too short");
      setCurrentField(1);
      return;
    }

    if (!kucoinApiPassphrase.trim()) {
      setError("KuCoin API passphrase cannot be empty");
      setCurrentField(2);
      return;
    }

    const credentialsToSave = {
      kucoinApiKey: kucoinApiKey.trim(),
      kucoinApiSecret: kucoinApiSecret.trim(),
      kucoinApiPassphrase: kucoinApiPassphrase.trim(),
    };
    onSave(credentialsToSave);
  };

  const renderField = (
    label,
    value,
    fieldIndex,
    placeholder,
    provider = "",
  ) => {
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

  return (
    <Box flexDirection="column" padding={1}>
      <Box marginBottom={1}>
        <Text bold color="cyan">
          ⚙️ KuCoin Trading Configuration
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
              {configData?.kucoinApiKey
                ? "Update your KuCoin API configuration"
                : "No KuCoin configuration found."}
            </Text>
            <Text fontSize={12}>
              This will be saved to ~/.config/lazycrypto/config.json
            </Text>
            {!configData?.kucoinApiKey && (
              <Box marginTop={1}>
                <Text color="blue">
                  🔗 Get your KuCoin API credentials at:
                </Text>
                <Text color="cyan" underline>
                  https://www.kucoin.com/account/api
                </Text>
              </Box>
            )}
          </Box>
        )}

        <Text color="yellow" marginTop={1}>
          ⚠️ KuCoin trading credentials required for buy/sell functionality
        </Text>

        {renderField(
          "API Key",
          kucoinApiKey,
          0,
          "Enter your KuCoin API key...",
          "KuCoin",
        )}
        {renderField(
          "API Secret",
          kucoinApiSecret,
          1,
          "Enter your KuCoin API secret...",
          "KuCoin",
        )}
        {renderField(
          "API Passphrase",
          kucoinApiPassphrase,
          2,
          "Enter your KuCoin API passphrase...",
          "KuCoin",
        )}

        {error && (
          <Box marginTop={1}>
            <Text color="red">❌ {error}</Text>
          </Box>
        )}

        <Box marginTop={1} flexDirection="column">
          {currentField < fields.length - 1 ? (
            <>
              <Text color="green" fontSize={12}>
                Press <Text bold>Enter</Text> or <Text bold>Tab</Text> to go to
                next field
              </Text>
              <Text fontSize={12}>
                Press <Text bold>Esc</Text> to cancel
              </Text>
            </>
          ) : (
            <>
              <Text color="green" fontSize={12}>
                Press <Text bold>Enter</Text> to save
              </Text>
              <Text fontSize={12}>
                Press <Text bold>Esc</Text> to cancel | Press <Text bold>Tab</Text> to navigate fields
              </Text>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default ConfigPanel;