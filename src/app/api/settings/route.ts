import { NextRequest } from "next/server";
import { getDb } from "@/lib/db";
import { authenticateRequest, jsonError } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const auth = await authenticateRequest(req);
  if ("error" in auth) return jsonError(auth.error, auth.status);

  const db = getDb();
  const result = await db.execute("SELECT * FROM settings");
  const rows = result.rows as any[];

  const settings: Record<string, any> = {};
  for (const row of rows) {
    try {
      settings[row.key] = JSON.parse(row.value);
    } catch {
      settings[row.key] = row.value;
    }
  }

  return Response.json(settings);
}

export async function PUT(req: NextRequest) {
  const auth = await authenticateRequest(req);
  if ("error" in auth) return jsonError(auth.error, auth.status);

  const body = await req.json();
  const db = getDb();

  const statements = Object.entries(body).map(([key, value]) => ({
    sql: `INSERT INTO settings (key, value) VALUES (?, ?)
          ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
    args: [key, JSON.stringify(value)]
  }));

  await db.batch(statements, "write");

  return Response.json({ success: true });
}
