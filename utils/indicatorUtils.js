// utils/indicatorUtils.js

export const formatIndicatorValue = (value) => {
  if (Array.isArray(value)) {
    return value[value.length - 1]?.toFixed(2) || 'N/A';
  }
  return typeof value === 'number' ? value.toFixed(2) : 'N/A';
};

export const getLatestValue = (indicatorData) => {
  if (!indicatorData) return null;
  if (Array.isArray(indicatorData)) {
    return indicatorData[indicatorData.length - 1] || null;
  }
  return indicatorData;
};

export const getMACDValue = (macdData) => {
  if (!macdData || !macdData.macd || !Array.isArray(macdData.macd) || macdData.macd.length === 0) {
    return null;
  }
  return macdData.macd[macdData.macd.length - 1];
};

export const getIndicatorColor = (indicator, value) => {
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