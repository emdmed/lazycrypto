import { useState, useEffect } from "react";
import axios from "axios";
import { calculateIndicators } from "../utils/indicators/indicators.js";
import { cryptoOptions } from "../constants/cryptoOptions.js";

const REFETCH_INTERVAL = 15 * 60 * 1000;

const TIMEFRAMES_START_DATE_FACTOR = {
  "15min": 26,
  "30min": 52,
  "1hour": 102,
  "4hour": 408,
};

export const useCryptoData = (currentCrypto, apiKey, selectedTimeframe) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  const [historicalLoading, setHistoricalLoading] = useState(false);
  const [indicators, setIndicators] = useState(null);

  const getApiCode = (cryptoId) => {
    const cryptoInfo = cryptoOptions.find(
      (option) => option.value === cryptoId,
    );
    return cryptoInfo ? cryptoInfo.apiCode : cryptoId.toUpperCase();
  };

  const getKuCoinSymbol = (cryptoId) => {
    const cryptoInfo = cryptoOptions.find(
      (option) => option.value === cryptoId,
    );
    const symbol = cryptoInfo ? cryptoInfo.ticker : cryptoId.toUpperCase();

    if (symbol === "BTC") return "BTC-USDT";
    if (symbol === "ETH") return "ETH-USDT";
    if (symbol === "ADA") return "ADA-USDT";
    if (symbol === "DOT") return "DOT-USDT";
    if (symbol === "SOL") return "SOL-USDT";

    return `${symbol}-USDT`;
  };

  const fetchHistoricalData = async () => {
    if (!currentCrypto) return;

    try {
      setHistoricalLoading(true);
      setError(null);

      const kuCoinSymbol = getKuCoinSymbol(currentCrypto);
      const now = Math.floor(Date.now() / 1000);
      const hoursAgo = now - (TIMEFRAMES_START_DATE_FACTOR[selectedTimeframe] || 102) * 60 * 60;

      const klineResponse = await axios.get(
        "https://api.kucoin.com/api/v1/market/candles",
        {
          params: {
            symbol: kuCoinSymbol,
            type: selectedTimeframe,
            startAt: hoursAgo,
            endAt: now,
          },
        },
      );

      const klineData = klineResponse.data?.data || [];

      if (klineData.length === 0) {
        setHistoricalData([]);
        setIndicators(null);
        return;
      }

      const processedData = klineData.map((candle) => {
        const [timestamp, open, close, high, low, volume, amount] = candle;
        const timestampMs = parseInt(timestamp) * 1000; // Convert to milliseconds

        return [
          timestampMs, // [0] timestamp in ms
          parseFloat(open), // [1] open price
          parseFloat(high), // [2] high price
          parseFloat(low), // [3] low price
          parseFloat(close), // [4] close price
          parseFloat(volume), // [5] volume
        ];
      });

      const sortedData = processedData.sort((a, b) => a[0] - b[0]);

      setHistoricalData(sortedData);

      if (sortedData.length >= 101) {
        try {
          const calculatedIndicators = calculateIndicators(sortedData);
          setIndicators(calculatedIndicators);
        } catch (indicatorError) {
          console.error("Error calculating indicators:", indicatorError);
          setIndicators(null);
        }
      } else {
        setIndicators(null);
      }
    } catch (error) {
      console.error("Error fetching KuCoin historical data:", error);
      setError(`Failed to fetch historical data from KuCoin: ${error.message}`);
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
          setError(
            "Please set your LIVECOINWATCH_API_KEY environment variable",
          );
          return;
        }

        const apiCode = getApiCode(currentCrypto);

        const response = await axios.post(
          "https://api.livecoinwatch.com/coins/single",
          {
            currency: "USD",
            code: apiCode,
            meta: true,
          },
          {
            headers: {
              "content-type": "application/json",
              "x-api-key": apiKey,
            },
          },
        );

        setData(response.data);

        await fetchHistoricalData();
      } catch (err) {
        if (err.response?.status === 401) {
          setError("Invalid API key. Check your LIVECOINWATCH_API_KEY.");
        } else if (err.response?.status === 429) {
          setError("API rate limit exceeded. Please try again later.");
        } else if (err.response?.status === 400) {
          setError(
            `Invalid request. Check if crypto code '${getApiCode(currentCrypto)}' is supported.`,
          );
        } else {
          setError(`Failed to fetch crypto data: ${err.message}`);
        }
        console.error("API Error:", err.response?.data || err.message);
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
    indicators,
  };
};
