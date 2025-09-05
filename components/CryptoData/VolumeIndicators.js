import React from "react";
import { Box, Text } from "ink";
import RowVisualizer from "./visualizations/RowVisualizer.js";

const RANGE_WIDTH = 16;

const VolumeIndicators = ({ historicalData }) => {
  const absoluteVolumes = [
    {volume: Number(historicalData[historicalData.length - 1][5]), index: 0},
    {volume: Number(historicalData[historicalData.length - 2][5]), index: 1},
    {volume: Number(historicalData[historicalData.length - 3][5]), index: 2},
  ].sort((a, b) => b.volume - a.volume);

  const maxVolume = absoluteVolumes[0].volume;
  const relativeVolumes = absoluteVolumes.map(
   (element) => ({volume: (element.volume / maxVolume) * 10, index: element.index}) 
  );
  
  const orderedRelativeVolumes = relativeVolumes.sort((a, b) => a.index - b.index)
  
  return (
    <Box width="100%" padding={0} flexDirection="column" marginTop={1}>
      <Text>Relative volume (last 3 candles)</Text>
      {orderedRelativeVolumes &&
        orderedRelativeVolumes.map((element, index) => (
          <RowVisualizer
            key={index}
            factor={1}
            width={RANGE_WIDTH}
            value={element.volume}
            prevValue={element.volume}
            marksColor="grey"
            baseColor="grey"
            fill={true}
            valueColor="cyan"
          />
        ))}
    </Box>
  );
};

export default VolumeIndicators;
