import path from 'path';
import os from 'os';
import fs from 'fs/promises';

const configDir = path.join(os.homedir(), ".config/lazycrypto");
const filePath = path.join(configDir, "config.json");

let cachedCredentials = null;

export async function readJsonFromFile(filePath) {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading config file:', error);
    throw error;
  }
}

export async function loadCredentials() {
  if (cachedCredentials) {
    return cachedCredentials;
  }

  try {
    const configData = await readJsonFromFile(filePath);
    cachedCredentials = {
      apiKey: configData.kucoinApiKey,
      apiSecret: configData.kucoinApiSecret,
      apiPassphrase: configData.kucoinApiPassphrase,
    };
    return cachedCredentials;
  } catch (error) {
    console.error('Failed to load credentials:', error);
    throw new Error('Failed to load KuCoin credentials from config file');
  }
}

export function clearCredentialsCache() {
  cachedCredentials = null;
}