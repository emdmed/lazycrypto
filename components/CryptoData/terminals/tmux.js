import { execSync } from "child_process";

const isRunningInTmux = () => {
  return !!(
    process.env.TMUX ||
    process.env.TMUX_PANE ||
    process.env.TMUX_SESSION
  );
};

export const setupTmuxLayout = () => {
  if (!isRunningInTmux()) {
    return;
  }

  try {
    const currentDir = process.cwd();

    execSync(`tmux split-window -v -c "${currentDir}"`, {
      stdio: "ignore",
    });

    execSync("tmux select-pane -U", { stdio: "ignore" });

    execSync("tmux resize-pane -y 3", { stdio: "ignore" });

    execSync("tmux select-pane -D", { stdio: "ignore" });
  } catch (error) {
    console.error("Failed to setup tmux layout:", error.message);
  }
};

export const expandPanelTMUX = (times) => {
  if (!isRunningInTmux()) return;
  execSync(`tmux resize-pane -U ${lines}`, { stdio: "ignore" });
};

export const contractPanelTMUX = (times) => {
  if (!isRunningInTmux()) return;
  execSync(`tmux resize-pane -D ${lines}`, { stdio: "ignore" });
};
