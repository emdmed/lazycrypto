import axios from "axios";
import { formatPrice } from "../utils//formatters/formatters.js"

const TIMEFRAMES_START_DATE_FACTOR = {
  "15min": 26,
  "30min": 52,
  "1hour": 102,
  "4hour": 408,
};

const getKuCoinSymbol = (cryptoId) => {
  if (cryptoId === "BTC") return "BTC-USDT";
  if (cryptoId === "ETH") return "ETH-USDT";
  if (cryptoId === "ADA") return "ADA-USDT";
  if (cryptoId === "DOT") return "DOT-USDT";
  if (cryptoId === "SOL") return "SOL-USDT";
  return `${cryptoId}-USDT`;
};

const createCandleVisualization = (historicalData) => {
  const allCandles = historicalData.slice(-12); // Show last 12 candles
  const closes = allCandles.map(candle => candle[4]);
  const highs = allCandles.map(candle => candle[2]);
  const lows = allCandles.map(candle => candle[3]);

  const highestCloseIndex = closes.indexOf(Math.max(...closes));
  const lowestCloseIndex = closes.indexOf(Math.min(...closes));
  const highestHighIndex = highs.indexOf(Math.max(...highs));
  const lowestLowIndex = lows.indexOf(Math.min(...lows));

  let visualization = "";

  allCandles.forEach((candle, index) => {
    const open = candle[1];
    const close = candle[4];
    const isHighestClose = index === highestCloseIndex;
    const isLowestClose = index === lowestCloseIndex;
    const isHighestHigh = index === highestHighIndex;
    const isLowestLow = index === lowestLowIndex;

    let indicator = "|";
    const prevClose = allCandles[index - 1]?.[4];

    if (prevClose && close > prevClose) indicator = "/";
    if (prevClose && close < prevClose) indicator = "\\";
    if (isHighestClose) indicator = "C";
    if (isHighestHigh) indicator = "h";
    if (isHighestClose && isHighestHigh) indicator = "B";
    if (isLowestClose) indicator = "c";
    if (isLowestLow) indicator = "l";
    if (isLowestClose && isLowestLow) indicator = "T";

    visualization += indicator;
  });

  return visualization;
};

export const fetchBitcoinPrice = async (selectedTimeframe = "1hour") => {
  try {
    const kuCoinSymbol = getKuCoinSymbol("BTC");
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
        timeout: 8000, // 8 second timeout
      },
    );

    const klineData = klineResponse.data?.data || [];

    if (klineData.length === 0) {
      console.log("Bitcoin No Data");
      return;
    }

    const processedData = klineData.map((candle) => {
      const [timestamp, open, close, high, low, volume, amount] = candle;
      const timestampMs = parseInt(timestamp) * 1000;

      return [
        timestampMs,
        parseFloat(open),
        parseFloat(high),
        parseFloat(low),
        parseFloat(close),
        parseFloat(volume),
      ];
    });

    const sortedData = processedData.sort((a, b) => a[0] - b[0]);
    const currentPrice = sortedData[sortedData.length - 1][4];
    const prevPrice = sortedData[sortedData.length - 2][4];

    // Calculate price change for display
    const priceChange = currentPrice - prevPrice;
    //const changeSymbol = priceChange >= 0 ? '▲' : '▼';
    const changePercent = ((priceChange / prevPrice) * 100).toFixed(2);

    // Format price nicely - shorter for waybar
    const formattedPrice = formatPrice(currentPrice)
    // Create candle visualization
    const candleChart = createCandleVisualization(sortedData);

    // Output with candle chart
    console.log(`₿ ${formattedPrice} ${changePercent}% ${candleChart}`);


  } catch (error) {
    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      console.log("₿ Connection Error");
    } else if (error.response?.status === 429) {
      console.log("₿ Rate Limited");
    } else {
      console.log("₿ Error");
    }
    // Don't log error details in waybar output
    process.stderr.write(`Bitcoin error: ${error.message}\n`);
  }
};
