import React from 'react';
import { Box, Text } from 'ink';
import Spinner from 'ink-spinner';

const CryptoControls = ({ historicalLoading, historicalData, indicators, onShowMenu }) => {
  return (
    <Box justifyContent="space-between" marginTop={0}>
      <Box flexDirection="row">
        {historicalLoading && (
          <Box flexDirection="row" marginLeft={2}>
            <Spinner type="dots" />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default CryptoControls;