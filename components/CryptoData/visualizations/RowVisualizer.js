import React, { useEffect } from "react";
import { Box, Text } from "ink";

const RowVisualizer = ({
  value,
  prevValue,
  factor = 10,
  width,
  baseColor = "grey",
  marksColor = "white",
  marks = [0, 5, 9],
  fill = false,
  valueColor = "red",
}) => {
  const index = (value / factor - 1).toFixed(0);

  const base = new Array(10)
    .fill(null)
    .map(() => ({ color: baseColor }))
    .map((element, index) => {
      if (marks.includes(index)) return { color: marksColor };
      return element;
    });

  
  if(index > 9 || index < 0){
    return <Text color="red">Woops!</Text>
  }
  
  if (index && base) {
    base[index].color = "red";
  }

  const setBaseColor = () => {
    if (fill) {
      return base.map((element, _index) => {
        if (_index <= index) return { color: valueColor };
        return element;
      });
    } else {
      return base;
    }
  };

  const setSymbol = () => {
    if (value > prevValue) return "/";
    if (value === prevValue) return "|";
    return `\\`;
  };

  return (
    <Box flexDirection="row" width={width}>
      {setBaseColor().map((element, index) => (
        <Text color={element.color} key={index}>
          {setSymbol()}
        </Text>
      ))}
    </Box>
  );
};

export default RowVisualizer;
