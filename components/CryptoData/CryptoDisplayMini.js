import React from "react";
import { Box, Text } from "ink";
import CryptoControls from "./CryptoControls.js";
import TechnicalIndicators from "./TechnicalIndicators.js";
import { formatPrice } from "../../utils/formatters/formatters.js";

const CryptoDisplayMini = ({
  data,
  ticker,
  historicalData,
  historicalLoading,
  indicators,
  onShowMenu,
  currentPrice,
  prevPrice
}) => {
  return (
    <Box flexDirection="row">
      <Box
        alignItems="center"
        width="100%"
        minWidth="100%"
        padding={0}
        flexDirection="row"
      >
        <Box width={25} flexDirection="row" justifyContent="space-between">
          <Box flexDirection="row">
            <Text inverse >{ticker ? ` ${ticker} ` : ""}</Text>
          </Box>
          <Box flexDirection="row" justifyContent="flex-end" marginRight={1}>
            <Text color="yellow">{` ${formatPrice(currentPrice)} `}</Text>
          </Box>
        </Box>
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

export default CryptoDisplayMini;
