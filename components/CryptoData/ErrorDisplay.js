import React from 'react';
import { Box, Text } from 'ink';

const ErrorDisplay = ({ error }) => {
  return (
    <Box
      width="100%"
      minWidth={60}
      borderStyle="round"
      borderColor="red"
      padding={1}
      justifyContent="center"
    >
      <Text color="red">
        ❌ {error}
      </Text>
    </Box>
  );
};

export default ErrorDisplay;