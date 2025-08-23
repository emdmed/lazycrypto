// components/CryptoData.js

import React, { useState, useEffect, createElement } from 'react';
import { Box, Text, useInput } from 'ink';
import SelectInput from 'ink-select-input';
import Spinner from 'ink-spinner';
import axios from 'axios';
import { calculateIndicators } from '../utils/indicators/indicators.js';

const REFETCH_INTERVAL = 120000

// Mapping between display info, tickers, and API identifiers
const cryptoOptions = [
  { label: 'Bitcoin (BTC)', value: 'bitcoin', ticker: 'BTC', apiCode: 'BTC' },
  { label: 'Ethereum (ETH)', value: 'ethereum', ticker: 'ETH', apiCode: 'ETH' },
  { label: 'Cardano (ADA)', value: 'cardano', ticker: 'ADA', apiCode: 'ADA' },
  { label: 'Solana (SOL)', value: 'solana', ticker: 'SOL', apiCode: 'SOL' },
  { label: 'Polygon (MATIC)', value: 'matic-network', ticker: 'MATIC', apiCode: 'MATIC' },
  { label: 'Chainlink (LINK)', value: 'chainlink', ticker: 'LINK', apiCode: 'LINK' },
  { label: 'Avalanche (AVAX)', value: 'avalanche-2', ticker: 'AVAX', apiCode: 'AVAX' },
  { label: 'Polkadot (DOT)', value: 'polkadot', ticker: 'DOT', apiCode: 'DOT' }
];

// Function to clear terminal
const clearTerminal = () => {
  process.stdout.write('\x1B[2J\x1B[0f');
};

const CryptoData = ({ crypto: initialCrypto, ticker: initialTicker, onBack }) => {
  const [currentCrypto, setCurrentCrypto] = useState(initialCrypto);
  const [currentTicker, setCurrentTicker] = useState(initialTicker);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCryptoMenu, setShowCryptoMenu] = useState(false);
  const [historicalData, setHistoricalData] = useState([]);
  const [historicalLoading, setHistoricalLoading] = useState(false);
  const [indicators, setIndicators] = useState(null);
  // Indicators are always shown when available - no toggle needed

  // Update crypto when prop changes
  useEffect(() => {
    if (initialCrypto && initialCrypto !== currentCrypto) {
      setCurrentCrypto(initialCrypto);
      setCurrentTicker(initialTicker);
      setData(null);
      setLoading(true);
      setError(null);
      setHistoricalData([]);
      setIndicators(null);
    }
  }, [initialCrypto, initialTicker, currentCrypto]);

  // Handle keyboard input (only if onBack is provided - for single crypto mode)
  useInput((input, key) => {
    if (!onBack) return; // Skip input handling in multi-crypto mode
    
    if (input === 's' || input === 'S') {
      setShowCryptoMenu(!showCryptoMenu);
    } else if (input === 'b' || input === 'B') {
      onBack();
    } else if (input === 'q' || input === 'Q' || (key.ctrl && input === 'c')) {
      process.exit(0);
    }
  });

  const handleCryptoSelect = (item) => {
    clearTerminal(); // Clear terminal when switching crypto
    setCurrentCrypto(item.value);
    setCurrentTicker(item.ticker);
    setShowCryptoMenu(false);
    setData(null);
    setLoading(true);
    setError(null);
    setHistoricalData([]);
    setIndicators(null);
  };

  // Helper function to get API code for the current crypto
  const getApiCode = (cryptoId) => {
    const cryptoInfo = cryptoOptions.find(option => option.value === cryptoId);
    return cryptoInfo ? cryptoInfo.apiCode : cryptoId.toUpperCase();
  };

  // Helper function to get ticker for the current crypto
  const getTicker = (cryptoId) => {
    const cryptoInfo = cryptoOptions.find(option => option.value === cryptoId);
    return cryptoInfo ? cryptoInfo.ticker : cryptoId.toUpperCase();
  };
  
  const fetchHistoricalData = async () => {
    if (!currentCrypto) return;
    
    try {
      setHistoricalLoading(true);
      setError(null);
      
      const apiKey = process.env.LIVECOINWATCH_API_KEY;
      if (!apiKey || apiKey === 'your-api-key-here') {
        setError('Please set your LIVECOINWATCH_API_KEY environment variable');
        return;
      }
      
      const apiCode = getApiCode(currentCrypto);
      
      // Calculate timestamps - get last 7 days of data for better indicators
      const now = Date.now();
      const sevenDaysAgo = now - (7 * 24 * 60 * 60 * 1000);
      
      console.log(`Fetching historical data for ${apiCode}`);
      
      // LiveCoinWatch history endpoint
      const response = await axios.post(
        'https://api.livecoinwatch.com/coins/single/history',
        {
          currency: 'USD',
          code: apiCode,
          start: sevenDaysAgo,
          end: now,
          meta: true
        },
        {
          headers: {
            'content-type': 'application/json',
            'x-api-key': apiKey
          }
        }
      );
      
      const historyArray = response.data?.history || [];
      console.log(`Received ${historyArray.length} historical data points`);
      
      if (historyArray.length === 0) {
        console.log('No history data returned from API');
        setHistoricalData([]);
        setIndicators(null);
        return;
      }
      
      // Process the data points and convert to OHLCV format for indicators
      // Note: LiveCoinWatch only provides price, so we'll use price for OHLC
      const processedData = historyArray.map(point => [
        point.date,           // timestamp
        point.rate,           // open (using rate)
        point.rate,           // high (using rate)
        point.rate,           // low (using rate)  
        point.rate,           // close (using rate)
        point.volume || 0     // volume
      ]);
      
      // Sort by timestamp
      const sortedData = processedData.sort((a, b) => a[0] - b[0]);
      
      console.log(`Processed ${sortedData.length} final data points`);
      setHistoricalData(sortedData);
      
      // Calculate indicators if we have enough data
      if (sortedData.length >= 100) { // Need at least 200 points for SMA200
        try {
          const calculatedIndicators = calculateIndicators(sortedData);
          setIndicators(calculatedIndicators);
          console.log('Indicators calculated successfully');
        } catch (indicatorError) {
          console.error('Error calculating indicators:', indicatorError);
          setIndicators(null);
        }
      } else {
        console.log(`Not enough data for indicators (${sortedData.length} points, need 200+)`);
        setIndicators(null);
      }
      
    } catch (error) {
      console.error('Error fetching historical data:', error);
      setError(`Failed to fetch historical data: ${error.message}`);
      setHistoricalData([]);
      setIndicators(null);
    } finally {
      setHistoricalLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!currentCrypto) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const apiKey = process.env.LIVECOINWATCH_API_KEY;
        
        if (!apiKey || apiKey === 'your-api-key-here') {
          setError('Please set your LIVECOINWATCH_API_KEY environment variable');
          return;
        }
        
        // Get the correct API code for the current crypto
        const apiCode = getApiCode(currentCrypto);
        
        // Using LiveCoinWatch API with dynamic crypto code
        const response = await axios.post(
          'https://api.livecoinwatch.com/coins/single',
          {
            currency: 'USD',
            code: apiCode,
            meta: true
          },
          {
            headers: {
              'content-type': 'application/json',
              'x-api-key': apiKey
            }
          }
        );
        
        setData(response.data);
        
        // Fetch historical data for indicators
        await fetchHistoricalData();
        
      } catch (err) {
        if (err.response?.status === 401) {
          setError('Invalid API key. Check your LIVECOINWATCH_API_KEY.');
        } else if (err.response?.status === 429) {
          setError('API rate limit exceeded. Please try again later.');
        } else if (err.response?.status === 400) {
          setError(`Invalid request. Check if crypto code '${getApiCode(currentCrypto)}' is supported.`);
        } else {
          setError(`Failed to fetch crypto data: ${err.message}`);
        }
        console.error('API Error:', err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // Refresh data every 2 minutes
    const interval = setInterval(fetchData, REFETCH_INTERVAL);
    
    return () => clearInterval(interval);
  }, [currentCrypto]);

  const formatPrice = (price) => {
    return `$${price.toLocaleString("ES", {
      maximumFractionDigits: 2
    })}`;
  };

  const formatPercentage = (delta) => {
    if (!delta) return React.createElement(Text, { color: 'gray' }, '0.0%');
    
    // Convert LiveCoinWatch delta format (1 = no change) to percentage
    const percentage = (delta - 1) * 100;
    const color = percentage >= 0 ? 'green' : 'red';
    const sign = percentage >= 0 ? '+' : '';
    return React.createElement(Text, { color }, `${sign}${percentage.toFixed(1)}%`);
  };

  const formatMarketCap = (marketCap) => {
    if (!marketCap) return '$0';
    if (marketCap >= 1e12) {
      return `$${(marketCap / 1e12).toFixed(1)}T`;
    } else if (marketCap >= 1e9) {
      return `$${(marketCap / 1e9).toFixed(1)}B`;
    } else if (marketCap >= 1e6) {
      return `$${(marketCap / 1e6).toFixed(0)}M`;
    }
    return `$${(marketCap / 1000).toFixed(0)}K`;
  };

  const formatIndicatorValue = (value) => {
    if (Array.isArray(value)) {
      return value[value.length - 1]?.toFixed(2) || 'N/A';
    }
    return typeof value === 'number' ? value.toFixed(2) : 'N/A';
  };

  const getLatestValue = (indicatorData) => {
    if (!indicatorData) return null;
    if (Array.isArray(indicatorData)) {
      return indicatorData[indicatorData.length - 1] || null;
    }
    return indicatorData;
  };

  const getMACDValue = (macdData) => {
    if (!macdData || !macdData.macd || !Array.isArray(macdData.macd) || macdData.macd.length === 0) {
      return null;
    }
    return macdData.macd[macdData.macd.length - 1];
  };

  const getIndicatorColor = (indicator, value) => {
    if (!value || typeof value !== 'number') return 'gray';
    
    switch (indicator) {
      case 'rsi':
        if (value > 70) return 'red';      // Overbought
        if (value < 30) return 'green';    // Oversold
        return 'yellow';
      case 'macd':
        return value > 0 ? 'green' : 'red';
      default:
        return 'cyan';
    }
  };

  if (loading) {
    return React.createElement(Box, { 
      width: '100%',
      minWidth: 60,
      borderStyle: "round", 
      borderColor: "gray", 
      padding: 1,
      justifyContent: "center"
    },
      React.createElement(Box, { flexDirection: "row" },
        React.createElement(Spinner, { type: "dots" }),
        React.createElement(Text, { color: "yellow", marginLeft: 1 }, 
          `Loading ${currentTicker || getTicker(currentCrypto)} data...`
        )
      )
    );
  }

  if (error) {
    return React.createElement(Box, { 
      width: '100%',
      minWidth: 60,
      borderStyle: "round", 
      borderColor: "red", 
      padding: 1,
      justifyContent: "center"
    },
      React.createElement(Text, { color: "red" }, `❌ ${error}`)
    );
  }

  if (showCryptoMenu) {
    return React.createElement(Box, { flexDirection: "column" },
      React.createElement(Box, { marginBottom: 1 },
        React.createElement(Text, { bold: true, color: "cyan" }, "🚀 Select Cryptocurrency")
      ),
      React.createElement(SelectInput, { 
        items: cryptoOptions, 
        onSelect: handleCryptoSelect,
        initialIndex: cryptoOptions.findIndex(option => option.value === currentCrypto)
      }),
      React.createElement(Box, { marginTop: 1 },
        React.createElement(Text, { dimColor: true }, "Press 'S' to cancel selection")
      )
    );
  }

  if (!data) return null;

  // Use the ticker prop if available, otherwise derive from crypto ID
  const displayTicker = currentTicker || getTicker(currentCrypto);

  // Main crypto display
  const mainDisplay = React.createElement(Box, { 
    width: '100%',
    minWidth: 60,
    borderStyle: "round", 
    borderColor: "cyan", 
    padding: 0,
    flexDirection: "column"
  },
    // Row 1: Name, Symbol, Rank, and Price
    React.createElement(Box, { justifyContent: "space-between" },
      React.createElement(Box, { flexDirection: "row" },
        React.createElement(Text, { bold: true, color: "cyan" }, data.name || 'Unknown'),
        React.createElement(Text, { color: "gray", marginLeft: 1 }, `(${displayTicker})`),
        React.createElement(Box, { flexDirection: "row", marginLeft: 1 },
          React.createElement(Text, { bold: true, color: "yellow" }, formatPrice(data.rate))
        ),
        React.createElement(Box, { flexDirection: "row", marginLeft: 2 },
          React.createElement(Text, { dimColor: true, marginLeft: 1 }, "24h: "),
          formatPercentage(data.delta?.day) ,
        ),
        React.createElement(Box, {flexDirection: "row", marginLeft: 2}, 
          React.createElement(Text, { dimColor: true}, "7d: "),
          formatPercentage(data.delta?.week)
        )
      ),
    ),
    
    // Row 2: Controls and status
    React.createElement(Box, { justifyContent: "space-between", marginTop: 1 },
      React.createElement(Box, { flexDirection: "row" },
        React.createElement(Text, { dimColor: true }, "Press 'S' for crypto menu"),
        historicalLoading && React.createElement(Box, { flexDirection: "row", marginLeft: 2 },
          React.createElement(Spinner, { type: "dots" }),
          React.createElement(Text, { color: "yellow", marginLeft: 1 }, "Loading indicators...")
        )
      ),
      React.createElement(Box, { flexDirection: "row" },
        React.createElement(Text, { dimColor: true }, `Data points: ${historicalData.length}`),
        indicators && React.createElement(Text, { color: "green", marginLeft: 2 }, "✓ Indicators ready")
      )
    )
  );

  // Indicators display - always visible when available
  const indicatorsDisplay = indicators ? React.createElement(Box, {
    width: '100%',
    minWidth: 60,
    borderStyle: "round",
    borderColor: "green",
    padding: 1,
    flexDirection: "column",
    marginTop: 1
  },
    React.createElement(Text, { bold: true, color: "green", marginBottom: 1 }, "📊 Technical Indicators"),
    
    // RSI and MACD
    React.createElement(Box, { flexDirection: "row", justifyContent: "space-between" },
      React.createElement(Box, { flexDirection: "row" },
        React.createElement(Text, { dimColor: true }, "RSI(20): "),
        React.createElement(Text, { 
          color: indicators.rsi ? getIndicatorColor('rsi', getLatestValue(indicators.rsi)) : 'gray' 
        }, formatIndicatorValue(indicators.rsi))
      ),
      React.createElement(Box, { flexDirection: "row" },
        React.createElement(Text, { dimColor: true }, "MACD: "),
        React.createElement(Text, { 
          color: indicators.macd ? getIndicatorColor('macd', getMACDValue(indicators.macd)) : 'gray' 
        }, getMACDValue(indicators.macd)?.toFixed(2) || 'N/A')
      )
    ),
    
    // Moving Averages
    React.createElement(Box, { flexDirection: "column", marginTop: 1 },
      React.createElement(Text, { dimColor: true, marginBottom: 1 }, "Moving Averages:"),
      React.createElement(Box, { flexDirection: "row", justifyContent: "space-between" },
        React.createElement(Text, { color: "cyan" }, `EMA9: ${formatIndicatorValue(indicators.ema9)}`),
        React.createElement(Text, { color: "cyan" }, `EMA21: ${formatIndicatorValue(indicators.ema21)}`),
        React.createElement(Text, { color: "cyan" }, `EMA50: ${formatIndicatorValue(indicators.ema50)}`)
      ),
      React.createElement(Box, { flexDirection: "row", justifyContent: "space-between", marginTop: 1 },
        React.createElement(Text, { color: "magenta" }, `SMA Fast: ${formatIndicatorValue(indicators.smaFast)}`),
        React.createElement(Text, { color: "magenta" }, `SMA Slow: ${formatIndicatorValue(indicators.smaSlow)}`),
        React.createElement(Text, { color: "magenta" }, `SMA200: ${formatIndicatorValue(indicators.sma200)}`)
      )
    ),
    
    // Bollinger Bands and ATR
    React.createElement(Box, { flexDirection: "row", justifyContent: "space-between", marginTop: 1 },
      React.createElement(Box, { flexDirection: "column" },
        React.createElement(Text, { dimColor: true }, "Bollinger Bands:"),
        React.createElement(Text, { color: "yellow" }, `Upper: ${formatIndicatorValue(indicators.bb?.upper)}`),
        React.createElement(Text, { color: "yellow" }, `Middle: ${formatIndicatorValue(indicators.bb?.middle)}`),
        React.createElement(Text, { color: "yellow" }, `Lower: ${formatIndicatorValue(indicators.bb?.lower)}`)
      ),
      React.createElement(Box, { flexDirection: "column" },
        React.createElement(Text, { dimColor: true }, "Other:"),
        React.createElement(Text, { color: "white" }, `ATR: ${formatIndicatorValue(indicators.atr)}`),
        React.createElement(Text, { color: "white" }, `Min(20): ${formatIndicatorValue(indicators.mmin)}`),
        React.createElement(Text, { color: "white" }, `Max(20): ${formatIndicatorValue(indicators.mmax)}`)
      )
    )
  ) : null;

  return React.createElement(Box, { flexDirection: "column" },
    mainDisplay,
    indicatorsDisplay
  );
};

export default CryptoData;