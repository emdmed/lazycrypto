import React from "react";
import { Box, Text } from "ink";
import {
  formatIndicatorValue,
  getIndicatorColor,
  getMACDValue,
  getLatestValue,
  getPrevValue,
} from "../../utils/indicatorUtils.js";
import RowVisualizer from "./visualizations/RowVisualizer.js";
import RangeVisualizer from "./visualizations/RangeVisualizer.js";


const RANGE_WIDTH = 16

const TechnicalIndicators = ({ indicators, data, historicalData }) => {
  return (
    <Box width="100%" padding={0} flexDirection="column" marginTop={1}>
      <Box flexDirection="row" justifyContent="space-between">
        <Box flexDirection="row">
          <Box marginLeft={0} marginRight={1}>
            <RowVisualizer
              width={RANGE_WIDTH}
              value={getLatestValue(indicators.rsi)}
              prevValue={getPrevValue(indicators.rsi)}
            />
          </Box>
          <Box marginRight={1}>
            <Text dimColor>RSI</Text>
          </Box>
          <Text
            color={
              indicators.rsi
                ? getIndicatorColor("rsi", getLatestValue(indicators.rsi))
                : "gray"
            }
          >
            {formatIndicatorValue(indicators.rsi, 0)}
          </Text>
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

  return (
    <Box flexDirection="column" marginTop={0}>
      <Box flexDirection="column">
        {indicators.bb && (
          <RangeVisualizer
            price={price}
            prevPrice={prevPrice}
            upperBand={getLatestValue(indicators.bb.upper)}
            middleBand={getLatestValue(indicators.bb.middle)}
            lowerBand={getLatestValue(indicators.bb.lower)}
            width={RANGE_WIDTH}
            tag="BB"
          />
        )}
      </Box>

      <Box flexDirection="column">
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
            width={RANGE_WIDTH}
          />
        )}
      </Box>
    </Box>
  );
};

export default TechnicalIndicators;
