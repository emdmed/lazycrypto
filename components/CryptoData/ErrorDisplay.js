// components/ErrorDisplay.js
import React, { createElement } from 'react';
import { Box, Text } from 'ink';

const ErrorDisplay = ({ error }) => {
  return createElement(Box, {
    width: '100%',
    minWidth: 60,
    borderStyle: "round",
    borderColor: "red",
    padding: 1,
    justifyContent: "center"
  },
    createElement(Text, { color: "red" }, `❌ ${error}`)
  );
};

export default ErrorDisplay;