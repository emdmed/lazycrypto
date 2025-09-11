import React from "react";
import { Box, Text } from "ink";
import {
  formatIndicatorValue,
  getIndicatorColor,
  getLatestValue,
  getPrevValue,
} from "../../utils/indicatorUtils.js";
import RangeVisualizer from "./visualizations/RangeVisualizer.js";
import { getArgs } from "../../utils/getArgs.js";

const RANGE_WIDTH = 16;

const TechnicalIndicators = ({ indicators, data, historicalData }) => {
  const { isMin } = getArgs();

  const currentPrice = historicalData[historicalData.length - 1]?.[4];
  const prevPrice = historicalData[historicalData.length - 2]?.[4];

  return (
    <Box
      width="100%"
      padding={0}
      flexDirection={isMin ? "row" : "column"}
      marginTop={isMin ? 0 : 1}
    >
      <Box flexDirection="row" justifyContent="space-between">
        <Box flexDirection="row">
          {isMin && (
            <Box marginRight={1}>
              <Text dimColor>RSI</Text>
            </Box>
          )}
          {isMin && (
            <Text
              color={
                indicators.rsi
                  ? getIndicatorColor("rsi", getLatestValue(indicators.rsi))
                  : "gray"
              }
            >
              {formatIndicatorValue(indicators.rsi, 0)}
            </Text>
          )}
          <Box marginLeft={isMin ? 1 : 0} marginRight={0}>
            <RangeVisualizer
              width={isMin ? 10 : RANGE_WIDTH}
              price={getLatestValue(indicators.rsi)}
              prevPrice={getPrevValue(indicators.rsi)}
              upperBand={100}
              middleBand={50}
              lowerBand={0}
              tag=""
            />
          </Box>
          {!isMin && (
            <Box marginRight={1}>
              <Text dimColor>RSI</Text>
            </Box>
          )}
          {!isMin && (
            <Text
              color={
                indicators.rsi
                  ? getIndicatorColor("rsi", getLatestValue(indicators.rsi))
                  : "gray"
              }
            >
              {formatIndicatorValue(indicators.rsi, 0)}
            </Text>
          )}
        </Box>
      </Box>

      <Box flexDirection="row">
        <OtherIndicators
          indicators={indicators}
          data={data}
          prevPrice={prevPrice}
          currentPrice={currentPrice}
        />
      </Box>
    </Box>
  );
};

const OtherIndicators = ({ indicators, data, prevData, prevPrice, currentPrice }) => {
  const price = currentPrice;
  const { isMin } = getArgs();

  const middle =
    (getLatestValue(indicators.mmax) - getLatestValue(indicators.mmin)) / 2 +
    getLatestValue(indicators.mmin);

  return (
    <Box
      flexDirection={isMin ? "row" : "column"}
      marginTop={0}
      marginLeft={isMin ? 1 : 0}
    >
      <Box flexDirection={isMin ? "row" : "column"}>
        {indicators.bb && (
          <RangeVisualizer
            price={price}
            prevPrice={prevPrice}
            upperBand={getLatestValue(indicators.bb.upper)}
            middleBand={getLatestValue(indicators.bb.middle)}
            lowerBand={getLatestValue(indicators.bb.lower)}
            width={isMin ? 10 : RANGE_WIDTH}
            tag="BB"
          />
        )}
      </Box>

      <Box flexDirection={isMin ? "row" : "column"}>
        {indicators.bb && (
          <RangeVisualizer
            tag="Min/Max"
            price={price}
            prevPrice={prevPrice}
            upperBand={getLatestValue(indicators.mmax)}
            middleBand={middle}
            lowerBand={getLatestValue(indicators.mmin)}
            width={isMin ? 10 : RANGE_WIDTH}
          />
        )}
      </Box>
    </Box>
  );
};

export default TechnicalIndicators;
