// components/CryptoSelector.js
import React, { createElement } from 'react';
import { Box, Text } from 'ink';
import SelectInput from 'ink-select-input';

const CryptoSelector = ({ cryptoOptions, currentCrypto, onSelect, onCancel }) => {
  return createElement(Box, { flexDirection: "column" },
    createElement(Box, { marginBottom: 1 },
      createElement(Text, { bold: true, color: "cyan" }, "🚀 Select Cryptocurrency")
    ),
    createElement(SelectInput, {
      items: cryptoOptions,
      onSelect: onSelect,
      initialIndex: cryptoOptions.findIndex(option => option.value === currentCrypto)
    }),
    createElement(Box, { marginTop: 1 },
      createElement(Text, { dimColor: true }, "Press 'S' to cancel selection")
    )
  );
};

export default CryptoSelector;