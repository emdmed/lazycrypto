import React, { useState, useEffect } from "react";
import { Box, Text, useInput } from "ink";
import { exchanges } from "../../../exchanges/exchanges.js";
import { contractPanelZellij, expandPanelZellij } from "../terminals/zellij.js";
import { contractPanelTMUX, expandPanelTMUX } from "../terminals/tmux.js";
import { getArgs } from "../../../utils/getArgs.js";
import { cryptoOptions } from "../../../constants/cryptoOptions.js";
import { saveOrder } from "./SaveOrder.js";

// Import the new step components
import SelectPair from "./steps/SelectPair.js";
import SelectSide from "./steps/SelectSide.js";
import EnterAmount from "./steps/EnterAmount.js";
import ConfirmOrder from "./steps/ConfirmOrder.js";
import LoadingState from "./steps/LoadingState.js";
import SuccessState from "./steps/SuccessState.js";
import ClosePanel from "./steps/ClosePanel.js";

const OrderPanel = ({ onClose, currentSymbol = "BTC-USDT", apiKey, selectedTimeframe }) => {
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
  const { isMin } = getArgs();

  useEffect(() => {
    if (isMin) {
      expandPanelZellij(4);
      expandPanelTMUX(4);
      setTimeout(() => {
        console.clear();
      }, 200);
    }
  }, [isMin]);

  useInput((input, key) => {
    if (key.escape) {
      onClose();
      contractPanelZellij(4);
      contractPanelTMUX(4);
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
      contractPanelZellij(6);
      contractPanelTMUX(6);
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
    }
  }, [selectedPair, orderSide]);

  const fetchSymbolInfo = async () => {
    try {
      setError("");
      const symbolParams = await exchanges.kucoin.getSymbolParams(selectedPair);
      if (symbolParams) {
        setSymbolInfo(symbolParams);
      } else {
        setError("Failed to fetch symbol information");
      }
    } catch (err) {
      setError("Failed to fetch symbol information");
      console.error("Symbol info error:", err);
    }
  };

  const fetchCurrentPrice = async () => {
    try {
      const priceData = await exchanges.kucoin.getPrice(selectedPair);
      const price = orderSide === "buy" ? priceData.bestAsk : priceData.bestBid;
      setCurrentPrice(price);
    } catch (err) {
      setError("Failed to fetch current price");
    }
  };

  const fetchBalance = async () => {
    try {
      const currency =
        orderSide === "buy" ? "USDT" : selectedPair.split("-")[0];

      const balance = await exchanges.kucoin.getBalance(currency);
      setAvailableBalance(balance || 0);
    } catch (err) {
      setError("Failed to fetch balance");
      console.error("Balance error:", err);
    }
  };

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

  const handlePairSelect = (item) => {
    setSelectedPair(item.pair);
    setStep("selectSide");
  };

  const handleSideSelect = (item) => {
    if (item.value === "close") {
      setStep("closePosition");
      return;
    }
    
    setOrderSide(item.value);
    setStep("enterAmount");
  };

  const handleAmountSubmit = () => {
    if (parseFloat(amount) > 0) {
      if (parseFloat(amount) > availableBalance) {
        setError("Insufficient balance");
        return;
      }
      setStep("confirm");
    }
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (success) {
    return <SuccessState message={success} />;
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
        <Text dimColor color="gray">
          Press ESC to cancel
        </Text>
      </Box>
    </Box>
  );
};

export default OrderPanel;