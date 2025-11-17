import initSqlJs from 'sql.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbPath = join(__dirname, 'flights.db');

let db;

async function initDatabase() {
    const SQL = await initSqlJs();

    // Load existing database or create a new one
    if (fs.existsSync(dbPath)) {
        const buffer = fs.readFileSync(dbPath);
        db = new SQL.Database(buffer);
    } else {
        db = new SQL.Database();
    }

    // Create flights table if it doesn't exist
    db.run(`
    CREATE TABLE IF NOT EXISTS flights (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      flight_number VARCHAR(10) NOT NULL,
      destination VARCHAR(100) NOT NULL,
      departure_time VARCHAR(10) NOT NULL,
      comments TEXT,
      type VARCHAR(10) NOT NULL CHECK(type IN ('salida', 'llegada')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

    saveDatabase();
    return db;
}

function saveDatabase() {
    if (db) {
        const data = db.export();
        fs.writeFileSync(dbPath, data);
    }
}

export { initDatabase, saveDatabase };
export default { initDatabase, saveDatabase };
