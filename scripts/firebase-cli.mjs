import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const firebaseBin = fileURLToPath(new URL("../code/node_modules/firebase-tools/lib/bin/firebase.js", import.meta.url));

const child = spawn(process.execPath, [firebaseBin, ...process.argv.slice(2)], {
  stdio: "inherit",
  env: {
    ...process.env,
    FIREBASE_CLI_DISABLE_UPDATE_CHECK: "true",
  },
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
  } else {
    process.exit(code ?? 0);
  }
});
