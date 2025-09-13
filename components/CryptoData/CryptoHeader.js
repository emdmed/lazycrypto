import React from 'react';
import { Box, Text } from 'ink';
import { formatPrice, formatPercentage } from '../../utils/formatters/formatters.js';
import CandleVisualizer from './visualizations/candleVisualization.js';

const CryptoHeader = ({ ticker, currentPrice, prevPrice, historicalData }) => {

  const isPriceUp = currentPrice > prevPrice
  return (
    <Box justifyContent="flex-start" gap={1} width="100%">
      <Box flexDirection="row" gap={0}>
        <Text inverse bold>
          {` ${ticker} ` || 'Unknown'}
        </Text>
        <Text inverse bold color={isPriceUp ? "green" : "red"}>
          {` ${formatPrice(currentPrice)} `}
        </Text>
      </Box>
      <CandleVisualizer historicalData={historicalData} />
    </Box>
  );
};

export default CryptoHeader;
