import { NextResponse } from "next/server";
import { getDb, initDb } from "@/lib/db";

export async function GET() {
  try {
    // Check if DB is accessible
    const db = getDb();
    await initDb(); // This will create tables if they don't exist
    await db.execute("SELECT 1");
    
    return NextResponse.json({ status: "ok", database: "connected and initialized" });
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: "Database connection failed", details: error.message },
      { status: 500 }
    );
  }
}
