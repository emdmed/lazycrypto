import { readJsonFromFile } from "../../../utils/readJsonFile.js";
import { writeJsonToFile } from "../../../utils/writeJsonFile.js";
import path from "path"
import os from "os";

export const saveOrder = async ({
  orderDetails,
  exchange,
  currentPrice,
  pair,
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
    newOrder.usdtValue = orderDetails.dealFunds
  }
  
  

  if (tradesFile && Array.isArray(tradesFile)) {
    tradesFile.push(newOrder);
  } else {
    tradesFile = [newOrder];
  }

  writeJsonToFile(tradesFile, filePath);
};
