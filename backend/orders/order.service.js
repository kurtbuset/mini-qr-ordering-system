import db from "../_helpers/db.js";

export default {
  getAll,
  getById,
  create,
  update,
};

// Get all orders
async function getAll() {
  const orders = await db.Order.findAll({
    include: [
      {
        model: db.OrderItems,
        as: "orderItems",
        include: [
          {
            model: db.Product,
            as: "product",
          },
        ],
      },
    ],
    order: [["created_at", "DESC"]],
  });
  return orders;
}

// Get order by ID
async function getById(id) {
  const order = await db.Order.findByPk(id, {
    include: [
      {
        model: db.OrderItems,
        as: "orderItems",
        include: [
          {
            model: db.Product,
            as: "product",
          },
        ],
      },
    ],
  });
  return order;
}

// Create new order
async function create(params) {
  const { items, ...orderData } = params;

  // Generate order number in format ORD-00001
  const lastOrder = await db.Order.findOne({
    order: [["id", "DESC"]],
  });

  const nextNumber = lastOrder ? lastOrder.id + 1 : 1;
  const orderNumber = `ORD-${String(nextNumber).padStart(5, "0")}`;
  orderData.order_number = orderNumber;

  // Process payment status based on method and transaction data
  if (orderData.payment_method === "pay_at_counter") {
    orderData.payment_status = "pending";
  } else if (
    orderData.payment_method === "debit_card" ||
    orderData.payment_method === "credit_card"
  ) {
    // If we have transaction data, payment was successful
    if (orderData.payment_transaction_id) {
      orderData.payment_status = "paid";
      orderData.payment_notes = `Payment successful. Transaction ID: ${orderData.payment_transaction_id}`;
    } else {
      // No transaction ID means payment failed or wasn't processed
      orderData.payment_status = "failed";
      orderData.payment_notes = "Payment processing failed";
    }
  }

  // Create order
  const order = await db.Order.create(orderData);

  // Create order items if provided
  if (items && items.length > 0) {
    const orderItems = items.map((item) => ({
      ...item,
      order_id: order.id,
    }));

    await db.OrderItems.bulkCreate(orderItems);

    // Return order with items
    return getById(order.id);
  }

  return order;
}

// Update order
async function update(id, params) {
  const order = await db.Order.findByPk(id);

  if (!order) {
    throw new Error("Order not found");
  }

  // Update order
  await order.update(params);

  return getById(id);
}
