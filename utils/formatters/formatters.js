import React from 'react';
import { Text } from 'ink';

export const formatPrice = (price) => {
  return `$${Number(price).toLocaleString("en", {
    maximumFractionDigits: 2
  })}`;
};

export const formatPercentage = (delta) => {
  if (!delta) return React.createElement(Text, { color: 'gray' }, '0.0%');
  
  const percentage = (delta - 1) * 100;
  const color = percentage >= 0 ? 'green' : 'red';
  const sign = percentage >= 0 ? '+' : '';
  return React.createElement(Text, { color }, `${sign}${percentage.toFixed(1)}%`);
};

export const formatMarketCap = (marketCap) => {
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