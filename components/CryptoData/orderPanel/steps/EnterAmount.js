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
      <Text color="yellow">
        {orderSide === "buy" ? "Buying" : "Selling"} {selectedPair}
      </Text>
      
      {currentPrice && (
        <Text>Current Price: {formatPrice(currentPrice)} USDT</Text>
      )}
      
      {availableBalance !== null && (
        <Text>
          Available: {availableBalance.toFixed(4)}{" "}
          {orderSide === "buy" ? "USDT" : selectedPair.split("-")[0]}
        </Text>
      )}
      
      {orderSide === "sell" && amount && currentPrice && (
        <Text color="cyan">
          ≈ {(parseFloat(amount) * currentPrice).toFixed(4)} USDT
        </Text>
      )}
      
      <Box marginTop={1}>
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