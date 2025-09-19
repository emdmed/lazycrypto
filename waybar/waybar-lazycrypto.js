#!/usr/bin/env node

import dotenv from "dotenv";
dotenv.config();

import { fetchPrice } from "./fetchPrice.js";
const symbol = process.argv[2]
const color = process.argv[3]

export const main = async () => {
  try {
    await fetchPrice({ selectedTimeframe: "1hour", symbol, color });
  } catch (error) {
    console.log(symbol, "Failed");
    process.stderr.write(`Error: ${error.message}\n`);
  }
  process.exit(0);
};

main();
