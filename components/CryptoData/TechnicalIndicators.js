import React from "react";
import { Box, Text } from "ink";
import {
  formatIndicatorValue,
  getIndicatorColor,
  getLatestValue,
  getPrevValue,
} from "../../utils/indicatorUtils.js";
import RowVisualizer from "./visualizations/RowVisualizer.js";
import RangeVisualizer from "./visualizations/RangeVisualizer.js";
import { getArgs } from "../../utils/getArgs.js";

const RANGE_WIDTH = 16;

const TechnicalIndicators = ({ indicators, data, historicalData }) => {
  const { isMin } = getArgs();

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
          <Box marginLeft={isMin ? 1 : 0} marginRight={1}>
            <RowVisualizer
              width={isMin ? 10 : RANGE_WIDTH}
              value={getLatestValue(indicators.rsi)}
              prevValue={getPrevValue(indicators.rsi)}
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
          prevPrice={historicalData[historicalData.length - 2][1]}
        />
      </Box>
    </Box>
  );
};

const OtherIndicators = ({ indicators, data, prevData, prevPrice }) => {
  const price = data.rate;
  const { isMin } = getArgs();
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
            middleBand={
              (getLatestValue(indicators.mmax) -
                getLatestValue(indicators.mmin)) /
              2
            }
            lowerBand={getLatestValue(indicators.mmin)}
            width={isMin ? 10 : RANGE_WIDTH}
          />
        )}
      </Box>
    </Box>
  );
};

export default TechnicalIndicators;
