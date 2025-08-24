import React, { createElement } from 'react';
import { Box, Text } from 'ink';
import Spinner from 'ink-spinner';

const LoadingSpinner = ({ ticker }) => {
  return createElement(Box, {
    width: '100%',
    minWidth: 60,
    borderStyle: "round",
    borderColor: "gray",
    padding: 1,
    justifyContent: "center"
  },
    createElement(Box, { flexDirection: "row" },
      createElement(Spinner, { type: "dots" }),
      createElement(Text, { color: "yellow", marginLeft: 1 },
        `${ticker}`
      )
    )
  );
};

export default LoadingSpinner;