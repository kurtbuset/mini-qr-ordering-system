#!/usr/bin/env node

import "dotenv/config";
import runAllSeeds from "./index.js";

// Run seeds directly
async function main() {
  console.log("🌱 Running seeds manually...");

  try {
    await runAllSeeds();
    console.log("✅ Seeds completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeds failed:", error);
    process.exit(1);
  }
}

main();
