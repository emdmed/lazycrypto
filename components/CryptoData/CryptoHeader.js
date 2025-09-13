import React from 'react';
import { Box, Text } from 'ink';
import { formatPrice, formatPercentage } from '../../utils/formatters/formatters.js';

const CryptoHeader = ({ ticker, currentPrice, prevPrice }) => {

  const isPriceUp = currentPrice > prevPrice
  return (
    <Box justifyContent="space-between" width="100%">
      <Box flexDirection="row" gap={0}>
        <Text inverse bold>
          {` ${ticker} ` || 'Unknown'}
        </Text>
        <Text inverse bold color={isPriceUp ? "green" : "red"}>
          {` ${formatPrice(currentPrice)} `}
        </Text>
      </Box>
    </Box>
  );
};

export default CryptoHeader;
