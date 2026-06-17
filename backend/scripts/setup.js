#!/usr/bin/env node

import "dotenv/config";
import mysql from "mysql2/promise";
import { Sequelize } from "sequelize";
import AccountModel from "../accounts/account.model.js";
import RefreshTokenModel from "../accounts/refresh-token.model.js";
import ProductModel from "../products/product.model.js";
import OrderModel from "../orders/order.model.js";
import OrderItemsModel from "../orders/order-items.model.js";
import runAllSeeds from "../seeds/index.js";

async function setupDatabase() {
  const host = process.env.DB_HOST || "localhost";
  const port = process.env.DB_PORT || 3306;
  const user = process.env.DB_USER || "root";
  const password = process.env.DB_PASS || "";
  const database = process.env.DB_NAME || "mini-qr-ordering";

  try {
    console.log("🚀 Starting database setup...");

    // Create database if it doesn't exist
    const connection = await mysql.createConnection({
      host,
      port: parseInt(port),
      user,
      password,
    });

    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
    console.log(`✅ Database "${database}" ready`);
    await connection.end();

    // Connect with Sequelize
    const sequelize = new Sequelize(database, user, password, {
      host,
      port: parseInt(port),
      dialect: "mysql",
      logging: false,
    });

    // Initialize models
    const models = {
      Account: AccountModel(sequelize),
      RefreshToken: RefreshTokenModel(sequelize),
      Product: ProductModel(sequelize),
      Order: OrderModel(sequelize),
      OrderItems: OrderItemsModel(sequelize),
    };

    // Define relationships
    models.Account.hasMany(models.RefreshToken, { onDelete: "CASCADE" });
    models.RefreshToken.belongsTo(models.Account);

    models.Order.hasMany(models.OrderItems, {
      foreignKey: "order_id",
      as: "orderItems",
      onDelete: "CASCADE",
    });
    models.OrderItems.belongsTo(models.Order, {
      foreignKey: "order_id",
      as: "order",
    });

    models.Product.hasMany(models.OrderItems, {
      foreignKey: "product_id",
      as: "orderItems",
      onDelete: "RESTRICT",
    });
    models.OrderItems.belongsTo(models.Product, {
      foreignKey: "product_id",
      as: "product",
    });

    // Create tables
    await sequelize.sync({ force: true }); // force: true will recreate tables
    console.log("✅ Tables created successfully");

    // Close the connection for this script
    await sequelize.close();
    console.log("✅ Database setup completed!");

    // Run seeds
    console.log("🌱 Running seeds...");
    await runAllSeeds();
  } catch (error) {
    console.error("❌ Setup failed:", error);
    process.exit(1);
  }
}

setupDatabase();
