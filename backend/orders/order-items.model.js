import { DataTypes } from "sequelize";

export default function (sequelize) {
  const OrderItems = sequelize.define(
    "OrderItems",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      order_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "orders",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "products",
          key: "id",
        },
        onDelete: "RESTRICT",
      },
      product_name: {
        type: DataTypes.STRING(255),
        allowNull: false, // snapshot of name at order time
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      unit_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false, // Price snapshot
      },
      subtotal: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false, // quantity * unit_price
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "order_items",
      timestamps: false, // Only created_at, no updated_at
      createdAt: "created_at",
      updatedAt: false,
    },
  );

  return OrderItems;
}
