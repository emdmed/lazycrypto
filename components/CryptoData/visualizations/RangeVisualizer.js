import React from "react";
import { Box, Text } from "ink";

const RangeVisualizer = ({
  price,
  upperBand,
  middleBand,
  lowerBand,
  prevPrice,
  width = 30,
  tag = "Range: "
}) => {
  
  const setSymbol = () => {
    if(price > prevPrice) return `/`
    return `\\`
  }
  
  if (!price || !upperBand || !middleBand || !lowerBand) {
    return <Text color="red">Missing data</Text>;
  }
  
  const range = upperBand - lowerBand;
  
  if (range <= 0) {
    return <Text color="red">Invalid range</Text>;
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
  
  return (
    <Box flexDirection="row">
      <Text color={price < lowerBand ? "red" : "cyan"}>
        {setSymbol()}
      </Text>
      {visualization.map((item, index) => 
        <Text key={index} color={item.color}>
          {item.symbol}
        </Text>
      )}
      <Text color={price > upperBand ? "red" : "magenta"}>
        {setSymbol()}
      </Text>
      <Text dimColor>
        {` ${tag}`}
      </Text>
    </Box>
  );
};

export default RangeVisualizer;