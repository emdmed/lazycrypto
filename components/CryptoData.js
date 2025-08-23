import React, { useState, useEffect } from 'react';
import { Box, Text, useInput } from 'ink';
import SelectInput from 'ink-select-input';
import Spinner from 'ink-spinner';
import axios from 'axios';

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

  // Update crypto when prop changes
  useEffect(() => {
    if (initialCrypto && initialCrypto !== currentCrypto) {
      setCurrentCrypto(initialCrypto);
      setCurrentTicker(initialTicker);
      setData(null);
      setLoading(true);
      setError(null);
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
    
    // Refresh data every 30 seconds
    const interval = setInterval(fetchData, 30000);
    
    return () => clearInterval(interval);
  }, [currentCrypto]);

  const formatPrice = (price) => {
    if (!price) return '$0.00';
    if (price >= 1000) {
      return `$${(price / 1000).toFixed(1)}K`;
    } else if (price >= 1) {
      return `$${price.toFixed(2)}`;
    }
    return `$${price.toFixed(4)}`;
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

  // Compact full-width crypto card
  return React.createElement(Box, { 
    width: '100%',
    minWidth: 60,
    borderStyle: "round", 
    borderColor: "cyan", 
    padding: 1,
    flexDirection: "column"
  },
    // Row 1: Name, Symbol, Rank, and Price
    React.createElement(Box, { justifyContent: "space-between" },
      React.createElement(Box, { flexDirection: "row" },
        React.createElement(Text, { bold: true, color: "cyan" }, data.name || 'Unknown'),
        React.createElement(Text, { color: "gray", marginLeft: 1 }, `(${displayTicker})`)
      ),
      React.createElement(Box, { flexDirection: "row" },
        React.createElement(Text, { color: "gray", marginRight: 1 }, `#${data.rank || 'N/A'}`),
        React.createElement(Text, { bold: true, color: "yellow" }, formatPrice(data.rate))
      )
    ),
    
    // Row 2: Changes and Market Data
    React.createElement(Box, { justifyContent: "space-between", marginTop: 1 },
      React.createElement(Box, { flexDirection: "row" },
        React.createElement(Text, { dimColor: true }, "24h: "),
        formatPercentage(data.delta?.day),
        React.createElement(Text, { dimColor: true, marginLeft: 2 }, "7d: "),
        formatPercentage(data.delta?.week)
      ),
      React.createElement(Box, { flexDirection: "row" },
        React.createElement(Text, { dimColor: true }, `MC: ${formatMarketCap(data.cap)}`),
        React.createElement(Text, { dimColor: true, marginLeft: 2 }, `Vol: ${formatMarketCap(data.volume)}`),
        React.createElement(Text, { 
          dimColor: true, 
          color: data.rate === data.allTimeHighUSD ? "green" : "gray",
          marginLeft: 2
        }, 
          data.rate === data.allTimeHighUSD ? "ATH!" : "ATH"
        )
      )
    )
  );
};

export default CryptoData;