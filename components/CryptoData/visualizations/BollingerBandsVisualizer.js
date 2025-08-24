import React from "react";
import { Box, Text } from "ink";

const BollingerRowVisualizer = ({
  price,
  upperBand,
  middleBand,
  lowerBand,
  prevPrice,
  width = 30
}) => {
  
  const setSymbol = () => {
    if(price > prevPrice) return `/`
    return `\\`
  }
  
  if (!price || !upperBand || !middleBand || !lowerBand) {
    return React.createElement(Text, { color: "red" }, "BB: Missing data");
  }
  
  const range = upperBand - lowerBand;
  
  if (range <= 0) {
    return React.createElement(Text, { color: "red" }, "BB: Invalid range");
  }
  
  const pricePosition = (price - lowerBand) / range;
  const clampedPosition = Math.max(0, Math.min(1, pricePosition));
  const priceIndex = Math.round(clampedPosition * (width - 1));
  
  const middlePosition = (middleBand - lowerBand) / range;
  const middleIndex = Math.round(middlePosition * (width - 1));
  
  const visualWidth = width - 2;
  const visualization = Array(visualWidth).fill().map((_, index) => {
    const adjustedIndex = index + 1;
    
    let symbol = "─";
    let color = "gray";
    
    if (adjustedIndex === priceIndex) {
      symbol = setSymbol();
      color = "red";
    } else if (adjustedIndex === middleIndex) {
      symbol = setSymbol();
      color = "white";
    }
    
    return { symbol, color };
  });

  
  return React.createElement(Box, { flexDirection: "row" },
    React.createElement(Text, { dimColor: true }, "BB: "),
    React.createElement(Text, { color: price < lowerBand ? "red" : "cyan" }, setSymbol()),
    ...visualization.map((item, index) => 
      React.createElement(Text, { key: index, color: item.color }, item.symbol)
    ),
    React.createElement(Text, { color: price > upperBand ? "red" : "magenta" }, setSymbol())
  );
};

export default BollingerRowVisualizer;