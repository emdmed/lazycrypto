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
      borderStyle={isMin ? null : "single"}
      borderColor={isMin ? null : "gray"}
      borderLeft={false}
      borderRight={false}
      borderTop={false}
      padding={isMin ? 0 : 1}
      justifyContent={isMin ? "flex-start" : "center"}
    >
      <Box flexDirection="row" gap={1}>
        <Text marginLeft={1}>
          {ticker}
        </Text>
        <Spinner type="dots" />
      </Box>
    </Box>
  );
};

export default LoadingSpinner;
