import React from 'react';
import { Box, Text } from 'ink';
import Spinner from 'ink-spinner';

const LoadingSpinner = ({ ticker }) => {
  return (
    <Box
      width="100%"
      minWidth={60}
      borderStyle="round"
      borderColor="gray"
      padding={1}
      justifyContent="center"
    >
      <Box flexDirection="row">
        <Spinner type="dots" />
        <Text color="yellow" marginLeft={1}>
          {ticker}
        </Text>
      </Box>
    </Box>
  );
};

export default LoadingSpinner;