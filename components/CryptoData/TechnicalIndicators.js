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

const TechnicalIndicators = ({
  indicators,
  data,
  historicalData,
  prevPrice,
}) => {
  return (
    <Box
      width="100%"
      padding={0}
      flexDirection="column"
      marginTop={1}
    >
      <Box flexDirection="row" justifyContent="space-between">
        <Box flexDirection="row">
          <Box marginLeft={0} marginRight={1}>
            <RowVisualizer
              value={getLatestValue(indicators.rsi)}
              prevValue={getPrevValue(indicators.rsi)}
            />
          </Box>
          <Box marginLeft={1}>
            <Text dimColor>         RSI </Text>
          </Box>
          <Text
            color={indicators.rsi
              ? getIndicatorColor("rsi", getLatestValue(indicators.rsi))
              : "gray"
            }
          >
            {formatIndicatorValue(indicators.rsi)}
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

const MovingAverages = ({ indicators }) => {
  return (
    <Box flexDirection="column" marginTop={1}>
      <Box flexDirection="row" justifyContent="space-between">
        <Text color="cyan">
          EMA9: {formatIndicatorValue(indicators.ema9)}
        </Text>
        <Text color="cyan">
          EMA21: {formatIndicatorValue(indicators.ema21)}
        </Text>
        <Text color="cyan">
          EMA50: {formatIndicatorValue(indicators.ema50)}
        </Text>
      </Box>
    </Box>
  );
};

const OtherIndicators = ({ indicators, data, prevData, prevPrice }) => {
  const price = data.rate;

  return (
    <Box
      flexDirection="column"
      marginTop={0}
    >
      <Box flexDirection="column">
        {indicators.bb && (
          <RangeVisualizer
            price={price}
            prevPrice={prevPrice}
            upperBand={getLatestValue(indicators.bb.upper)}
            middleBand={getLatestValue(indicators.bb.middle)}
            lowerBand={getLatestValue(indicators.bb.lower)}
            width={20}
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
            width={20}
          />
        )}
      </Box>
    </Box>
  );
};

export default TechnicalIndicators;