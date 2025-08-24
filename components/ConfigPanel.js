import React, { useState } from "react";
import { Box, Text, useInput } from "ink";

const ConfigPanel = ({ onSave, onCancel }) => {
  const [apiKey, setApiKey] = useState("");
  const [error, setError] = useState("");
  const [showInstructions, setShowInstructions] = useState(true);
  const [cursorPosition, setCursorPosition] = useState(0);

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
        setError(""); // Clear error on input
      }
    } else if (input && !key.ctrl && !key.meta && !key.shift) {
      setApiKey(apiKey + input);
      setCursorPosition(cursorPosition + input.length);
      setError(""); // Clear error on input
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

  // Mask the API key for display
  const maskedKey = apiKey ? "*".repeat(apiKey.length) : "";
  const displayValue = maskedKey || "";

  return React.createElement(
    Box,
    { flexDirection: "column", padding: 1 },
    React.createElement(
      Box,
      { marginBottom: 1 },
      React.createElement(
        Text,
        { bold: true, color: "cyan" },
        "⚙️  LazyCrypto Configuration"
      )
    ),
    React.createElement(
      Box,
      { 
        flexDirection: "column", 
        borderStyle: "round", 
        borderColor: "cyan", 
        padding: 1 
      },
      showInstructions && React.createElement(
        Box,
        { flexDirection: "column", marginBottom: 1 },
        React.createElement(
          Text,
          { color: "yellow" },
          "No configuration file found. Please enter your API key to continue."
        ),
        React.createElement(
          Text,
          { color: "gray", fontSize: 12 },
          "This will be saved to ~/.config/lazycrypto/config.json"
        )
      ),
      React.createElement(
        Box,
        { marginTop: 1, marginBottom: 1 },
        React.createElement(Text, { bold: true }, "API Key: "),
        React.createElement(
          Text,
          { color: apiKey ? "green" : "gray" },
          displayValue || "Enter your API key..."
        ),
        React.createElement(
          Text,
          { color: "cyan" },
          "█"
        )
      ),
      error && React.createElement(
        Box,
        { marginTop: 1 },
        React.createElement(
          Text,
          { color: "red" },
          "❌ " + error
        )
      ),
      React.createElement(
        Box,
        { marginTop: 1, flexDirection: "column" },
        React.createElement(
          Text,
          { color: "green", fontSize: 12 },
          "Press ",
          React.createElement(Text, { bold: true }, "Enter"),
          " to save"
        ),
        React.createElement(
          Text,
          { color: "gray", fontSize: 12 },
          "Press ",
          React.createElement(Text, { bold: true }, "Esc"),
          " to cancel"
        )
      )
    ),
    React.createElement(
      Box,
      { marginTop: 1 },
      React.createElement(
        Text,
        { color: "gray", fontSize: 11 },
        "💡 Tip: Make sure you have a valid API key from your crypto service provider"
      )
    ),
    apiKey.length > 0 && React.createElement(
      Box,
      { marginTop: 1 },
      React.createElement(
        Text,
        { color: "dim" },
        "Key length: " + apiKey.length + " characters"
      )
    )
  );
};

export default ConfigPanel;