import React from "react";
import { Box, Text } from "ink";

const ConfirmOrder = ({ 
  selectedPair, 
  orderSide, 
  amount, 
  currentPrice 
}) => {
  return (
    <Box flexDirection="column">
      <Text bold color="yellow">
        Confirm Order:
      </Text>
      
      <Box marginTop={1} flexDirection="column">
        <Text>
          Pair: <Text color="cyan">{selectedPair}</Text>
        </Text>
        <Text>
          Side:{" "}
          <Text color={orderSide === "buy" ? "green" : "red"}>
            {orderSide.toUpperCase()}
          </Text>
        </Text>
        <Text>
          Amount: <Text color="cyan">{amount}</Text>
        </Text>
        {currentPrice && (
          <Text>
            Est. Total:{" "}
            <Text color="cyan">
              {orderSide === "buy"
                ? `${amount} USDT`
                : `${(parseFloat(amount) * currentPrice).toFixed(4)} USDT`}
            </Text>
          </Text>
        )}
      </Box>
      
      <Box marginTop={1}>
        <Text>Place order? (Y/n)</Text>
      </Box>
    </Box>
  );
};

export default ConfirmOrder;