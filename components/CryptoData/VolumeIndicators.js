import React from "react";
import { Box, Text } from "ink";
import RowVisualizer from "./visualizations/RowVisualizer.js";

const RANGE_WIDTH = 16;

const VolumeIndicators = ({ historicalData }) => {
  const absoluteVolumes = [
    Number(historicalData[historicalData.length - 1][5]),
    Number(historicalData[historicalData.length - 2][5]),
    Number(historicalData[historicalData.length - 3][5]),
  ].sort((a, b) => b - a);

  const maxVolume = absoluteVolumes[0];
  const relativeVolumes = absoluteVolumes.map(
    (volume) => (volume / maxVolume) * 10,
  );

  return (
    <Box width="100%" padding={0} flexDirection="column" marginTop={1}>
      <Text>Relative volume (last 3 candles)</Text>
      {relativeVolumes &&
        relativeVolumes.map((volume, index) => (
          <RowVisualizer
            key={index}
            factor={1}
            width={RANGE_WIDTH}
            value={volume}
            prevValue={volume}
            marksColor="grey"
            baseColor="grey"
            fill={true}
            valueColor="blue"
          />
        ))}
    </Box>
  );
};

export default VolumeIndicators;
