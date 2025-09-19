import React from "react"

import { Box, Text } from "ink"

// [0] timestamp in ms
// [1] open price
// [2] high price
// [3] low price
// [4] close price
// [5] volume

const CandleVisualizer = ({ historicalData }) => {

  const allcandles = historicalData.slice(-20)

  const closes = allcandles.map(candle => candle[4])
  const highescloseIndex = closes.indexOf(Math.max(...closes));
  const lowescloseIndex = closes.indexOf(Math.min(...closes))

  const highs = allcandles.map(candle => candle[2])
  const highesthighIndex = highs.indexOf(Math.max(...highs))

  const lows = allcandles.map(candle => candle[3])
  const lowestlowIndex = lows.indexOf(Math.min(...lows))

  return <Box>

    {allcandles.map((candle, index) => {

      const open = candle[1]
      const close = candle[4]

      const isCandleGreen = open < close

      const isHighestClose = index === highescloseIndex
      const isLowestClose = index === lowescloseIndex

      const ishighesHigh = index === highesthighIndex
      const islowestLow = index === lowestlowIndex

      let indicator = "|"

      const prevClose = allcandles[index - 1]?.[4]

      if (prevClose && close > prevClose) indicator = "/"
      if (prevClose && close < prevClose) indicator = "\\"

      if (isHighestClose) indicator = "C"
      if (ishighesHigh) indicator = "h"
      if (isHighestClose && ishighesHigh) indicator = "T"

      if (isLowestClose) indicator = "c"
      if (islowestLow) indicator = "l"
      if (isLowestClose && islowestLow) indicator = "B"

      return <Box flexDirection="column">
        <Text bold color={isCandleGreen ? "green" : "red"}>{indicator}</Text>
      </Box>
    })}
  </Box>
}

export default CandleVisualizer
