
import React, { useState, useEffect } from "react";
import { Box, Text, useInput } from "ink";
import TextInput from "ink-text-input";
import SelectInput from "ink-select-input";
import Spinner from "ink-spinner";
import axios from "axios";
import kucoin from "../exchanges/kucoin.js";
import {
  contractPanelZellij,
  expandPanelZellij,
} from "./CryptoData/terminals/zellij.js";
import {
  contractPanelTMUX,
  expandPanelTMUX,
} from "./CryptoData/terminals/tmux.js";
import { getArgs } from "../utils/getArgs.js";
import { formatPrice } from "../utils/formatters/formatters.js";

const OrderPanel = ({ onClose, currentSymbol = "BTC-USDT" }) => {
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

  const baseUrl = "https://api.kucoin.com";
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
    fetchTradingPairs();
  }, []);

  useEffect(() => {
    if (selectedPair) {
      fetchSymbolInfo();
      fetchCurrentPrice();
      fetchBalance();
    }
  }, [selectedPair, orderSide]);

  const availableCryptos = [
    { label: "Bitcoin (BTC)", value: "bitcoin", ticker: "BTC" },
    { label: "Monero (XMR)", value: "monero", ticker: "XMR" },
    { label: "Ethereum (ETH)", value: "ethereum", ticker: "ETH" },
    { label: "Cardano (ADA)", value: "cardano", ticker: "ADA" },
    { label: "Solana (SOL)", value: "solana", ticker: "SOL" },
    { label: "Polygon (MATIC)", value: "matic-network", ticker: "MATIC" },
    { label: "Chainlink (LINK)", value: "chainlink", ticker: "LINK" },
  ];

  const fetchTradingPairs = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/v1/symbols`);
      const availableTickers = availableCryptos.map((crypto) => crypto.ticker);

      const filteredPairs = response.data.data
        .filter((s) => {
          const ticker = s.symbol.split("-")[0];
          return (
            s.enableTrading &&
            s.symbol.endsWith("-USDT") &&
            availableTickers.includes(ticker)
          );
        })
        .map((s) => ({
          label: s.symbol,
          value: s.symbol,
        }));

      setPairs(filteredPairs);
    } catch (err) {
      console.error("Error fetching pairs:", err);
      const fallbackPairs = availableCryptos.map((crypto) => ({
        label: `${crypto.ticker}-USDT`,
        value: `${crypto.ticker}-USDT`,
      }));
      setPairs(fallbackPairs);
    }
  };

  const fetchSymbolInfo = async () => {
    try {
      setError("");
      const symbolParams = await kucoin.getSymbolParams(selectedPair);
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
      const priceData = await kucoin.fetchCurrentPrice(selectedPair);
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

      const balance = await kucoin.getAccountBalance(currency);
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
      const result = await kucoin.placeOrder(
        orderSide,
        currentPrice,
        parseFloat(amount),
        symbolInfo,
        selectedPair,
      );

      if (result && result.data && result.data.orderId) {
        setSuccess(
          `Order placed successfully! Order ID: ${result.data.orderId}`,
        );
      } else {
        setError("Failed to place order - no order ID returned");
      }
    } catch (error) {
      setError(error.message || "Failed to place order");
    }

    setIsLoading(false);
  };

  const handlePairSelect = (item) => {
    setSelectedPair(item.value);
    setStep("selectSide");
  };

  const handleSideSelect = (item) => {
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
    return (
      <Box
        flexDirection="column"
        padding={1}
        borderStyle="round"
        borderColor="yellow"
      >
        <Box>
          <Text color="yellow">
            <Spinner type="dots" /> Placing order...
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
          ═══ Place Order via Kucoin api ═══
        </Text>
      </Box>

      {error && (
        <Box marginBottom={1}>
          <Text color="red">⚠ {error}</Text>
        </Box>
      )}

      {step === "selectPair" && (
        <Box flexDirection="column">
          <Text color="yellow">Select Trading Pair:</Text>
          <Box marginTop={1}>
            <SelectInput
              items={pairs}
              onSelect={handlePairSelect}
              initialIndex={pairs.findIndex((p) => p.value === selectedPair)}
            />
          </Box>
        </Box>
      )}

      {step === "selectSide" && (
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
              ]}
              onSelect={handleSideSelect}
            />
          </Box>
        </Box>
      )}

      {step === "enterAmount" && (
        <Box flexDirection="column">
          <Text color="yellow">
            {orderSide === "buy" ? "Buying" : "Selling"} {selectedPair}
          </Text>
          {currentPrice && <Text>Current Price: {formatPrice(currentPrice)} USDT</Text>}
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
              onChange={setAmount}
              onSubmit={handleAmountSubmit}
              placeholder="0.00"
            />
          </Box>
        </Box>
      )}

      {step === "confirm" && (
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
            <Text color="gray">Place order? (Y/n)</Text>
          </Box>
        </Box>
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
