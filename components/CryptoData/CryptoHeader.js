// components/CryptoHeader.js
import React, { createElement } from 'react';
import { Box, Text } from 'ink';
import { formatPrice, formatPercentage } from '../../utils/formatters/formatters.js';

const CryptoHeader = ({ data, ticker }) => {
  return createElement(Box, { justifyContent: "space-between" },
    createElement(Box, { flexDirection: "row" },
      createElement(Text, { bold: true, color: "cyan" }, data.name || 'Unknown'),
      createElement(Text, { color: "gray", marginLeft: 1 }, `(${ticker})`),
      createElement(Box, { flexDirection: "row", marginLeft: 1 },
        createElement(Text, { bold: true, color: "yellow" }, formatPrice(data.rate))
      ),
      createElement(Box, { flexDirection: "row", marginLeft: 2 },
        createElement(Text, { dimColor: true, marginLeft: 1 }, "24h: "),
        formatPercentage(data.delta?.day),
      ),
      createElement(Box, { flexDirection: "row", marginLeft: 2 },
        createElement(Text, { dimColor: true }, "7d: "),
        formatPercentage(data.delta?.week)
      )
    )
  );
};

export default CryptoHeader;