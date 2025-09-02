import React from "react";
import { Box, Text } from "ink";

const SuccessState = ({ message }) => {
  return (
    <Box
      flexDirection="column"
      padding={1}
      borderStyle="round"
      borderColor="green"
    >
      <Text color="green">✓ {message}</Text>
      <Text color="gray" dimColor>
        Press Enter to continue
      </Text>
    </Box>
  );
};

export default SuccessState;