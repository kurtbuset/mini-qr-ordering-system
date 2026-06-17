import { DataTypes } from "sequelize";

export default function (sequelize) {
  const Order = sequelize.define(
    "Order",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      order_number: {
        type: DataTypes.STRING(50),
        unique: true,
        allowNull: false,
      },
      table_number: {
        type: DataTypes.STRING(20),
        allowNull: true, // NULL for takeout
      },
      customer_name: {
        type: DataTypes.STRING(100),
        allowNull: true, // For takeout identification
      },
      total_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      order_type: {
        type: DataTypes.ENUM("dine_in", "takeout"),
        allowNull: false,
      },
      order_status: {
        type: DataTypes.ENUM("pending", "completed", "cancelled"),
        defaultValue: "pending",
      },
      payment_method: {
        type: DataTypes.ENUM("debit_card", "credit_card", "pay_at_counter"),
        allowNull: false,
      },
      payment_status: {
        type: DataTypes.ENUM("pending", "paid", "failed"),
        defaultValue: "pending",
      },
      payment_notes: {
        type: DataTypes.STRING(500),
        allowNull: true, // mock failure reason or payment ref
      },
      payment_transaction_id: {
        type: DataTypes.STRING(100),
        allowNull: true, // Transaction ID from payment gateway
      },
      payment_card_last4: {
        type: DataTypes.STRING(4),
        allowNull: true, // Last 4 digits of card
      },
      payment_card_type: {
        type: DataTypes.STRING(20),
        allowNull: true, // Visa, Mastercard, etc.
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "orders",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  );

  return Order;
}
