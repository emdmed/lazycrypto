import React from 'react';
import { Box, Text } from 'ink';
import SelectInput from 'ink-select-input';

const CryptoSelector = ({ cryptoOptions, currentCrypto, onSelect, onCancel }) => {
  return (
    <Box flexDirection="column">
      <Box marginBottom={1}>
        <Text bold color="cyan">
          🚀 Select Cryptocurrency
        </Text>
      </Box>
      
      <SelectInput
        items={cryptoOptions}
        onSelect={onSelect}
        initialIndex={cryptoOptions.findIndex(option => option.value === currentCrypto)}
      />
      
      <Box marginTop={1}>
        <Text dimColor>
          Press 'S' to cancel selection
        </Text>
      </Box>
    </Box>
  );
};

export default CryptoSelector;