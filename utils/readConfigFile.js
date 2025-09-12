import path from "path"
import os from "os"
import { readJsonFromFile } from "./readJsonFile.js";
import { writeJsonToFile } from "./writeJsonFile.js";

export const readConfigFile = async () => {
  const configDir = path.join(os.homedir(), ".config/lazycrypto");
  const filePath = path.join(configDir, "config.json");
  return await readJsonFromFile(filePath);
}

export const writeConfigFile = async (jsonFile) => {
  const configDir = path.join(os.homedir(), ".config/lazycrypto");
  const filePath = path.join(configDir, "config.json");

  if (!jsonFile) return

  await writeJsonToFile(jsonFile, filePath)

}
