import React from "react";
import { Box } from "ink";
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
  isTradesVisible,
  currentPrice,
  prevPrice,
  isLastRow,
  cryptosPerRow
}) => {

  return (
    <Box marginTop={1} flexDirection="column" width={cryptosPerRow === 1 ? "100%" : 70}>
      <Box
        width="100%"
        minWidth="100%"
        borderStyle="single"
        borderColor="cyan"
        borderTop={false}
        borderLeft={false}
        borderRight={false}
        borderBottom={!isLastRow}
        paddingBottom={1}
        borderDimColor={true}
        flexDirection="column"
      >
        <CryptoHeader historicalData={historicalData} ticker={ticker} currentPrice={currentPrice} prevPrice={prevPrice} />

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
        {isTradesVisible && <CryptoOrders ticker={ticker} historicalData={historicalData} />}
      </Box>
    </Box>
  );
};

export default CryptoDisplay;
