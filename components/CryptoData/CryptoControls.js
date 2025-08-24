// components/CryptoControls.js
import React, { createElement } from 'react';
import { Box, Text } from 'ink';
import Spinner from 'ink-spinner';

const CryptoControls = ({ historicalLoading, historicalData, indicators, onShowMenu }) => {
  return createElement(Box, { justifyContent: "space-between", marginTop: 1 },
    createElement(Box, { flexDirection: "row" },
      historicalLoading && createElement(Box, { flexDirection: "row", marginLeft: 2 },
        createElement(Spinner, { type: "dots" }),
      )
    ),
    createElement(Box, { flexDirection: "row" },
      indicators && createElement(Text, { color: "green", marginLeft: 2 }, "✓ ")
    )
  );
};

export default CryptoControls;