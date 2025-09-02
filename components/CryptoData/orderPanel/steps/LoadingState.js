import React from "react";
import { Box, Text } from "ink";
import Spinner from "ink-spinner";

const LoadingState = ({ message = "Placing order..." }) => {
  return (
    <Box
      flexDirection="column"
      padding={1}
      borderStyle="round"
      borderColor="yellow"
    >
      <Box>
        <Text color="yellow">
          <Spinner type="dots" /> {message}
        </Text>
      </Box>
    </Box>
  );
};

export default LoadingState;