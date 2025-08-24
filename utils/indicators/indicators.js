// utils/indicators/indicators.js
import indicators from "indicatorts"

export const calculateIndicators = (historicalData) => {
    // Extract OHLCV data from the historical data array
    // historicalData format: [timestamp, open, high, low, close, volume]
    const closes = historicalData.map(candle => parseFloat(candle[4])); // close price
    const highs = historicalData.map(candle => parseFloat(candle[2]));   // high price
    const lows = historicalData.map(candle => parseFloat(candle[3]));    // low price
    const opens = historicalData.map(candle => parseFloat(candle[1]));   // open price
        
    try {
        // RSI - Relative Strength Index
        const rsi = indicators.rsi(closes, { period: 20 });
        
        // Bollinger Bands
        const bb = indicators.bb(closes, { period: 20 });
        
        // Exponential Moving Averages
        const ema9 = indicators.ema(closes, { period: 9 });
        const ema21 = indicators.ema(closes, { period: 21 });
        const ema50 = indicators.ema(closes, { period: 50 });
        const ema100 = indicators.ema(closes, { period: 100 });
        
        
        // MACD - Moving Average Convergence Divergence
        const macd = indicators.macd(closes, { fast: 12, slow: 26, signal: 9 });
        
        // Stochastic RSI
        const stochRsi = indicators.stoch(highs, lows, closes, { kPeriod: 14, dPeriod: 3 });
        
        // Average True Range
        const atr = indicators.atr(highs, lows, closes, { period: 50 });
        
        // Min/Max over period
        const mmin = indicators.mmin(lows, { period: 20 });
        const mmax = indicators.mmax(highs, { period: 20 });
        
        
        return { 
            bb, 
            rsi, 
            ema9, 
            ema21, 
            ema50, 
            ema100,
            macd, 
            stochRsi, 
            atr, 
            mmax, 
            mmin 
        };
        
    } catch (error) {
        console.error('Error calculating indicators:', error);
        throw error;
    }
};

// Helper function to get the latest value from an indicator array
export const getLatestValue = (indicatorArray) => {
    if (!indicatorArray || !Array.isArray(indicatorArray) || indicatorArray.length === 0) {
        return null;
    }
    return indicatorArray[indicatorArray.length - 1];
};

// Helper function to format indicator values for display
export const formatIndicator = (value, decimals = 2) => {
    if (value === null || value === undefined || isNaN(value)) {
        return 'N/A';
    }
    return Number(value).toFixed(decimals);
};

// Helper function to get signal strength based on RSI
export const getRSISignal = (rsi) => {
    const latestRSI = getLatestValue(rsi);
    if (latestRSI === null) return 'N/A';
    
    if (latestRSI > 70) return 'Overbought';
    if (latestRSI < 30) return 'Oversold';
    if (latestRSI > 50) return 'Bullish';
    return 'Bearish';
};

// Helper function to get MACD signal
export const getMACDSignal = (macd) => {
    if (!macd || !macd.macd || !macd.signal) return 'N/A';
    
    const latestMACD = getLatestValue(macd.macd);
    const latestSignal = getLatestValue(macd.signal);
    
    if (latestMACD === null || latestSignal === null) return 'N/A';
    
    if (latestMACD > latestSignal) return 'Bullish';
    return 'Bearish';
};

// Helper function to analyze moving average trend
export const getMASignal = (fastMA, slowMA) => {
    const latestFast = getLatestValue(fastMA);
    const latestSlow = getLatestValue(slowMA);
    
    if (latestFast === null || latestSlow === null) return 'N/A';
    
    if (latestFast > latestSlow) return 'Bullish';
    return 'Bearish';
};

// Comprehensive signal analysis
export const getOverallSignal = (indicators) => {
    let bullishSignals = 0;
    let bearishSignals = 0;
    let totalSignals = 0;
    
    // RSI Signal
    const rsiSignal = getRSISignal(indicators.rsi);
    if (rsiSignal === 'Bullish' || rsiSignal === 'Oversold') bullishSignals++;
    else if (rsiSignal === 'Bearish' || rsiSignal === 'Overbought') bearishSignals++;
    if (rsiSignal !== 'N/A') totalSignals++;
    
    // MACD Signal
    const macdSignal = getMACDSignal(indicators.macd);
    if (macdSignal === 'Bullish') bullishSignals++;
    else if (macdSignal === 'Bearish') bearishSignals++;
    if (macdSignal !== 'N/A') totalSignals++;
    
    // Moving Average Signal
    const maSignal = getMASignal(indicators.smaFast, indicators.smaSlow);
    if (maSignal === 'Bullish') bullishSignals++;
    else if (maSignal === 'Bearish') bearishSignals++;
    if (maSignal !== 'N/A') totalSignals++;
    
    if (totalSignals === 0) return 'Insufficient Data';
    
    const bullishRatio = bullishSignals / totalSignals;
    
    if (bullishRatio > 0.66) return 'Strong Bullish';
    if (bullishRatio > 0.33) return 'Neutral';
    return 'Strong Bearish';
};