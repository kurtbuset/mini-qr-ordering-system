import db from "../_helpers/db.js";

async function addPaymentFields() {
  try {
    console.log("Adding payment transaction fields to orders table...");

    // Wait for database to initialize
    await db.ready();

    const queryInterface = db.sequelize.getQueryInterface();

    // Check if columns already exist
    const tableDescription = await queryInterface.describeTable("orders");

    // Add payment_transaction_id if it doesn't exist
    if (!tableDescription.payment_transaction_id) {
      await queryInterface.addColumn("orders", "payment_transaction_id", {
        type: db.sequelize.Sequelize.STRING(100),
        allowNull: true,
      });
      console.log("✓ Added payment_transaction_id column");
    } else {
      console.log("✓ payment_transaction_id column already exists");
    }

    // Add payment_card_last4 if it doesn't exist
    if (!tableDescription.payment_card_last4) {
      await queryInterface.addColumn("orders", "payment_card_last4", {
        type: db.sequelize.Sequelize.STRING(4),
        allowNull: true,
      });
      console.log("✓ Added payment_card_last4 column");
    } else {
      console.log("✓ payment_card_last4 column already exists");
    }

    // Add payment_card_type if it doesn't exist
    if (!tableDescription.payment_card_type) {
      await queryInterface.addColumn("orders", "payment_card_type", {
        type: db.sequelize.Sequelize.STRING(20),
        allowNull: true,
      });
      console.log("✓ Added payment_card_type column");
    } else {
      console.log("✓ payment_card_type column already exists");
    }

    console.log("\n✓ Payment fields migration completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("✗ Migration failed:", error);
    process.exit(1);
  }
}

addPaymentFields();
