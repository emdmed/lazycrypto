import React, { useState, useEffect } from "react";
import { useInput } from "ink";
import { useCryptoData } from "../../hooks/useCryptoData.js";
import { cryptoOptions } from "../../constants/cryptoOptions.js";
import CryptoSelector from "./CryptoSelector.js";
import CryptoDisplay from "./CryptoDisplay.js";
import LoadingSpinner from "./LoadingSpinner.js";
import ErrorDisplay from "./ErrorDisplay.js";
import CryptoDisplayMini from "./CryptoDisplayMini.js";
import { getArgs } from "../../utils/getArgs.js";

const CryptoData = ({
  crypto: initialCrypto,
  ticker: initialTicker,
  onBack,
  apiKey,
  selectedTimeframe,
  isTradesVisible
}) => {
  const [currentCrypto, setCurrentCrypto] = useState(initialCrypto);
  const [currentTicker, setCurrentTicker] = useState(initialTicker);
  const [showCryptoMenu, setShowCryptoMenu] = useState(false);

  const { isMin } = getArgs();

  const {
    data,
    loading,
    error,
    historicalData,
    indicators,
  } = useCryptoData(currentCrypto, apiKey, selectedTimeframe);

  useEffect(() => {
    if (initialCrypto && initialCrypto !== currentCrypto) {
      setCurrentCrypto(initialCrypto);
      setCurrentTicker(initialTicker);
    }
  }, [initialCrypto, initialTicker, currentCrypto]);

  const handleCryptoSelect = (item) => {
    process.stdout.write("\x1B[2J\x1B[0f");
    setCurrentCrypto(item.value);
    setCurrentTicker(item.ticker);
    setShowCryptoMenu(false);
  };

  if (loading) {
    return (
      <LoadingSpinner ticker={currentTicker || getTicker(currentCrypto)} />
    );
  }

  if (error) {
    return <ErrorDisplay error={error} />;
  }

  if (showCryptoMenu) {
    return (
      <CryptoSelector
        cryptoOptions={cryptoOptions}
        currentCrypto={currentCrypto}
        onSelect={handleCryptoSelect}
        onCancel={() => setShowCryptoMenu(false)}
      />
    );
  }

  if (!data) return null;

  if (isMin)
    return (
      <CryptoDisplayMini
        data={data}
        ticker={currentTicker || getTicker(currentCrypto)}
        historicalData={historicalData}
        indicators={indicators}
        onShowMenu={() => setShowCryptoMenu(true)}
      />
    );

  return (
    <CryptoDisplay
      data={data}
      ticker={currentTicker || getTicker(currentCrypto)}
      historicalData={historicalData}
      indicators={indicators}
      onShowMenu={() => setShowCryptoMenu(true)}
      isTradesVisible={isTradesVisible}
    />
  );
};

const getTicker = (cryptoId) => {
  const cryptoInfo = cryptoOptions.find((option) => option.value === cryptoId);
  return cryptoInfo ? cryptoInfo.ticker : cryptoId.toUpperCase();
};

export default CryptoData;
