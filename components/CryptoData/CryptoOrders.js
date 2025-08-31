import React from "react"
import { useGetOrders } from "./hooks/useGetOrders.js";
import { formatPrice } from "../../utils/formatters/formatters.js";
import { Box, Text } from "ink";

const CryptoOrders = ({ticker, historicalData}) => {
 
  const { orders, balance } = useGetOrders({ pair: `${ticker}-USDT` });

  const currentPrice = Number(historicalData[historicalData.length - 1][1]);
 
  return (
    <>
      {orders && orders.length > 0 && (
        <Box flexDirection="column" marginTop={1}>
          <Box gap={1} borderDimColor borderStyle="single" borderTop={false} borderRight={false} borderLeft={false}>
            <Text>Trades</Text>
            <Text dimColor>
              Balance: {balance}
            </Text>
            <Text color="cyan">
              USDT {formatPrice(balance * currentPrice)}
            </Text>
          </Box>
          {orders.map((order) => {
            const delta = ((order.price - currentPrice) / currentPrice) * 100;
            const color = delta > 0 ? "green" : "red";
            return (
              <Box key={order.orderId} justifyContent="row" gap={1}>
                <Text color={color}>
                  Open: {order.cryptoAmount} at {formatPrice(order.price)}
                </Text>
                <Text inverse color={color}>
                  {delta.toFixed(3)}%
                </Text>
              </Box>
            );
          })}
        </Box>
      )}
    </>
  );
};

export default CryptoOrders;
