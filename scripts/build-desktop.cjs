const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const appUrl = process.env.MASAR_APP_URL;
if (!appUrl) {
  console.error("MASAR_APP_URL is required, for example https://masar.example.com");
  process.exit(1);
}

const configPath = path.join(__dirname, "..", "electron", "app-config.cjs");
fs.writeFileSync(configPath, `module.exports = { appUrl: ${JSON.stringify(appUrl)} };\n`);

const command = process.platform === "win32" ? "electron-builder.cmd" : "electron-builder";
const result = spawnSync(command, { stdio: "inherit", shell: true });
process.exit(result.status ?? 1);