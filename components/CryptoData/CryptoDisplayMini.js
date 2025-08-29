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
        <Box width={25}>
          <Box flexDirection="row" marginRight={1}>
            <Text inverse >{ticker ? ticker : ""}</Text>
          </Box>
          <Box flexDirection="row" marginRight={1}>
            <Text color="yellow">{formatPrice(data?.rate)}</Text>
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
          {/* <VolumeIndicators historicalData={historicalData} />*/}
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
