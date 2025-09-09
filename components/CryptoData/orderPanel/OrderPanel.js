import React, { useState, useEffect } from "react";
import { Box, Text, useInput } from "ink";
import { exchanges } from "../../../exchanges/exchanges.js";
import { contractPanelZellij, expandPanelZellij } from "../terminals/zellij.js";
import { contractPanelTMUX, expandPanelTMUX } from "../terminals/tmux.js";
import { getArgs } from "../../../utils/getArgs.js";
import { cryptoOptions } from "../../../constants/cryptoOptions.js";
import { saveOrder } from "./SaveOrder.js";
import { useOrderpanelActions } from "../../../hooks/useOrderPanelActions.js";

import SelectPair from "./steps/SelectPair.js";
import SelectSide from "./steps/SelectSide.js";
import EnterAmount from "./steps/EnterAmount.js";
import ConfirmOrder from "./steps/ConfirmOrder.js";
import LoadingState from "./steps/LoadingState.js";
import SuccessState from "./steps/SuccessState.js";
import ClosePanel from "./steps/ClosePanel.js";

const OrderPanel = ({
  onClose,
  currentSymbol = "BTC-USDT",
  apiKey,
  selectedTimeframe,
  apiPassphrase
}) => {
  const [step, setStep] = useState("selectPair");
  const [selectedPair, setSelectedPair] = useState(currentSymbol);
  const [orderSide, setOrderSide] = useState("buy");
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [availableBalance, setAvailableBalance] = useState(null);
  const [symbolInfo, setSymbolInfo] = useState(null);
  const [currentPrice, setCurrentPrice] = useState(null);
  const [pairs, setPairs] = useState([]);
  const [hasPosition, setHasPosition] = useState(false);
  const [pairSelected, setPairSelected] = useState(false);
  const { isMin } = getArgs();

  const {
    handleAmountSubmit,
    handleSideSelect,
    handlePairSelect,
    fetchBalance,
    fetchCurrentPrice,
    fetchSymbolInfo,
    checkPosition
  } = useOrderpanelActions({
    setError,
    setStep,
    setAvailableBalance,
    setCurrentPrice,
    setStep,
    setOrderSide,
    setSelectedPair,
    setPairSelected,
    availableBalance,
    selectedPair,
    setCurrentPrice,
    setHasPosition,
    setSymbolInfo,
    hasPosition
  })

  useEffect(() => {
    if (isMin) {
      expandPanelZellij(4);
      expandPanelTMUX(4);
    }
  }, [isMin]);

  useInput((input, key) => {
    if (key.escape) {
      onClose();
      contractPanelZellij(3);
      contractPanelTMUX(3);
    }

    if (pairSelected) {
      if (step === "selectSide") {
        if (input.toLowerCase() === "b") {
          setOrderSide("buy");
          setStep("enterAmount");
          return;
        }

        if (input.toLowerCase() === "s") {
          setOrderSide("sell");
          setStep("enterAmount");
          return;
        }

        if (input.toLowerCase() === "c" && hasPosition) {
          setStep("closePosition");
          return;
        }
      }
    }

    if (step === "confirm") {
      if (input.toLowerCase() === "y") {
        placeOrder();
      } else if (input.toLowerCase() === "n") {
        setStep("enterAmount");
      }
    }

    if (success && key.return) {
      onClose();
      contractPanelZellij(3);
      contractPanelTMUX(3);
    }
  });

  useEffect(() => {
    const allPairs = cryptoOptions.map((element) => {
      element.pair = `${element.ticker}-USDT`;
      return element;
    });

    setPairs(allPairs);
  }, [cryptoOptions]);

  useEffect(() => {
    if (selectedPair) {
      fetchSymbolInfo();
      fetchCurrentPrice();
      fetchBalance();
      checkPosition();
    }
  }, [selectedPair, orderSide]);

  const placeOrder = async () => {
    setIsLoading(true);
    setError("");

    if (!symbolInfo || !currentPrice) {
      setError("Symbol information or price not available");
      setIsLoading(false);
      return;
    }

    try {
      const result = await exchanges.kucoin.placeOrder(
        orderSide,
        currentPrice,
        parseFloat(amount),
        symbolInfo,
        selectedPair,
      );

      if (result && result.data && result.data.orderId) {
        const orderDetailsResponse = await exchanges.kucoin.getOrderDetailsById(
          result.data.orderId,
        );

        setSuccess(
          `Order placed successfully! Order ID: ${result.data.orderId}`,
        );

        saveOrder({
          orderDetails: orderDetailsResponse,
          currentPrice,
          pair: selectedPair,
          exchange: "kucoin",
        });
      } else {
        setError("Failed to place order - no order ID returned");
      }
    } catch (error) {
      setError(error.message || "Failed to place order");
    }

    setIsLoading(false);
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (success) {
    return <SuccessState message={success} />;
  }

  if (!apiKey || !apiPassphrase) {
    return <Box
      flexDirection="column"
      padding={1}
      borderStyle="round"
      borderColor="red"
    >
      <Text color="red">⚠ Trading credentials not configured</Text>
      <Text color="yellow">
        Press 'c' to configure API credentials with trading permissions
      </Text>
      <Text dimColor>Press ESC to go back</Text>
      <Text>{apiKey}</Text>
      <Text>{apiPassphrase}</Text>
    </Box>
  }

  if (step === "closePosition") {
    return (
      <ClosePanel
        selectedPair={selectedPair}
        apiKey={apiKey}
        onClose={onClose}
        onBack={() => setStep("selectSide")}
        selectedTimeframe={selectedTimeframe}
      />
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
          ═══ Place Order via Kucoin api ═══
        </Text>
      </Box>

      {error && (
        <Box marginBottom={1}>
          <Text color="red">⚠ {error}</Text>
        </Box>
      )}

      {step === "selectPair" && (
        <SelectPair
          pairs={pairs}
          selectedPair={selectedPair}
          onSelect={handlePairSelect}
        />
      )}

      {step === "selectSide" && (
        <SelectSide
          selectedPair={selectedPair}
          onSelect={handleSideSelect}
          hasPosition={hasPosition}
        />
      )}

      {step === "enterAmount" && (
        <EnterAmount
          selectedPair={selectedPair}
          orderSide={orderSide}
          currentPrice={currentPrice}
          availableBalance={availableBalance}
          amount={amount}
          onAmountChange={setAmount}
          onSubmit={handleAmountSubmit}
        />
      )}

      {step === "confirm" && (
        <ConfirmOrder
          selectedPair={selectedPair}
          orderSide={orderSide}
          amount={amount}
          currentPrice={currentPrice}
        />
      )}

      <Box marginTop={1}>
        <Text dimColor>
          Press ESC to cancel
          {step === "selectSide" && pairSelected && (
            <Text> • B to buy • S to sell{hasPosition && " • C to close position"}</Text>
          )}
        </Text>
      </Box>
    </Box>
  );
};

export default OrderPanel;
