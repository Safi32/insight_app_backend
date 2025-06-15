const fs = require("fs");
const path = require("path");

const ROOT_DIR = path.join(__dirname, "../../");
const ENV_PATH = path.join(ROOT_DIR, ".env");
const EXAMPLE_PATH = path.join(ROOT_DIR, ".env.example");

if (!fs.existsSync(ENV_PATH)) {
  console.error(".env file not found!");
  process.exit(1);
}

const envContent = fs.readFileSync(ENV_PATH, "utf-8");

const keys = envContent
  .split("\n")
  .filter((line) => line.trim() && !line.trim().startsWith("#"))
  .map((line) => line.split("=")[0].trim());

const exampleContent = keys.map((key) => `${key}=`).join("\n");

fs.writeFileSync(EXAMPLE_PATH, exampleContent);
console.log(".env.example updated!");
