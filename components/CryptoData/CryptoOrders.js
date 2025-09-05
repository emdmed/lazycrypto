import React from "react";
import { useGetOrders } from "./hooks/useGetOrders.js";
import { formatPrice } from "../../utils/formatters/formatters.js";
import { Box, Text } from "ink";
import Spinner from "ink-spinner";

const CryptoOrders = ({ ticker, historicalData }) => {
  const { orders, openOrders, balance, isLoadingOrders, isLoadingBalance } = useGetOrders({
    pair: `${ticker}-USDT`,
  });

  const currentPrice = Number(historicalData[historicalData.length - 1][2]);

  return (
    <>
      {openOrders && openOrders.length > 0 && (
        <Box flexDirection="column" marginTop={1} borderDimColor={true} borderStyle="single" borderBottom={false} borderLeft={false} borderRight={false}>
          <Box gap={1} marginBottom={1}>
            <Text inverse> Open trades </Text>
            <Text color="white">Balance: {balance}</Text>
            {isLoadingBalance && <Spinner type="dots" />}
            {!isLoadingBalance && (
              <Text color="cyan">{formatPrice(balance * currentPrice)}</Text>
            )}
          </Box>
          {isLoadingOrders && <Spinner type="dots" />}
          {!isLoadingOrders &&
            openOrders.length > 0 &&
            openOrders.map((order) => {
              const delta = ((currentPrice - order.price) / order.price) * 100;
              const color = delta > 0 ? "green" : "red";

              if (
                (order.type === "buy" && !order.open) ||
                order.type === "sell"
              )
                return null;

              return (
                <Box key={order.orderId} justifyContent="row" gap={1}>
                  <Text color={color}>
                    {order.cryptoAmount} at {formatPrice(order.price)}
                  </Text>
                  <Text color={color}>{`->`}</Text>
                  <Text color={color}>
                    {formatPrice((order.cryptoAmount * currentPrice) - (order.cryptoAmount * order.price))}
                  </Text>
                  <Text inverse color={color}>
                    {" "}
                    {delta.toFixed(2)}%{" "}
                  </Text>
                </Box>
              );
            })}
          {!isLoadingOrders &&
            openOrders.filter((order) => order.open).length === 0 && (
              <Text>No orders</Text>
            )}
        </Box>
      )}
    </>
  );
};

export default CryptoOrders;
