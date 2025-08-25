// utils/indicatorUtils.js

export const formatIndicatorValue = (value, decimalplaces) => {
  if (Array.isArray(value)) {
    return value[value.length - 1]?.toFixed(decimalplaces ?? 2) || 'N/A';
  }
  return typeof value === 'number' ? value.toFixed(decimalplaces ?? 2) : 'N/A';
};

export const getLatestValue = (indicatorData) => {
  if (!indicatorData) return null;
  if (Array.isArray(indicatorData)) {
    return indicatorData[indicatorData.length - 1] || null;
  }
  return indicatorData;
};

export const getPrevValue = (indicatorData) => {
  if (!indicatorData) return null;
  if (Array.isArray(indicatorData)) {
    return indicatorData[indicatorData.length - 2] || null;
  }
  return indicatorData;
};

export const getMACDValue = (macdData) => {
  if (!macdData || !Array.isArray(macdData) || macdData.length === 0) {
    return null;
  }
  return macdData[macdData.length - 1];
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