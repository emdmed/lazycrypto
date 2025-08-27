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
    console.warn(
      "Warning: isMin parameter requires running inside zellij terminal multiplexer",
    );
    console.warn("Please start zellij first: zellij");
    return;
  }

  try {
    const currentDir = process.cwd();

    execSync(`zellij run --direction down --cwd "${currentDir}" -- $SHELL`, {
      stdio: "ignore",
    });

    execSync("zellij action move-focus up", { stdio: "ignore" });

    for (let i = 0; i < 8; i++) {
      execSync("zellij action resize -", { stdio: "ignore" });
    }

    execSync("zellij action move-focus down", { stdio: "ignore" });
  } catch (error) {
    console.error("Failed to setup zellij layout:", error.message);
  }
};
