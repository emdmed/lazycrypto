import { useEffect, useState } from "react";
import { useAppConfig } from "../hooks/useAppConfig.js";
import { readJsonFromFile } from "../../../utils/readJsonFile.js";
import { exchanges } from "../../../exchanges/exchanges.js";

export const useGetOrders = ({ pair }) => {
  const [orders, setOrders] = useState();
  const [openOrders, setOpenOrders] = useState([])
  const [balance, setBalance] = useState();
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const { filePath } = useAppConfig();

  const fetchOrdersFromFile = async () => {
    setIsLoadingOrders(true);
    const orders = await readJsonFromFile(`${filePath}/${pair}.json`);

    if (!orders || orders?.length === 0) return
    setOrders(orders);
    setOpenOrders(orders.filter(order => order.open === true))
    setIsLoadingOrders(false);
  };

  const fetchBalance = async () => {
    setIsLoadingBalance(true)
    const ticker = pair.split("-")[0];
    const balanceResponse = await exchanges.kucoin.getBalance(ticker);
    if (balanceResponse) setBalance(balanceResponse);
    setIsLoadingBalance(false)
  };

  useEffect(() => {
    if (!pair) return;

    fetchOrdersFromFile();
    fetchBalance();
  }, [pair]);

  return { orders, openOrders, balance, isLoadingOrders, isLoadingBalance };
};
