import { NextRequest } from "next/server";
import { authenticateRequest, jsonError } from "@/lib/auth";
import path from "path";
import fs from "fs";

export async function POST(req: NextRequest) {
  const auth = authenticateRequest(req);
  if ("error" in auth) return jsonError(auth.error, auth.status);

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file) return jsonError("ไม่พบไฟล์", 400);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create uploads directory
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Generate unique filename
    const ext = path.extname(file.name) || ".jpg";
    const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}${ext}`;
    const filepath = path.join(uploadsDir, filename);

    fs.writeFileSync(filepath, buffer);

    return Response.json({
      success: true,
      url: `/uploads/${filename}`,
      originalName: file.name,
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return jsonError("อัปโหลดไฟล์ไม่สำเร็จ", 500);
  }
}
