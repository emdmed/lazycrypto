import { readJsonFromFile } from "../../../utils/readJsonFile.js";
import { writeJsonToFile } from "../../../utils/writeJsonFile.js";
import path from "path";
import os from "os";

export const saveOrder = async ({
  orderDetails,
  exchange,
  currentPrice,
  pair,
  byId,
}) => {
  const configDir = path.join(os.homedir(), ".config/lazycrypto");
  const filePath = path.join(configDir, `${pair}.json`);

  let tradesFile = await readJsonFromFile(filePath);

  let newOrder = {
    type: "",
    orderId: "",
    price: "",
    cryptoAmount: "",
    pair: "",
    usdtValue: "",
    fee: "",
    timeStamp: new Date().getTime(),
  };

  if (exchange === "kucoin") {
    newOrder.type = orderDetails.side;
    newOrder.orderId = orderDetails.id;
    newOrder.price = currentPrice;
    newOrder.pair = orderDetails.symbol;
    newOrder.cryptoAmount = orderDetails.size;
    newOrder.fee = orderDetails.fee;
    newOrder.usdtValue = orderDetails.dealFunds;
    newOrder.open = orderDetails.side === "buy" ? true : false;
  }

  if (tradesFile && Array.isArray(tradesFile && !byId)) {
    tradesFile.push(newOrder);
  } else if (tradesFile && Array.isArray(tradesFile) && byId) {
    const newTradesFile = tradesFile.map((trade) => {
      if (trade.id === byId) {
        trade.open = false;
        return trade;
      } else {
        return trade;
      }

      newTradesFile.push(newOrder);
    });
  } else {
    tradesFile = [newOrder];
  }

  writeJsonToFile(tradesFile, filePath);
};
