import bcrypt from "bcryptjs";
import db from "../_helpers/db.js";
import Role from "../_helpers/role.js";

const defaultAdminAccount = {
  email: "admin@qrorders.com",
  password: "Admin@123", // Default password - CHANGE THIS IN PRODUCTION!
  firstName: "Admin",
  lastName: "User",
  role: Role.Admin,
};

export async function seedAccounts() {
  try {
    console.log("🌱 Starting account seeding...");

    // Wait for database to be initialized
    await db.ready();

    // Check if admin account already exists
    const existingAdmin = await db.Account.findOne({
      where: { email: defaultAdminAccount.email },
    });

    if (existingAdmin) {
      console.log(
        `ℹ️  Admin account already exists (${defaultAdminAccount.email}). Skipping seeding.`,
      );
      return;
    }

    // Hash the password
    const passwordHash = await bcrypt.hash(defaultAdminAccount.password, 10);

    // Create admin account
    const adminAccount = await db.Account.create({
      email: defaultAdminAccount.email,
      passwordHash: passwordHash,
      firstName: defaultAdminAccount.firstName,
      lastName: defaultAdminAccount.lastName,
      role: defaultAdminAccount.role,
      verified: new Date(), // Auto-verify the admin account
      created: new Date(),
    });

    console.log(`✅ Successfully created admin account:`);
    console.log(`   - Email: ${adminAccount.email}`);
    console.log(`   - Role: ${adminAccount.role}`);
    console.log(
      `   - Password: ${defaultAdminAccount.password} (CHANGE THIS IN PRODUCTION!)`,
    );
    console.log(`   - Verified: Yes`);
  } catch (error) {
    console.error("❌ Error seeding accounts:", error);
    throw error;
  }
}

export default seedAccounts;
