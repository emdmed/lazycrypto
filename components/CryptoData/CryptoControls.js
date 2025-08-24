import React, { createElement } from 'react';
import { Box, Text } from 'ink';
import Spinner from 'ink-spinner';

const CryptoControls = ({ historicalLoading, historicalData, indicators, onShowMenu }) => {
  return createElement(Box, { justifyContent: "space-between", marginTop: 0 },
    createElement(Box, { flexDirection: "row" },
      historicalLoading && createElement(Box, { flexDirection: "row", marginLeft: 2 },
        createElement(Spinner, { type: "dots" }),
      )
    )
  );
};

export default CryptoControls;