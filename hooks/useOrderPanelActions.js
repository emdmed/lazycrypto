import { exchanges } from "../exchanges/exchanges.js";

export const useOrderpanelActions = ({
  setError,
  setStep,
  setOrderSide,
  setSelectedPair,
  setPairSelected,
  orderSide,
  setAvailableBalance,
  availableBalance,
  selectedPair,
  setCurrentPrice,
  setHasPosition,
  setSymbolInfo,
  hasPosition,
  amount
}) => {
  const handleAmountSubmit = () => {
    if (parseFloat(amount) > 0) {
      if (parseFloat(amount) > availableBalance) {
        setError("Insufficient balance");
        return;
      }
      setStep("confirm");
    }
  };

  const handleSideSelect = (item) => {
    if (item.value === "close") {
      if (!hasPosition) {
        setError("No position to close for this pair");
        return;
      }
      setStep("closePosition");
      return;
    }

    setOrderSide(item.value);
    setStep("enterAmount");
  };

  const handlePairSelect = (item) => {
    setSelectedPair(item.pair);
    setPairSelected(true);
    setStep("selectSide");
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

  const fetchUSDTBalance = async () => {
    try {
      const currency = "USDT"

      const balance = await exchanges.kucoin.getBalance(currency);
      setAvailableBalance(balance || 0);
    } catch (err) {
      setError("Failed to fetch balance");
      console.error("Balance error:", err);
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

  const checkPosition = async () => {
    try {
      const positions = await exchanges.kucoin.getPositions?.(selectedPair);
      const hasOpenPosition = positions && positions.length > 0 &&
        positions.some(pos => pos.size > 0 || pos.currentQty > 0);

      const baseCurrency = selectedPair.split("-")[0];
      const baseBalance = await exchanges.kucoin.getBalance(baseCurrency);

      setHasPosition(hasOpenPosition || (baseBalance && baseBalance > 0));
    } catch (err) {
      console.error("Error checking position:", err);
      setHasPosition(false);
    }
  };

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

  return {
    handleAmountSubmit,
    handleSideSelect,
    handlePairSelect,
    fetchBalance,
    fetchCurrentPrice,
    checkPosition,
    fetchSymbolInfo,
    fetchUSDTBalance
  }
} 
