import React from "react";
import { Box, Text } from "ink";
import SelectInput from "ink-select-input";

const SelectPair = ({ pairs, selectedPair, onSelect }) => {
  return (
    <Box flexDirection="column">
      <Text color="yellow">Select Trading Pair:</Text>
      <Box marginTop={1}>
        <SelectInput
          items={pairs}
          onSelect={onSelect}
          initialIndex={pairs.findIndex((p) => p.value === selectedPair)}
        />
      </Box>
    </Box>
  );
};

export default SelectPair;