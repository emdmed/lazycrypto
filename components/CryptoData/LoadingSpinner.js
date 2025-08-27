import React from "react";
import { Box, Text } from "ink";
import Spinner from "ink-spinner";
import { getArgs } from "../../utils/getArgs.js";

const LoadingSpinner = ({ ticker }) => {
  const { isMin } = getArgs();

  return (
    <Box
      width="100%"
      minWidth={60}
      borderStyle={isMin ? null : "round"}
      borderColor={isMin ? null : "gray"}
      padding={isMin ? 0 : 1}
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
