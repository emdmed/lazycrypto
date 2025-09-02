import React from "react";
import { Box, Text } from "ink";
import SelectInput from "ink-select-input";

const SelectSide = ({ selectedPair, onSelect }) => {
  return (
    <Box flexDirection="column">
      <Text color="yellow">Selected: {selectedPair}</Text>
      <Text color="yellow" marginTop={1}>
        Select Order Side:
      </Text>
      <Box marginTop={1}>
        <SelectInput
          items={[
            { label: "Buy", value: "buy" },
            { label: "Sell", value: "sell" },
            { label: "Close Position", value: "close" },
          ]}
          onSelect={onSelect}
        />
      </Box>
    </Box>
  );
};

export default SelectSide;