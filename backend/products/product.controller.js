import express from "express";
import productService from "./product.service.js";

const router = express.Router();

// routes
router.get("/", getAll);
router.get("/:id", getById);
router.get("/category/:category", getByCategory);

export default router;

// Get all products
function getAll(req, res, next) {
  productService
    .getAll()
    .then((products) => res.json(products))
    .catch(next);
}

// Get product by ID
function getById(req, res, next) {
  productService
    .getById(req.params.id)
    .then((product) => {
      if (product) {
        res.json(product);
      } else {
        res.status(404).json({ message: "Product not found" });
      }
    })
    .catch(next);
}

// Get products by category
function getByCategory(req, res, next) {
  productService
    .getByCategory(req.params.category)
    .then((products) => res.json(products))
    .catch(next);
}
