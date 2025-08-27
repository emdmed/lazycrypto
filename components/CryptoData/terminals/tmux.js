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
    console.warn(
      "Warning: isMin parameter requires running inside tmux terminal multiplexer"
    );
    console.warn("Please start tmux first: tmux");
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