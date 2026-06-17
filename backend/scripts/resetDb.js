#!/usr/bin/env node

import "dotenv/config";
import mysql from "mysql2/promise";

async function resetDatabase() {
  const host = process.env.DB_HOST || "localhost";
  const port = process.env.DB_PORT || 3306;
  const user = process.env.DB_USER || "root";
  const password = process.env.DB_PASS || "";
  const database = process.env.DB_NAME || "mini-qr-ordering";

  try {
    console.log("🗑️  Resetting database...");

    // Connect to MySQL server (without selecting database)
    const connection = await mysql.createConnection({
      host,
      port: parseInt(port),
      user,
      password,
    });

    // Drop and recreate database
    await connection.query(`DROP DATABASE IF EXISTS \`${database}\`;`);
    console.log(`✅ Dropped database: ${database}`);

    await connection.query(`CREATE DATABASE \`${database}\`;`);
    console.log(`✅ Created database: ${database}`);

    await connection.end();
    console.log("✅ Database reset completed!");
  } catch (error) {
    console.error("❌ Error resetting database:", error);
    process.exit(1);
  }
}

resetDatabase();
