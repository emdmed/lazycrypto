import { useState, useEffect } from 'react';
import axios from 'axios';
import { calculateIndicators } from '../utils/indicators/indicators.js';
import { cryptoOptions } from '../constants/cryptoOptions.js';

const REFETCH_INTERVAL = 15 * 60 * 1000;

export const useCryptoData = (currentCrypto, apiKey) => {
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
      
      if (!apiKey) {
        setError('Please set your LiveCoinWatch api key');
        return;
      }
      
      const apiCode = getApiCode(currentCrypto);
      const now = Date.now();
      const sevenDaysAgo = now - (7 * 24 * 60 * 60 * 1000);
            
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
      
      if (historyArray.length === 0) {
        setHistoricalData([]);
        setIndicators(null);
        return;
      }
      
      const processedData = historyArray.map(point => [
        point.date,           
        point.rate,           
        point.rate,           
        point.rate,           
        point.rate,          
        point.volume || 0    
      ]);
      
      const sortedData = processedData.sort((a, b) => a[0] - b[0]);
      
      setHistoricalData(sortedData);
      
      if (sortedData.length >= 100) {
        try {
          const calculatedIndicators = calculateIndicators(sortedData);
          setIndicators(calculatedIndicators);
        } catch (indicatorError) {
          console.error('Error calculating indicators:', indicatorError);
          setIndicators(null);
        }
      } else {
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
                
        if (!apiKey) {
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
  }, [currentCrypto, apiKey]);

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