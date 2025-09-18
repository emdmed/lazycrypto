#!/usr/bin/env node

//waybar-bitcoin.js

import dotenv from "dotenv";
dotenv.config();

import { fetchBitcoinPrice } from "./components/StringRender/fetchPrice.js";

// Simple script just for waybar
const main = async () => {
  try {
    await fetchBitcoinPrice("1hour");
  } catch (error) {
    console.log("₿ Failed");
    process.stderr.write(`Error: ${error.message}\n`);
  }
  process.exit(0);
};

main();
