import React from 'react';
import { Box, Text } from 'ink';
import { formatPrice, formatPercentage } from '../../utils/formatters/formatters.js';

const CryptoHeader = ({ data, ticker }) => {
  return (
    <Box justifyContent="space-between" width="100%">
      <Box flexDirection="row">
        <Text bold color="cyan">
          {data.name || 'Unknown'}
        </Text>
        <Text color="white" marginLeft={1}>
          ({ticker})
        </Text>
      </Box>
      
      <Box flexDirection="row">
        <Text bold color="yellow">
          {formatPrice(data.rate)}
        </Text>
        <Box flexDirection="row" marginLeft={2}>
          <Text dimColor>24h: </Text>
          {formatPercentage(data.delta?.day)}
        </Box>
        <Box flexDirection="row" marginLeft={2}>
          <Text dimColor>7d: </Text>
          {formatPercentage(data.delta?.week)}
        </Box>
      </Box>
    </Box>
  );
};

export default CryptoHeader;