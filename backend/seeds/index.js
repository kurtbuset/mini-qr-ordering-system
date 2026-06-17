import seedProducts from "./productSeeds.js";
import seedAccounts from "./accountSeeds.js";

export async function runAllSeeds() {
  try {
    console.log("🌱 Running all seeds...");

    // Run account seeds first (creates admin account)
    await seedAccounts();

    // Run product seeds
    await seedProducts();

    console.log("✅ All seeds completed successfully!");
  } catch (error) {
    console.error("❌ Error running seeds:", error);
    throw error;
  }
}

export { seedProducts, seedAccounts };
export default runAllSeeds;
