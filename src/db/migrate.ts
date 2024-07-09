import * as dotenv from 'dotenv';
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import drizzleConfig from "../../drizzle.config";

dotenv.config({ path: '.env.local' });

const DATABASE_URL = process.env.SUPABASE_DB_CONNECTION;

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

const migrationClient = postgres(DATABASE_URL, { max: 1 });
const db: PostgresJsDatabase = drizzle(migrationClient);

const main = async () => {
  console.log("Migrating database...");
  await migrate(db, { migrationsFolder: drizzleConfig.out! });
  await migrationClient.end();
  console.log("Database migrated successfully!");
};

main();