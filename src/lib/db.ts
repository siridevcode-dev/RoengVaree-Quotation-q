import { createClient, Client } from "@libsql/client";
import path from "path";
import { seedDatabase } from "./seed";

const DB_URL = process.env.TURSO_DATABASE_URL;
const DB_AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN;

// Singleton pattern for server-side DB connection
let _db: Client | null = null;

export function getDb(): Client {
  if (!DB_URL) {
    throw new Error("CRITICAL: TURSO_DATABASE_URL is missing!");
  }
  // Debug: Check if URL starts with libsql
  if (!DB_URL.startsWith("libsql")) {
    throw new Error(`CRITICAL: URL is invalid! It starts with: ${DB_URL.substring(0, 15)}...`);
  }
  if (!_db) {
    _db = createClient({
      url: DB_URL!,
      authToken: DB_AUTH_TOKEN,
    });
  }
  return _db;
}

export async function initDb() {
  const db = getDb();
  
  await db.execute(`
    -- Users table
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      username TEXT UNIQUE NOT NULL,
      phone TEXT DEFAULT '',
      email TEXT DEFAULT '',
      position TEXT DEFAULT '',
      role TEXT CHECK(role IN ('Admin','Manager','Editor','Viewer')) DEFAULT 'Viewer',
      status TEXT CHECK(status IN ('Active','Inactive')) DEFAULT 'Active',
      password_hash TEXT NOT NULL,
      last_active TEXT DEFAULT '',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await db.execute(`
    -- Customers table
    CREATE TABLE IF NOT EXISTS customers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT DEFAULT '',
      phone TEXT DEFAULT '',
      address TEXT DEFAULT '',
      tax_id TEXT DEFAULT '',
      total_quotations INTEGER DEFAULT 0,
      total_revenue REAL DEFAULT 0,
      last_activity TEXT DEFAULT '',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await db.execute(`
    -- Quotations table
    CREATE TABLE IF NOT EXISTS quotations (
      id TEXT PRIMARY KEY,
      customer_name TEXT NOT NULL,
      customer_email TEXT DEFAULT '',
      customer_phone TEXT DEFAULT '',
      customer_address TEXT DEFAULT '',
      customer_tax_id TEXT DEFAULT '',
      amount REAL DEFAULT 0,
      status TEXT DEFAULT 'ฉบับร่าง',
      date TEXT DEFAULT '',
      valid_until TEXT DEFAULT '',
      notes TEXT DEFAULT '',
      terms TEXT DEFAULT '',
      global_vat_enabled INTEGER DEFAULT 1,
      boat_model TEXT DEFAULT '',
      summary_discount_amount REAL DEFAULT 0,
      summary_discount_percentage REAL DEFAULT 0,
      include_optional_equipment INTEGER DEFAULT 1,
      frequency TEXT DEFAULT 'ไม่ระบุ',
      created_by TEXT DEFAULT '',
      member_name TEXT DEFAULT '',
      member_phone TEXT DEFAULT '',
      custom_images TEXT DEFAULT '',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await db.execute(`
    -- Quotation Line Items
    CREATE TABLE IF NOT EXISTS quotation_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      quotation_id TEXT NOT NULL,
      name TEXT NOT NULL,
      description TEXT DEFAULT '',
      quantity INTEGER DEFAULT 1,
      unit_price REAL DEFAULT 0,
      discount REAL DEFAULT 0,
      vat_enabled INTEGER DEFAULT 1,
      category TEXT DEFAULT '',
      sort_order INTEGER DEFAULT 0,
      FOREIGN KEY (quotation_id) REFERENCES quotations(id) ON DELETE CASCADE
    );
  `);

  await db.execute(`
    -- Products table
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT DEFAULT '',
      unit_price REAL DEFAULT 0,
      unit TEXT DEFAULT 'ชุด',
      description TEXT DEFAULT '',
      sku TEXT UNIQUE,
      in_stock INTEGER DEFAULT 1,
      boat_model TEXT DEFAULT '',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await db.execute(`
    -- Templates
    CREATE TABLE IF NOT EXISTS templates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      customer TEXT DEFAULT '',
      items_count INTEGER DEFAULT 0,
      amount REAL DEFAULT 0,
      frequency TEXT DEFAULT 'รายเดือน',
      last_used TEXT DEFAULT '-',
      next_due TEXT DEFAULT '-',
      is_active INTEGER DEFAULT 1,
      line_items_json TEXT DEFAULT '[]',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await db.execute(`
    -- Settings (key-value)
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);

  await db.execute(`
    -- Boat Specifications
    CREATE TABLE IF NOT EXISTS boat_specs (
      model TEXT PRIMARY KEY,
      loa TEXT DEFAULT '-',
      beam TEXT DEFAULT '-',
      draft TEXT DEFAULT '-',
      fresh_water_capacity TEXT DEFAULT '-',
      gas_tank TEXT DEFAULT '-',
      height TEXT DEFAULT '-',
      rec_engine TEXT DEFAULT '-',
      speed_design TEXT DEFAULT '-',
      passenger TEXT DEFAULT '-',
      images_json TEXT DEFAULT '[]'
    );
  `);

  await seedDatabase(db);
}
