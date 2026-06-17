import db from "../_helpers/db.js";

export default {
  getAll,
  getById,
  getByCategory,
};

// Get all products
async function getAll() {
  const products = await db.Product.findAll({
    order: [
      ["category", "ASC"],
      ["name", "ASC"],
    ],
  });
  return products;
}

// Get product by ID
async function getById(id) {
  const product = await db.Product.findByPk(id);
  return product;
}

// Get products by category
async function getByCategory(category) {
  const products = await db.Product.findAll({
    where: {
      category: category,
      is_available: true,
    },
    order: [["name", "ASC"]],
  });
  return products;
}
