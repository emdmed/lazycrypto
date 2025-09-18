import React, { useEffect } from "react"
import { Text } from "ink"
import { useCryptoData } from "../../hooks/useCryptoData.js"

const RenderString = ({ apiKey, selectedTimeframe }) => {
  const {
    currentPrice,
    loading,
    error
  } = useCryptoData("BTC", apiKey, selectedTimeframe)

  useEffect(() => {
    // Exit after data is loaded or error occurs
    if (!loading && (currentPrice || error)) {
      setTimeout(() => {
        process.exit(0)
      }, 100) // Small delay to ensure output is flushed
    }
  }, [loading, currentPrice, error])

  if (loading) return <Text>Bitcoin Loading...</Text>
  if (error) return <Text>Bitcoin Error</Text>
  if (!currentPrice) return <Text>Bitcoin No Data</Text>

  return <Text>Bitcoin ${currentPrice}</Text>
}

export default RenderString
