import { NextRequest } from "next/server";
import { getDb } from "@/lib/db";
import { verifyPassword, signToken, jsonError } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password } = body;

    if (!username || !password) {
      return jsonError("กรุณากรอกชื่อผู้ใช้และรหัสผ่าน", 400);
    }

    const db = getDb();
    const user = db.prepare(`
      SELECT * FROM users 
      WHERE username = ? OR name = ? OR phone = ?
    `).get(username, username, username) as any;

    if (!user) {
      return jsonError("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง", 401);
    }

    if (!verifyPassword(password, user.password_hash)) {
      return jsonError("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง", 401);
    }

    if (user.status === "Inactive") {
      return jsonError("บัญชีของคุณถูกระงับการใช้งานชั่วคราว", 403);
    }

    // Update last active
    db.prepare("UPDATE users SET last_active = ? WHERE id = ?")
      .run(new Date().toLocaleString("th-TH"), user.id);

    const token = signToken({
      userId: user.id,
      username: user.username,
      role: user.role,
    });

    return Response.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        phone: user.phone,
        email: user.email,
        position: user.position,
        role: user.role,
        status: user.status,
        lastActive: user.last_active,
      },
    });
  } catch (error: any) {
    console.error("Login error:", error);
    return jsonError("เกิดข้อผิดพลาดภายในระบบ", 500);
  }
}
