// components/TechnicalIndicators.js
import React, { createElement } from 'react';
import { Box, Text } from 'ink';
import { 
  formatIndicatorValue, 
  getIndicatorColor, 
  getMACDValue,
  getLatestValue 
} from '../../utils/indicatorUtils.js';

const TechnicalIndicators = ({ indicators }) => {
  return createElement(Box, {
    width: '100%',
    minWidth: 60,
    borderStyle: "round",
    borderColor: "green",
    padding: 1,
    flexDirection: "column",
    marginTop: 1
  },
    createElement(Text, { bold: true, color: "green", marginBottom: 1 }, "📊 Technical Indicators"),
    
    // RSI and MACD
    createElement(Box, { flexDirection: "row", justifyContent: "space-between" },
      createElement(Box, { flexDirection: "row" },
        createElement(Text, { dimColor: true }, "RSI(20): "),
        createElement(Text, {
          color: indicators.rsi ? getIndicatorColor('rsi', getLatestValue(indicators.rsi)) : 'gray'
        }, formatIndicatorValue(indicators.rsi))
      ),
      createElement(Box, { flexDirection: "row" },
        createElement(Text, { dimColor: true }, "MACD: "),
        createElement(Text, {
          color: indicators.macd ? getIndicatorColor('macd', getMACDValue(indicators.macd)) : 'gray'
        }, getMACDValue(indicators.macd)?.toFixed(2) || 'N/A')
      )
    ),
    
    // Moving Averages
    createElement(MovingAverages, { indicators }),
    
    // Bollinger Bands and Other Indicators
    createElement(OtherIndicators, { indicators })
  );
};

const MovingAverages = ({ indicators }) => {
  return createElement(Box, { flexDirection: "column", marginTop: 1 },
    createElement(Text, { dimColor: true, marginBottom: 1 }, "Moving Averages:"),
    createElement(Box, { flexDirection: "row", justifyContent: "space-between" },
      createElement(Text, { color: "cyan" }, `EMA9: ${formatIndicatorValue(indicators.ema9)}`),
      createElement(Text, { color: "cyan" }, `EMA21: ${formatIndicatorValue(indicators.ema21)}`),
      createElement(Text, { color: "cyan" }, `EMA50: ${formatIndicatorValue(indicators.ema50)}`)
    ),
    createElement(Box, { flexDirection: "row", justifyContent: "space-between", marginTop: 1 },
      createElement(Text, { color: "magenta" }, `SMA Fast: ${formatIndicatorValue(indicators.smaFast)}`),
      createElement(Text, { color: "magenta" }, `SMA Slow: ${formatIndicatorValue(indicators.smaSlow)}`),
      createElement(Text, { color: "magenta" }, `SMA200: ${formatIndicatorValue(indicators.sma200)}`)
    )
  );
};

const OtherIndicators = ({ indicators }) => {
  return createElement(Box, { flexDirection: "row", justifyContent: "space-between", marginTop: 1 },
    createElement(Box, { flexDirection: "column" },
      createElement(Text, { dimColor: true }, "Bollinger Bands:"),
      createElement(Text, { color: "yellow" }, `Upper: ${formatIndicatorValue(indicators.bb?.upper)}`),
      createElement(Text, { color: "yellow" }, `Middle: ${formatIndicatorValue(indicators.bb?.middle)}`),
      createElement(Text, { color: "yellow" }, `Lower: ${formatIndicatorValue(indicators.bb?.lower)}`)
    ),
    createElement(Box, { flexDirection: "column" },
      createElement(Text, { dimColor: true }, "Other:"),
      createElement(Text, { color: "white" }, `ATR: ${formatIndicatorValue(indicators.atr)}`),
      createElement(Text, { color: "white" }, `Min(20): ${formatIndicatorValue(indicators.mmin)}`),
      createElement(Text, { color: "white" }, `Max(20): ${formatIndicatorValue(indicators.mmax)}`)
    )
  );
};

export default TechnicalIndicators;