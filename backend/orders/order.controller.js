import express from "express";
import orderService from "./order.service.js";
import authorize from "../_middleware/authorize.js";
import Role from "../_helpers/role.js";

const router = express.Router();

// routes
router.get("/", authorize(Role.Admin), getAll);
router.get("/:id", authorize(Role.Admin), getById);
router.post("/", create);
router.put("/:id", update);

export default router;

// Get all orders
function getAll(req, res, next) {
  orderService
    .getAll()
    .then((orders) => res.json(orders))
    .catch(next);
}

// Get order by ID
function getById(req, res, next) {
  orderService
    .getById(req.params.id)
    .then((order) => {
      if (order) {
        res.json(order);
      } else {
        res.status(404).json({ message: "Order not found" });
      }
    })
    .catch(next);
}

// Create new order
function create(req, res, next) {
  orderService
    .create(req.body)
    .then((order) => {
      // Emit new order event via Socket.IO to Admin room only
      const io = req.app.get("io");
      if (io) {
        io.to("admin").emit("newOrder", order);
        console.log("New order emitted to admin room:", order.id);
      }
      res.status(201).json(order);
    })
    .catch(next);
}

// Update order
function update(req, res, next) {
  orderService
    .update(req.params.id, req.body)
    .then((order) => {
      // Emit order update event via Socket.IO to Admin room only
      const io = req.app.get("io");
      if (io) {
        io.to("admin").emit("orderUpdated", order);
        console.log("Order update emitted to admin room:", order.id);
      }
      res.json(order);
    })
    .catch(next);
}
