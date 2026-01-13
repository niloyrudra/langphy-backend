import fs from "fs";
import path from "path";
import { pgPool } from "./index.js";

const MIGRATIONS_DIR = path.join(
  process.cwd(),
  "src/db/migrations"
);

export const runMigrations = async () => {
  const client = await pgPool.connect();

  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        filename TEXT PRIMARY KEY,
        executed_at TIMESTAMP NOT NULL
      )
    `);

    const executed = await client.query(
      "SELECT filename FROM schema_migrations"
    );

    const executedFiles = new Set(
      executed.rows.map(row => row.filename)
    );

    const files = fs
      .readdirSync(MIGRATIONS_DIR)
      .filter(file => file.endsWith(".sql"))
      .sort();

    for (const file of files) {
      if (executedFiles.has(file)) continue;

      const sql = fs.readFileSync(
        path.join(MIGRATIONS_DIR, file),
        "utf-8"
      );

      console.log(`Running migration: ${file}`);
      await client.query(sql);

      await client.query(
        `INSERT INTO schema_migrations (filename, executed_at)
         VALUES ($1, NOW())`,
        [file]
      );
    }
  } finally {
    client.release();
  }
};