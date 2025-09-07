import { useInput } from "ink";
import {
  expandPanelZellij,
  contractPanelZellij,
} from "../components/CryptoData/terminals/zellij.js";
import {
  contractPanelTMUX,
  expandPanelTMUX,
} from "../components/CryptoData/terminals/tmux.js";

const TIMEOUT_TIME = 300;

const clearTerminal = () => {
  console.clear();
};

export const useKeyBinds = ({
  isLoading,
  isConfigPanelVisible,
  isTimeframeSelectorVisible,
  isOrderPanelVisible,
  apiSecret,
  apiPassphrase,
  setIsConfigPanelVisible,
  setIsTradesVisible,
  setIsTimeframeSelectorVisible,
  setIsOrderPanelVisible,
  setShowKeyBinds,
  setShowCryptoMenu,
  setRefreshKey
}) => {

  const expandTerminal = (lines) => {
    expandPanelZellij(lines);
    expandPanelTMUX(lines);
  };

  const contractTerminal = (lines) => {
    contractPanelZellij(lines);
    contractPanelTMUX(lines);
  };

  useInput((input, key) => {
    if (
      !isLoading &&
      !isConfigPanelVisible &&
      !isTimeframeSelectorVisible &&
      !isOrderPanelVisible
    ) {
      if (input.toLowerCase() === "c") {
        expandTerminal(3);
        clearTerminal();
        setTimeout(() => {
          setIsConfigPanelVisible(true);
        }, TIMEOUT_TIME);
      }
      if (input === "t") {
        clearTerminal();

        expandTerminal(3);
        setTimeout(() => {
          setIsTimeframeSelectorVisible(true);
        }, TIMEOUT_TIME);
      }
      if (input.toLowerCase() === "o") {
        if (apiSecret && apiPassphrase) {
          expandTerminal(3);
          clearTerminal();
          setTimeout(() => {
            setIsOrderPanelVisible(true);
          }, TIMEOUT_TIME);
        } else {
          setIsConfigPanelVisible(true);
        }
      }

      if (input === "T") {
        setIsTradesVisible((prev) => !prev);
      }
      
      if(input === "h"){
        setShowKeyBinds(prev => !prev)
      }
      
      if(input === "s"){
        console.clear();
        expandTerminal(3);
  
        setTimeout(() => {
          setShowCryptoMenu(prev => !prev);
        }, 200);
      }
      
      if(input === "r"){
        setRefreshKey(prev => !prev)
      }
    }

    if (key.escape) {
      contractTerminal(3);

      if (isConfigPanelVisible) {
        setIsConfigPanelVisible(false);
      }
      if (isTimeframeSelectorVisible) {
        setIsTimeframeSelectorVisible(false);
      }
      if (isOrderPanelVisible) {
        setIsOrderPanelVisible(false);
      }
    }
  });
};
