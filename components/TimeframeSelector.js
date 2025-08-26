import React, { useState, useEffect } from "react";
import { Box, Text, useInput } from "ink";

const TimeframeSelector = ({ currentTimeframe, onSelect, onCancel }) => {
  const timeframes = [
    { value: "15min", label: "15 minutes" },
    { value: "30min", label: "30 minutes"},
    { value: "1hour", label: "1 hour" },
    { value: "4hour", label: "4 hours"}
  ];

  const [selectedIndex, setSelectedIndex] = useState(() => {
    const index = timeframes.findIndex(tf => tf.value === currentTimeframe);
    return index >= 0 ? index : 2; // Default to 1hour if not found
  });

  useInput((input, key) => {
    if (key.upArrow || input === 'k') {
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : timeframes.length - 1));
    } else if (key.downArrow || input === 'j') {
      setSelectedIndex(prev => (prev < timeframes.length - 1 ? prev + 1 : 0));
    } else if (key.return) {
      onSelect(timeframes[selectedIndex].value);
    } else if (key.escape || input.toLowerCase() === 'q') {
      onCancel();
    }
  });

  return (
    <Box flexDirection="column" padding={1} borderStyle="round" borderColor="cyan">
      <Box marginBottom={1}>
        <Text color="cyan" bold>⏱️  Select Timeframe</Text>
      </Box>
      
      <Box flexDirection="column" marginBottom={1}>
        {timeframes.map((timeframe, index) => (
          <Box key={timeframe.value} marginBottom={0}>
            <Text color={selectedIndex === index ? "black" : "white"} 
                  backgroundColor={selectedIndex === index ? "cyan" : undefined}>
              {selectedIndex === index ? "► " : "  "}
              {timeframe.value}
              {currentTimeframe === timeframe.value ? " (current)" : ""}
            </Text>
          </Box>
        ))}
      </Box>

      <Box flexDirection="column" marginTop={1} borderStyle="single" padding={1}>
        <Text  dimColor>
          Navigation:
        </Text>
        <Text dimColor>
          ↑/↓ or j/k: Navigate • Enter: Select • Esc/q: Cancel
        </Text>
      </Box>
    </Box>
  );
};

export default TimeframeSelector;