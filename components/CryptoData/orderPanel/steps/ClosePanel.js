import React, { useState, useEffect } from "react";
import { Box, Text, useInput } from "ink";
import SelectInput from "ink-select-input";
import Spinner from "ink-spinner";
import { exchanges } from "../../../../exchanges/exchanges.js";
import { formatPrice } from "../../../../utils/formatters/formatters.js";
import { useGetOrders } from "../../hooks/useGetOrders.js";
import { useCryptoData } from "../../../../hooks/useCryptoData.js";

const ClosePanel = ({
  selectedPair,
  onClose,
  onBack,
  apiKey,
  selectedTimeframe,
}) => {
  const [step, setStep] = useState("loadingOrders");
  const [activeOrders, setActiveOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { historicalData, historicalLoading } = useCryptoData(
    selectedPair.split("-")[0],
    apiKey,
    selectedTimeframe,
  );

  const currentPrice = historicalData[historicalData.length - 1]?.[2];

  const { orders, isLoadingOrders } = useGetOrders({ pair: selectedPair });

  useInput((input, key) => {
    if (key.escape) {
      if (step === "selectOrder") {
        onBack();
      } else {
        onClose();
      }
    }

    if (step === "confirm") {
      if (input.toLowerCase() === "y") {
        closeOrder();
      } else if (input.toLowerCase() === "n") {
        setStep("selectOrder");
      }
    }

    if (success && key.return) {
      onClose();
    }
  });

  // Process orders when they are loaded from the hook
  useEffect(() => {
    if (!isLoadingOrders && orders) {
      processOrders(orders);
    }
  }, [orders, isLoadingOrders]);

  const processOrders = (ordersData) => {
    try {
      setError("");
      setStep("loadingOrders");

      // Filter only buy orders from the file data
      const buyOrders = ordersData.filter((order) => order.type === "buy");

      if (buyOrders.length === 0) {
        setError(`No active buy orders found for ${selectedPair}`);
        setStep("noOrders");
        return;
      }

      // Format orders for display using the specified format
      const formattedOrders = buyOrders.map((order) => {
        const delta = currentPrice
          ? ((currentPrice - order.price) / order.price) * 100
          : 0;
        const color = delta > 0 ? "green" : "red";

        return {
          label: `Open: ${order.cryptoAmount} at ${formatPrice(order.price)} (${delta.toFixed(2)}%)`,
          value: order.orderId,
          order: order,
          delta: delta,
          color: color,
        };
      });

      setActiveOrders(formattedOrders);
      setStep("selectOrder");
    } catch (err) {
      setError("Failed to process orders");
      setStep("error");
      console.error("Process orders error:", err);
    }
  };

  const handleOrderSelect = (item) => {
    setSelectedOrder(item.order);
    setStep("confirm");
  };

  const closeOrder = async () => {
    setIsLoading(true);
    setError("");

    try {
      // Place a market sell order to close the position
      const sellResult = await exchanges.kucoin.placeOrder(
        "sell",
        currentPrice,
        parseFloat(amount),
        symbolInfo,
        selectedPair,
      );

      if (sellResult && sellResult.data && sellResult.data.orderId) {
        setSuccess(
          `Position closed successfully! Sell Order ID: ${sellResult.data.orderId}`,
        );
      } else {
        setError(
          "Failed to close position - order cancellation may have succeeded but sell order failed",
        );
      }
    } catch (error) {
      setError(error.message || "Failed to close position");
    }

    setIsLoading(false);
  };

  const calculatePnL = () => {
    if (!selectedOrder || !currentPrice) return null;

    const buyPrice = parseFloat(selectedOrder.price);
    const quantity = parseFloat(selectedOrder.cryptoAmount);
    const currentValue = quantity * currentPrice;
    const originalValue = quantity * buyPrice;
    const pnl = currentValue - originalValue;
    const pnlPercentage = ((currentPrice - buyPrice) / buyPrice) * 100;

    return {
      pnl: pnl.toFixed(4),
      pnlPercentage: pnlPercentage.toFixed(2),
      isProfit: pnl > 0,
    };
  };

  if (isLoading) {
    return (
      <Box
        flexDirection="column"
        padding={1}
        borderStyle="round"
        borderColor="yellow"
      >
        <Box>
          <Text color="yellow">
            <Spinner type="dots" /> Closing position...
          </Text>
        </Box>
      </Box>
    );
  }

  if (success) {
    return (
      <Box
        flexDirection="column"
        padding={1}
        borderStyle="round"
        borderColor="green"
      >
        <Text color="green">✓ {success}</Text>
        <Text color="gray" dimColor>
          Press Enter to continue
        </Text>
      </Box>
    );
  }

  return (
    <Box
      flexDirection="column"
      padding={1}
      borderStyle="round"
      borderColor="cyan"
    >
      <Box marginBottom={1}>
        <Text bold color="cyan">
          ═══ Close Position for {selectedPair} ═══
        </Text>
      </Box>

      {error && (
        <Box marginBottom={1}>
          <Text color="cyan">⚠ {error}</Text>
        </Box>
      )}

      {(step === "loadingOrders" || isLoadingOrders) && (
        <Box>
          <Text color="yellow">
            <Spinner type="dots" /> Loading active buy orders...
          </Text>
        </Box>
      )}

      {step === "noOrders" && (
        <Box flexDirection="column">
          <Text color="yellow">
            No active buy orders found for {selectedPair}
          </Text>
          <Box marginTop={1}>
            <Text color="gray" dimColor>
              Press ESC to go back
            </Text>
          </Box>
        </Box>
      )}

      {step === "error" && (
        <Box flexDirection="column">
          <Text color="red">Error loading orders</Text>
          <Box marginTop={1}>
            <Text color="gray" dimColor>
              Press ESC to go back
            </Text>
          </Box>
        </Box>
      )}

      {step === "selectOrder" && (
        <Box flexDirection="column">
          <Box flexDirection="row" gap={1}>
            <Text color="yellow">Select order to close at </Text>
            {currentPrice && (
              <Text inverse color="yellow">
                {formatPrice(currentPrice)}
              </Text>
            )}
          </Box>
          <Box marginTop={1}>
            <SelectInput
              items={activeOrders}
              onSelect={handleOrderSelect}
              itemComponent={({ isSelected, label, value }) => {
                const order = activeOrders.find(
                  (o) => o.value === value,
                )?.order;
                if (!order || !currentPrice) return <Text>{label}</Text>;

                const delta =
                  ((currentPrice - order.price) / order.price) * 100;
                const color = delta > 0 ? "green" : "red";

                return (
                  <Box gap={1}>
                    <Text color={isSelected ? "blue" : color}>
                      {isSelected ? "► " : "  "}{order.cryptoAmount} at{" "}
                      {formatPrice(order.price)}
                    </Text>
                    <Text inverse color={color}>
                      {" "}
                      {delta.toFixed(2)}%{" "}
                    </Text>
                  </Box>
                );
              }}
            />
          </Box>
        </Box>
      )}

      {step === "confirm" && selectedOrder && (
        <Box flexDirection="column">
          <Text bold color="cyan">
            Confirm Close Position:
          </Text>

          <Box marginTop={1} flexDirection="column">
            <Text>
              Pair: <Text color="cyan">{selectedPair}</Text>
            </Text>
            <Text>
              Order ID:{" "}
              <Text color="cyan">{selectedOrder.orderId.slice(-8)}</Text>
            </Text>
            <Text>
              Size: <Text color="cyan">{selectedOrder.cryptoAmount}</Text>
            </Text>
            <Text>
              Buy Price:{" "}
              <Text color="cyan">{formatPrice(selectedOrder.price)} USDT</Text>
            </Text>
            {currentPrice && !historicalLoading && (
              <Text>
                Current Price:{" "}
                <Text color="cyan">{formatPrice(currentPrice)} USDT</Text>
              </Text>
            )}
            {!currentPrice && historicalLoading && (
              <Box flexDirection="row" marginLeft={2}>
                <Spinner type="dots" />
              </Box>
            )}
            {(() => {
              const pnlData = calculatePnL();
              return pnlData ? (
                <Text>
                  Est. P&L:{" "}
                  <Text color={pnlData.isProfit ? "green" : "red"}>
                    {pnlData.isProfit ? "+" : ""}
                    {pnlData.pnl} USDT ({pnlData.isProfit ? "+" : ""}
                    {pnlData.pnlPercentage}%)
                  </Text>
                </Text>
              ) : null;
            })()}
          </Box>

          <Box marginTop={1}>
            <Text color="yellow">
              ⚠ This will cancel the buy order and place a market sell order
            </Text>
          </Box>

          <Box marginTop={1}>
            <Text color="gray">Close position? (Y/n)</Text>
          </Box>
        </Box>
      )}

      <Box marginTop={1}>
        <Text dimColor>
          ESC to {step === "selectOrder" ? "go back" : "cancel"}
        </Text>
      </Box>
    </Box>
  );
};

export default ClosePanel;
