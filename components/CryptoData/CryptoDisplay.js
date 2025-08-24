// components/CryptoDisplay.js
import React, { createElement } from "react";
import { Box } from "ink";
import CryptoHeader from "./CryptoHeader.js";
import CryptoControls from "./CryptoControls.js";
import TechnicalIndicators from "./TechnicalIndicators.js";

const CryptoDisplay = ({
  data,
  ticker,
  historicalData,
  historicalLoading,
  indicators,
  onShowMenu,
}) => {
  return createElement(
    Box,
    { flexDirection: "column" },
    createElement(
      Box,
      {
        width: "100%",
        minWidth: 60,
        borderStyle: "round",
        borderColor: "cyan",
        padding: 0,
        flexDirection: "column",
      },
      createElement(CryptoHeader, { data, ticker }),
      indicators && createElement(TechnicalIndicators, { indicators, data, historicalData }),
      createElement(CryptoControls, {
        historicalLoading,
        historicalData,
        indicators,
        onShowMenu,
      }),
    ),
  );
};

export default CryptoDisplay;
