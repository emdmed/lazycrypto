import React from "react";
import { Box, Text } from "ink";
import { getArgs } from "../../../utils/getArgs.js";

const RangeVisualizer = ({
  price,
  upperBand,
  middleBand,
  lowerBand,
  prevPrice,
  width = 30,
  tag = "Range: ",
}) => {
  
  const { isMin } = getArgs();

  const defaultConnectors = "─"
  
  const setSymbol = () => {
    if (price > prevPrice) return `/`;
    return `\\`;
  };

  if (!price || !upperBand || !middleBand || !(typeof lowerBand === "number")) {
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

  const visualWidth = width - 1;
  const visualization = Array(visualWidth)
    .fill()
    .map((_, index) => {
      const adjustedIndex = index + 1;

      let symbol = price > prevPrice ? "/" : "\\" ;
      let color = "gray";

      if (adjustedIndex === priceIndex) {
        symbol = setSymbol();
        color = "cyan";
      } else if (adjustedIndex === middleIndex) {
        symbol = setSymbol();
        color = "white";
      }

      return { symbol, color };
    });

  return (
    <Box flexDirection="row" marginRight={isMin ? 1 : 0}>
      {isMin && <Text dimColor>{`${tag} `}</Text>}
      <Text color={price < lowerBand ? "cyan" : "white"}>{setSymbol()}</Text>
      {visualization.map((item, index) => (
        <Text key={index} color={item.color}>
          {item.symbol}
        </Text>
      ))}
      <Text color={price > upperBand ? "cyan" : "white"}>{setSymbol()}</Text>
      {!isMin && <Text dimColor>{` ${tag}`}</Text>}
    </Box>
  );
};

export default RangeVisualizer;
