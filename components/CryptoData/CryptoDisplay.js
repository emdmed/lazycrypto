// components/CryptoDisplay.js
import React from "react";
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
  return (
    <Box flexDirection="column">
      <Box
        width="100%"
        minWidth="100%"
        borderStyle="round"
        borderColor="cyan"
        padding={0}
        flexDirection="column"
      >
        <CryptoHeader data={data} ticker={ticker} />
        {indicators && (
          <TechnicalIndicators 
            indicators={indicators} 
            data={data} 
            historicalData={historicalData} 
          />
        )}
        <CryptoControls
          historicalLoading={historicalLoading}
          historicalData={historicalData}
          indicators={indicators}
          onShowMenu={onShowMenu}
        />
      </Box>
    </Box>
  );
};

export default CryptoDisplay;