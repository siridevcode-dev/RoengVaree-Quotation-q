import { NextRequest } from "next/server";
import { getDb } from "@/lib/db";
import { authenticateRequest, jsonError } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await authenticateRequest(req);
  if ("error" in auth) return jsonError(auth.error, auth.status);

  const { id } = await params;
  if (!id) return jsonError("Quotation ID is required", 400);

  const db = getDb();

  try {
    // Search for activity logs related to this quotation ID
    // We look for the pattern '#ID' in the description
    const searchPattern = `%#${id}%`;
    
    const result = await db.execute({
      sql: `SELECT id, user_id, user_name, action, description, ip_address, created_at
            FROM activity_logs
            WHERE (action = 'create_quotation' OR action = 'update_quotation')
            AND description LIKE ?
            ORDER BY created_at DESC`,
      args: [searchPattern]
    });

    const logs = result.rows.map((row: any) => ({
      id: row.id,
      userId: row.user_id,
      userName: row.user_name,
      action: row.action,
      description: row.description,
      ipAddress: row.ip_address,
      createdAt: row.created_at,
    }));

    return Response.json(logs);
  } catch (error: any) {
    console.error("Failed to fetch quotation history:", error);
    return jsonError("ไม่สามารถดึงข้อมูลประวัติได้", 500);
  }
}
