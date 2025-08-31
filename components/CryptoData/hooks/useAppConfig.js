import path from "path";
import os from "os";

export const useAppConfig = () => {
  const configDir = path.join(os.homedir(), ".config/lazycrypto");
  const filePath = path.join(configDir);

  return { configDir, filePath };
};
