import React, {useState, useEffect} from "react"

export const useStdoutDimensions = () => {
  const [dimensions, setDimensions] = useState([
    process.stdout.columns || 80,
    process.stdout.rows || 24
  ]);

  useEffect(() => {
    const handleResize = () => {
      setDimensions([
        process.stdout.columns || 80,
        process.stdout.rows || 24
      ]);
    };

    process.stdout.on('resize', handleResize);
    
    return () => {
      process.stdout.off('resize', handleResize);
    };
  }, []);

  return dimensions;
};