// components/CryptoData.js
import React, { useState, useEffect } from 'react';
import { useInput } from 'ink';
import {useCryptoData} from "../../hooks/useCryptoData.js"
import { cryptoOptions } from '../../constants/cryptoOptions.js';
import CryptoSelector from './CryptoSelector.js';
import CryptoDisplay from './CryptoDisplay.js';
import LoadingSpinner from './LoadingSpinner.js';
import ErrorDisplay from './ErrorDisplay.js';

const CryptoData = ({ crypto: initialCrypto, ticker: initialTicker, onBack }) => {
  const [currentCrypto, setCurrentCrypto] = useState(initialCrypto);
  const [currentTicker, setCurrentTicker] = useState(initialTicker);
  const [showCryptoMenu, setShowCryptoMenu] = useState(false);
  
  const {
    data,
    loading,
    error,
    historicalData,
    historicalLoading,
    indicators
  } = useCryptoData(currentCrypto);

  // Update crypto when prop changes
  useEffect(() => {
    if (initialCrypto && initialCrypto !== currentCrypto) {
      setCurrentCrypto(initialCrypto);
      setCurrentTicker(initialTicker);
    }
  }, [initialCrypto, initialTicker, currentCrypto]);

  // Handle keyboard input (only if onBack is provided - for single crypto mode)
  useInput((input, key) => {
    if (!onBack) return;
    
    if (input === 's' || input === 'S') {
      setShowCryptoMenu(!showCryptoMenu);
    } else if (input === 'b' || input === 'B') {
      onBack();
    } else if (input === 'q' || input === 'Q' || (key.ctrl && input === 'c')) {
      process.exit(0);
    }
  });

  const handleCryptoSelect = (item) => {
    // Clear terminal when switching crypto
    process.stdout.write('\x1B[2J\x1B[0f');
    setCurrentCrypto(item.value);
    setCurrentTicker(item.ticker);
    setShowCryptoMenu(false);
  };

  if (loading) {
    return React.createElement(LoadingSpinner, {ticker: currentTicker || getTicker(currentCrypto)})
   // return <LoadingSpinner ticker={currentTicker || getTicker(currentCrypto)} />;
  }

  if (error) {
    return React.createElement(ErrorDisplay, {error: error})
   // return <ErrorDisplay error={error} />;
  }

  if (showCryptoMenu) {
    return React.createElement(CryptoSelector, {cryptoOptions, currentCrypto, onSelect: handleCryptoSelect, onCancel: () => setShowCryptoMenu(false)})
    // return (
    //   <CryptoSelector
    //     cryptoOptions={cryptoOptions}
    //     currentCrypto={currentCrypto}
    //     onSelect={handleCryptoSelect}
    //     onCancel={() => setShowCryptoMenu(false)}
    //   />
    // );
  }

  if (!data) return null;

  return React.createElement(CryptoDisplay, {data, ticker: currentTicker || getTicker(currentCrypto), historicalData, indicators, onShowMenu: () => setShowCryptoMenu(true)})
  // return (
  //   <CryptoDisplay
  //     data={data}
  //     ticker={currentTicker || getTicker(currentCrypto)}
  //     historicalData={historicalData}
  //     historicalLoading={historicalLoading}
  //     indicators={indicators}
  //     onShowMenu={() => setShowCryptoMenu(true)}
  //   />
  // );
};

// Helper function to get ticker for the current crypto
const getTicker = (cryptoId) => {
  const cryptoInfo = cryptoOptions.find(option => option.value === cryptoId);
  return cryptoInfo ? cryptoInfo.ticker : cryptoId.toUpperCase();
};

export default CryptoData;