// components/CryptoControls.js
import React, { createElement } from 'react';
import { Box, Text } from 'ink';
import Spinner from 'ink-spinner';

const CryptoControls = ({ historicalLoading, historicalData, indicators, onShowMenu }) => {
  return createElement(Box, { justifyContent: "space-between", marginTop: 1 },
    createElement(Box, { flexDirection: "row" },
      createElement(Text, { dimColor: true }, "Press 'S' for crypto menu"),
      historicalLoading && createElement(Box, { flexDirection: "row", marginLeft: 2 },
        createElement(Spinner, { type: "dots" }),
        createElement(Text, { color: "yellow", marginLeft: 1 }, "Loading indicators...")
      )
    ),
    createElement(Box, { flexDirection: "row" },
      createElement(Text, { dimColor: true }, `Data points: ${historicalData.length}`),
      indicators && createElement(Text, { color: "green", marginLeft: 2 }, "✓ Indicators ready")
    )
  );
};

export default CryptoControls;