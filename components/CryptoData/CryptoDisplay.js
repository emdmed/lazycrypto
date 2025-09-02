import React from "react";
import { Box, Text } from "ink";
import CryptoHeader from "./CryptoHeader.js";
import CryptoControls from "./CryptoControls.js";
import TechnicalIndicators from "./TechnicalIndicators.js";
import VolumeIndicators from "./VolumeIndicators.js";
import CryptoOrders from "./CryptoOrders.js";

const CryptoDisplay = ({
  data,
  ticker,
  historicalData,
  historicalLoading,
  indicators,
  onShowMenu,
  isTradesVisible
}) => {


  return (
    <Box flexDirection="column">
      <Box
        width="100%"
        minWidth="100%"
        borderStyle="single"
        borderColor="cyan"
        borderTop={false}
        borderLeft={false}
        borderRight={false}
        paddingBottom={1}
        marginBottom={1}
        flexDirection="column"
      >
        <CryptoHeader data={data} ticker={ticker} />

        <Box
          width="100%"
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
        >
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
        {isTradesVisible && <CryptoOrders ticker={ticker} historicalData={historicalData}/>}
      </Box>
    </Box>
  );
};

export default CryptoDisplay;
