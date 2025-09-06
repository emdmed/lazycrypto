import { execSync } from "child_process";

const isRunningInZellij = () => {
  return !!(
    process.env.ZELLIJ_SESSION_NAME ||
    process.env.ZELLIJ ||
    process.env.ZELLIJ_PANE_ID
  );
};

export const setupZellijLayout = () => {
  if (!isRunningInZellij()) {
    return;
  }

  try {
    const currentDir = process.cwd();

    execSync(`zellij run --direction down --cwd "${currentDir}" -- $SHELL`, {
      stdio: "ignore",
    });

    execSync("zellij action move-focus up", { stdio: "ignore" });

    for (let i = 0; i < 3; i++) {
      execSync("zellij action resize -", { stdio: "ignore" });
    }

    execSync("zellij action move-focus down", { stdio: "ignore" });
  } catch (error) {
    console.error("Failed to setup zellij layout:", error.message);
  }
};

export const expandPanelZellij = (times) => {
  if (!isRunningInZellij()) return;
  for (let i = 0; i < times; i++) {
    execSync("zellij action resize +", { stdio: "ignore" });
  }
};

export const contractPanelZellij = (times) => {
  if (!isRunningInZellij()) return;
  for (let i = 0; i < times; i++) {
    execSync("zellij action resize -", { stdio: "ignore" });
  }
};
