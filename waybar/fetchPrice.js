import axios from "axios";
import { formatPrice } from "../utils//formatters/formatters.js"

const TIMEFRAMES_START_DATE_FACTOR = {
  "15min": 26,
  "30min": 52,
  "1hour": 102,
  "4hour": 408,
};

const COLORS = {
  green: "#5bf584",
  red: "#ff5959"
}

const getKuCoinSymbol = (cryptoId) => {
  if (cryptoId === "BTC") return "BTC-USDT";
  if (cryptoId === "ETH") return "ETH-USDT";
  if (cryptoId === "ADA") return "ADA-USDT";
  if (cryptoId === "DOT") return "DOT-USDT";
  if (cryptoId === "SOL") return "SOL-USDT";
  return `${cryptoId}-USDT`;
};

const createCandleVisualization = (historicalData, useColor = false) => {
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
    let color = "#94a3b8"; // Default slate gray
    const prevClose = allCandles[index - 1]?.[4];

    // Determine indicator and color based on price movement and significance
    if (prevClose && close > prevClose) {
      indicator = "/";
      color = COLORS.green; // Green for upward movement
    }
    if (prevClose && close < prevClose) {
      indicator = "\\";
      color = COLORS.red; // Red for downward movement
    }

    // Special indicators with single shade colors
    if (isHighestClose) {
      indicator = "C";
      color = COLORS.green; // Green for highest close
    }
    if (isHighestHigh) {
      indicator = "h";
      color = COLORS.green; // Green for highest high
    }
    if (isHighestClose && isHighestHigh) {
      indicator = "T";
      color = COLORS.green; // Green for top (highest close + high)
    }
    if (isLowestClose) {
      indicator = "c";
      color = COLORS.red; // Red for lowest close
    }
    if (isLowestLow) {
      indicator = "l";
      color = COLORS.red; // Red for lowest low
    }
    if (isLowestClose && isLowestLow) {
      indicator = "B";
      color = COLORS.red; // Red for bottom (lowest close + low)
    }

    visualization += useColor ? `<span color="${color}">${indicator}</span>` : indicator;
  });

  return visualization;
};

export const fetchPrice = async ({ selectedTimeframe = "1hour", symbol = "BTC", color = false }) => {
  try {
    const kuCoinSymbol = getKuCoinSymbol(symbol);
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
      console.log(color ? '<span color="#ff6b6b">Bitcoin No Data</span>' : 'Bitcoin No Data');
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
    const changePercent = ((priceChange / prevPrice) * 100).toFixed(2);

    // Format price nicely - shorter for waybar
    const formattedPrice = formatPrice(currentPrice);

    // Create candle visualization
    const candleChart = createCandleVisualization(sortedData, color);

    if (color) {
      // Color formatting based on price change
      const priceColor = priceChange >= 0 ? COLORS.green : COLORS.red; // Green for up, red for down
      const percentColor = priceChange >= 0 ? COLORS.green : COLORS.red; // Slightly different shades

      // Output with colored markup
      console.log(
        `<span>${symbol}</span> ` +
        `<span color="${priceColor}">${formattedPrice}</span> ` +
        `<span color="${percentColor}">${changePercent}%</span> ` +
        `${candleChart}`
      );
    } else {
      // Output without colors
      console.log(`${symbol} ${formattedPrice} ${changePercent}% ${candleChart}`);
    }

  } catch (error) {
    const errorMessages = {
      'ENOTFOUND': color ? '<span color="#ff6b6b">₿ Connection Error</span>' : '₿ Connection Error',
      'ECONNREFUSED': color ? '<span color="#ff6b6b">₿ Connection Error</span>' : '₿ Connection Error',
      '429': color ? '<span color="#fbbf24">₿ Rate Limited</span>' : '₿ Rate Limited',
      'default': color ? '<span color="#ff6b6b">₿ Error</span>' : '₿ Error'
    };

    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      console.log(errorMessages['ENOTFOUND']);
    } else if (error.response?.status === 429) {
      console.log(errorMessages['429']);
    } else {
      console.log(errorMessages['default']);
    }
    // Don't log error details in waybar output
    process.stderr.write(`Bitcoin error: ${error.message}\n`);
  }
};
