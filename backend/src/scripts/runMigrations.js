require("../config/env");
const { AppDataSource } = require("../config/data-source");

async function run() {
  try {
    console.log("Initializing data source for migrations...");
    await AppDataSource.initialize();
    const dbType = AppDataSource.options.type;
    console.log(`Data source initialized using driver: ${dbType}.`);

    if (dbType === "sqlite") {
      console.log(
        "SQLite detected. Schema synchronized automatically (synchronize=true). No migrations to run."
      );
      return;
    }

    console.log("Running migrations...");
    const results = await AppDataSource.runMigrations();

    results.forEach((migration) => {
      console.log(`Executed migration: ${migration.name}`);
    });

    console.log("Migrations have been successfully executed.");
  } catch (error) {
    if (error.code === "ECONNREFUSED") {
      console.error(
        "\n❌ Error: Could not connect to the database. Please ensure your MySQL server is running and the connection details in your .env file are correct.\n"
      );
    } else {
      console.error("Error running migrations:", error);
    }
    process.exit(1);
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }
}

run();
