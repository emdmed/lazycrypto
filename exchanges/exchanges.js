import kucoin from "./kucoin.js"

const kucoinExchange = {
  placeOrder: kucoin.placeOrder,
  getBalance: kucoin.getAccountBalance,
  getPrice: kucoin.fetchCurrentPrice,
  getSymbolParams: kucoin.getSymbolParams,
  getOrderDetailsById: kucoin.getOrderDetailsById
}

export const exchanges = {
  kucoin: kucoinExchange
}