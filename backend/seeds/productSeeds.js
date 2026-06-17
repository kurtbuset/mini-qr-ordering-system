import db from "../_helpers/db.js";

const productSeedsData = [
  // Burgers
  {
    name: "Classic American Burger",
    description:
      "A classic American-style burger with all the traditional fixings",
    price: 10.99,
    category: "Burgers",
    image_url: "/images/classic-american-burger.jpg",
    is_available: true,
  },
  {
    name: "Hamburger",
    description: "Simple and delicious hamburger with fresh ingredients",
    price: 9.99,
    category: "Burgers",
    image_url: "/images/hamburger.jpg",
    is_available: true,
  },
  {
    name: "Cheesy Burger",
    description: "Juicy burger loaded with melted cheese",
    price: 8.5,
    category: "Burgers",
    image_url: "/images/cheesy-burger.jpg",
    is_available: true,
  },
  {
    name: "Hawaiian Burger",
    description: "Tropical burger with pineapple and Hawaiian-style toppings",
    price: 11.0,
    category: "Burgers",
    image_url: "/images/hawaiian-burger.jpg",
    is_available: true,
  },

  // Hotdogs
  {
    name: "Classic HotDog",
    description: "Traditional hotdog with mustard and ketchup",
    price: 6.0,
    category: "Hotdogs",
    image_url: "/images/classic-hotdog.jpg",
    is_available: true,
  },
  {
    name: "Cheesy HotDog",
    description: "Hotdog topped with melted cheese",
    price: 8.5,
    category: "Hotdogs",
    image_url: "/images/cheesy-hotdog.jpg",
    is_available: true,
  },
  {
    name: "XL HotDog",
    description: "Extra large hotdog with premium toppings",
    price: 10.99,
    category: "Hotdogs",
    image_url: "/images/xl-hotdog.jpg",
    is_available: true,
  },

  // Drinks
  {
    name: "Coke",
    description: "Refreshing Coca-Cola soft drink",
    price: 2.99,
    category: "Drinks",
    image_url: "/images/coke.jpg",
    is_available: true,
  },
  {
    name: "Juice",
    description: "Fresh fruit juice - ask for available flavors",
    price: 3.5,
    category: "Drinks",
    image_url: "/images/juice.jpg",
    is_available: true,
  },
  {
    name: "Coffee",
    description: "Freshly brewed coffee",
    price: 4.5,
    category: "Drinks",
    image_url: "/images/coffee.jpg",
    is_available: true,
  },
];

export async function seedProducts() {
  try {
    console.log("🌱 Starting product seeding...");

    // Wait for database to be initialized
    await db.ready();

    // Check if products already exist to avoid duplicates
    const existingProductsCount = await db.Product.count();

    if (existingProductsCount > 0) {
      console.log(
        `ℹ️  Products already exist (${existingProductsCount} found). Skipping seeding to avoid duplicates.`,
      );
      return;
    }

    // Create products
    const createdProducts = await db.Product.bulkCreate(productSeedsData, {
      validate: true,
      returning: true,
    });

    console.log(`✅ Successfully seeded ${createdProducts.length} products:`);
    createdProducts.forEach((product) => {
      console.log(
        `   - ${product.name} ($${product.price}) [${product.category}]`,
      );
    });
  } catch (error) {
    console.error("❌ Error seeding products:", error);
    throw error;
  }
}

export default seedProducts;
