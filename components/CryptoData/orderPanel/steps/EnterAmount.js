import React from "react";
import { Box, Text } from "ink";
import TextInput from "ink-text-input";
import { formatPrice } from "../../../../utils/formatters/formatters.js";

const EnterAmount = ({
  selectedPair,
  orderSide,
  currentPrice,
  availableBalance,
  amount,
  onAmountChange,
  onSubmit
}) => {
  return (
    <Box flexDirection="column">
      <Box flexDirection="row" gap={1}>
        <Text inverse>
          {orderSide === "buy" ? " Buying" : " Selling"} {`${selectedPair} `}
        </Text>

        {currentPrice && (
          <Box gap={1}>
            <Text>at</Text>
            <Text color="yellow" inverse>{` ${formatPrice(currentPrice)} `}</Text>
          </Box>
        )}

        {availableBalance !== null && (
          <Text>
            Available: {availableBalance}{" "}
            {orderSide === "buy" ? "USDT" : selectedPair.split("-")[0]}
          </Text>
        )}
      </Box>

      {orderSide === "sell" && amount && currentPrice && (
        <Text color="cyan">
          ≈ {(parseFloat(amount) * currentPrice).toFixed(4)} USDT
        </Text>
      )}

      <Box gap={1} marginTop={1}>
        <Text color="yellow">
          Enter Amount (
          {orderSide === "buy" ? "USDT" : selectedPair.split("-")[0]}):
        </Text>
        <TextInput
          value={amount}
          onChange={onAmountChange}
          onSubmit={onSubmit}
          placeholder="0.00"
        />
      </Box>
    </Box>
  );
};

export default EnterAmount;
