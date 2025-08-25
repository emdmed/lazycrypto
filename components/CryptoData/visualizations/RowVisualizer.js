import React, { useEffect } from "react";
import { Box, Text } from "ink";

const RowVisualizer = ({value, prevValue, factor = 10}) => {
  
  const index = (value / factor).toFixed(0)
  
  const base = [
    {
      color: null
    },
    {
      color: "grey"
    },
    {
      color: "grey"
    },
    {
      color: "grey"
    },
    {
      color: "grey"
    },
    {
      color: null
    },
    {
      color: "grey"
    },
    {
      color: "grey"
    },
    {
      color: "grey"
    },
    {
      color: null
    },
  ]
  
  if(index && base){
    base[index].color = "red"
  }
  
  const setSymbol = () => {
    if(value > prevValue) return "/"
    return `\\`
  }
  
  return (
    <Box flexDirection="row">
      {base.map((element, index) => 
        <Text color={element.color} key={index}>
          {setSymbol()}
        </Text>
      )}
    </Box>
  );
};

export default RowVisualizer;