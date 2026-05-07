import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { hashPassword } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const db = getDb();
    
    // Check if admin user exists
    const result = await db.execute("SELECT * FROM users WHERE username = 'admin'");
    const adminUser = result.rows[0];
    
    const hashedPassword = hashPassword("admin");
    
    if (adminUser) {
      await db.execute({
        sql: "UPDATE users SET password_hash = ?, name = 'Admin', role = 'Admin' WHERE username = 'admin'",
        args: [hashedPassword]
      });
      return NextResponse.json({ message: "Updated admin password successfully" });
    } else {
      // Check if Manager exists and convert it to Admin
      const managerResult = await db.execute("SELECT * FROM users WHERE username = 'Manager'");
      const managerUser = managerResult.rows[0];

      if (managerUser) {
          await db.execute({
              sql: "UPDATE users SET username = 'admin', name = 'Admin', password_hash = ?, role = 'Admin' WHERE username = 'Manager'",
              args: [hashedPassword]
          });
          return NextResponse.json({ message: "Converted Manager user to admin successfully" });
      } else {
          // Create admin user from scratch
          await db.execute({
            sql: `INSERT INTO users (id, name, username, phone, email, position, role, status, password_hash, last_active)
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            args: ["U999", "Admin", "admin", "-", "-", "Admin", "Admin", "Active", hashedPassword, ""]
          });
          return NextResponse.json({ message: "Created admin user successfully" });
      }
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
