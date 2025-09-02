import React from 'react';
import { Box, Text } from 'ink';
import { formatPrice, formatPercentage } from '../../utils/formatters/formatters.js';

const CryptoHeader = ({  ticker, currentPrice, prevPrice }) => {
  return (
    <Box justifyContent="space-between" width="100%">
      <Box flexDirection="row" gap={0}>
        <Text inverse bold color="cyan">
          {` ${ticker} ` || 'Unknown'}
        </Text>
        <Text inverse bold color="yellow">
          { ` ${formatPrice(currentPrice)} ` } 
        </Text>
      </Box>
    </Box>
  );
};

export default CryptoHeader;