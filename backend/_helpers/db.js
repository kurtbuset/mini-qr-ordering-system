import mysql from "mysql2/promise";
import { Sequelize } from "sequelize";
import AccountModel from "../accounts/account.model.js";
import RefreshTokenModel from "../accounts/refresh-token.model.js";
import ProductModel from "../products/product.model.js";
import OrderModel from "../orders/order.model.js";
import OrderItemsModel from "../orders/order-items.model.js";

const db = {};

// Create a promise that resolves when initialization is complete
let initializationPromise = null;

// Initialize database
initializationPromise = initialize();

async function initialize() {
  try {
    // create db if it doesn't already exist
    const host = process.env.DB_HOST || "localhost";
    const port = process.env.DB_PORT || 3306;
    const user = process.env.DB_USER || "root";
    const password = process.env.DB_PASS || "";
    const database = process.env.DB_NAME || "mini-qr-ordering";

    const connection = await mysql.createConnection({
      host,
      port: parseInt(port),
      user,
      password,
    });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
    await connection.end();

    // connect to db
    const sequelize = new Sequelize(database, user, password, {
      host,
      port: parseInt(port),
      dialect: "mysql",
      logging: false, // Disable SQL logging to reduce noise
    });

    // init models and add them to the exported db object
    db.Account = AccountModel(sequelize);
    db.RefreshToken = RefreshTokenModel(sequelize);
    db.Product = ProductModel(sequelize);
    db.Order = OrderModel(sequelize);
    db.OrderItems = OrderItemsModel(sequelize);

    // define relationships
    db.Account.hasMany(db.RefreshToken, { onDelete: "CASCADE" });
    db.RefreshToken.belongsTo(db.Account);

    // Product and Order relationships
    db.Order.hasMany(db.OrderItems, {
      foreignKey: "order_id",
      as: "orderItems",
      onDelete: "CASCADE",
    });
    db.OrderItems.belongsTo(db.Order, {
      foreignKey: "order_id",
      as: "order",
    });

    db.Product.hasMany(db.OrderItems, {
      foreignKey: "product_id",
      as: "orderItems",
      onDelete: "RESTRICT",
    });
    db.OrderItems.belongsTo(db.Product, {
      foreignKey: "product_id",
      as: "product",
    });

    // Add sequelize instance to db object
    db.sequelize = sequelize;

    // sync all models with database - using force: false to prevent dropping tables
    // If you need to recreate tables, use the reset-db script instead
    await sequelize.sync({ force: false });

    console.log("✅ Database initialized successfully");
  } catch (error) {
    console.error("❌ Database initialization failed:", error.message);

    // If it's the "too many keys" error, provide helpful guidance
    if (error.message.includes("Too many keys specified")) {
      console.log("\n💡 To fix the 'too many keys' error:");
      console.log("   1. Run: npm run reset-db");
      console.log("   2. Then restart your server");
      console.log("   This will recreate the database with proper indexes.\n");
    }

    throw error;
  }
}

// Export a function to wait for initialization
db.ready = () => initializationPromise;

export default db;
