import { NextResponse } from "next/server";
import { getDb, initDb } from "@/lib/db";

export async function GET() {
  try {
    // Check if DB is accessible
    const db = getDb();
    await initDb(); // This will create tables if they don't exist
    
    // Auto-migrate newly added columns for production Turso DB
    const columnsToAdd = [
      "custom_images TEXT DEFAULT ''",
      "member_name TEXT DEFAULT ''",
      "member_phone TEXT DEFAULT ''",
      "frequency TEXT DEFAULT 'ไม่ระบุ'"
    ];

    for (const col of columnsToAdd) {
      try {
        await db.execute(`ALTER TABLE quotations ADD COLUMN ${col}`);
      } catch (e: any) {
        // Ignore if column already exists
      }
    }

    // Ensure users table has last_active if missing
    try {
      await db.execute("ALTER TABLE users ADD COLUMN last_active TEXT DEFAULT ''");
    } catch (e) {}

    await db.execute("SELECT 1");
    
    return NextResponse.json({ status: "ok", database: "connected, initialized, and migrated" });
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: "Database connection failed", details: error.message },
      { status: 500 }
    );
  }
}
