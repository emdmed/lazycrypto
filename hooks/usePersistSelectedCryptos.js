import { useEffect, useState } from "react"
import { readConfigFile, writeConfigFile } from "../utils/readConfigFile.js"

export const usePersistSelectedCryptos = () => {
  const [selectedCryptos, setSelectedCryptos] = useState(["bitcoin", "monero"])
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const file = await readConfigFile()
        if (file?.selectedCryptos &&
          Array.isArray(file.selectedCryptos) &&
          file.selectedCryptos.length > 0) {
          setSelectedCryptos(file.selectedCryptos)
        }
      } catch (error) {
        console.error("Failed to load config:", error)
      } finally {
        setIsInitialized(true)
      }
    }

    loadConfig()
  }, [])

  useEffect(() => {
    if (!isInitialized) return

    const saveConfig = async () => {
      try {
        const file = await readConfigFile() || {}
        file.selectedCryptos = selectedCryptos
        await writeConfigFile(file)
      } catch (error) {
        console.error("Failed to save config:", error)
      }
    }

    saveConfig()
  }, [selectedCryptos, isInitialized])

  return { selectedCryptos, setSelectedCryptos }
}
