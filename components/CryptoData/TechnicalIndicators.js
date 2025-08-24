import React, { createElement } from "react";
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
  return createElement(
    Box,
    {
      width: "100%",
      minWidth: 60,
      padding: 0,
      flexDirection: "column",
      marginTop: 1,
    },

    createElement(
      Box,
      { flexDirection: "row", justifyContent: "space-between" },
      createElement(
        Box,
        { flexDirection: "row" },
        createElement(
          Box,
          { marginLeft: 0, marginRight: 1 },
          createElement(RowVisualizer, {
            value: getLatestValue(indicators.rsi),
            prevValue: getPrevValue(indicators.rsi),
          }),
        ),
        createElement(
          Text,
          {
            color: indicators.rsi
              ? getIndicatorColor("rsi", getLatestValue(indicators.rsi))
              : "gray",
          },
          formatIndicatorValue(indicators.rsi),
        ),
        createElement(
          Box,
          { marginLeft: 1 },
          createElement(Text, { dimColor: true }, "    RSI"),
        ),
      ),
    ),
    createElement(
      Box,
      { flexDirection: "row" },
      createElement(OtherIndicators, {
        indicators,
        data,
        prevPrice: historicalData[historicalData.length - 2][1],
      }),
    ),
  );
};

const MovingAverages = ({ indicators }) => {
  return createElement(
    Box,
    { flexDirection: "column", marginTop: 1 },
    createElement(
      Box,
      { flexDirection: "row", justifyContent: "space-between" },
      createElement(
        Text,
        { color: "cyan" },
        `EMA9: ${formatIndicatorValue(indicators.ema9)}`,
      ),
      createElement(
        Text,
        { color: "cyan" },
        `EMA21: ${formatIndicatorValue(indicators.ema21)}`,
      ),
      createElement(
        Text,
        { color: "cyan" },
        `EMA50: ${formatIndicatorValue(indicators.ema50)}`,
      ),
    ),
  );
};

const OtherIndicators = ({ indicators, data, prevData, prevPrice }) => {
  const price = data.rate;

  return createElement(
    Box,
    {
      flexDirection: "column",
      marginTop: 0,
    },
    createElement(
      Box,
      { flexDirection: "column" },
      indicators.bb &&
        createElement(RangeVisualizer, {
          price: price,
          prevPrice: prevPrice,
          upperBand: getLatestValue(indicators.bb.upper),
          middleBand: getLatestValue(indicators.bb.middle),
          lowerBand: getLatestValue(indicators.bb.lower),
          width: 20,
          tag: "BB: ",
        }),
    ),
    createElement(
      Box,
      { flexDirection: "column" },
      indicators.bb &&
        createElement(RangeVisualizer, {
          tag: "Min/Max: ",
          price: price,
          prevPrice: prevPrice,
          upperBand: getLatestValue(indicators.mmax),
          middleBand:
            (getLatestValue(indicators.mmax) -
              getLatestValue(indicators.mmin)) /
            2,
          lowerBand: getLatestValue(indicators.mmin),
          width: 20,
        }),
    ),
  );
};

export default TechnicalIndicators;
