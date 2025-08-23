// hooks/useCryptoData.js
import { useState, useEffect } from 'react';
import axios from 'axios';
import { calculateIndicators } from '../utils/indicators/indicators.js';
import { cryptoOptions } from '../constants/cryptoOptions.js';

const REFETCH_INTERVAL = 120000;

export const useCryptoData = (currentCrypto) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  const [historicalLoading, setHistoricalLoading] = useState(false);
  const [indicators, setIndicators] = useState(null);

  const getApiCode = (cryptoId) => {
    const cryptoInfo = cryptoOptions.find(option => option.value === cryptoId);
    return cryptoInfo ? cryptoInfo.apiCode : cryptoId.toUpperCase();
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
      const now = Date.now();
      const sevenDaysAgo = now - (7 * 24 * 60 * 60 * 1000);
      
      console.log(`Fetching historical data for ${apiCode}`);
      
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
      if (sortedData.length >= 100) {
        try {
          const calculatedIndicators = calculateIndicators(sortedData);
          setIndicators(calculatedIndicators);
          console.log('Indicators calculated successfully');
        } catch (indicatorError) {
          console.error('Error calculating indicators:', indicatorError);
          setIndicators(null);
        }
      } else {
        console.log(`Not enough data for indicators (${sortedData.length} points, need 100+)`);
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
        
        const apiCode = getApiCode(currentCrypto);
        
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
    const interval = setInterval(fetchData, REFETCH_INTERVAL);
    return () => clearInterval(interval);
  }, [currentCrypto]);

  // Reset state when crypto changes
  useEffect(() => {
    setData(null);
    setLoading(true);
    setError(null);
    setHistoricalData([]);
    setIndicators(null);
  }, [currentCrypto]);

  return {
    data,
    loading,
    error,
    historicalData,
    historicalLoading,
    indicators
  };
};