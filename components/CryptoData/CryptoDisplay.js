import React from "react";
import { Box } from "ink";
import CryptoHeader from "./CryptoHeader.js";
import CryptoControls from "./CryptoControls.js";
import TechnicalIndicators from "./TechnicalIndicators.js";
import VolumeIndicators from "./VolumeIndicators.js";

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
        padding={1}
        flexDirection="column"
      >
        <CryptoHeader data={data} ticker={ticker} />
        <Box width="100%" flexDirection="row" justifyContent="space-between" alignItems="center">
          {indicators && (
            <TechnicalIndicators
              indicators={indicators}
              data={data}
              historicalData={historicalData}
            />
          )}
          <VolumeIndicators historicalData={historicalData} />
        </Box>
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
