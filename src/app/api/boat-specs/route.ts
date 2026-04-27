import { NextRequest } from "next/server";
import { getDb } from "@/lib/db";
import { authenticateRequest, jsonError } from "@/lib/auth";
import { logActivity, getClientIp } from "@/lib/logger";

export async function GET(req: NextRequest) {
  const auth = await authenticateRequest(req);
  if ("error" in auth) return jsonError(auth.error, auth.status);

  const db = getDb();
  const dbResult = await db.execute("SELECT * FROM boat_specs ORDER BY model");
  const specs = dbResult.rows as any[];

  const finalResult: Record<string, any> = {};
  for (const s of specs) {
    finalResult[s.model] = {
      loa: s.loa, beam: s.beam, draft: s.draft,
      freshWaterCapacity: s.fresh_water_capacity,
      gasTank: s.gas_tank, height: s.height,
      recEngine: s.rec_engine, speedDesign: s.speed_design,
      passenger: s.passenger,
      images: JSON.parse(s.images_json || "[]"),
    };
  }

  return Response.json(finalResult);
}

export async function POST(req: NextRequest) {
  const auth = await authenticateRequest(req);
  if ("error" in auth) return jsonError(auth.error, auth.status);

  const body = await req.json();
  const db = getDb();

  try {
    await db.execute({
      sql: `INSERT INTO boat_specs (model, loa, beam, draft, fresh_water_capacity, gas_tank, height, rec_engine, speed_design, passenger, images_json)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        body.model || "", body.loa || "-", body.beam || "-", body.draft || "-",
        body.freshWaterCapacity || "-", body.gasTank || "-", body.height || "-",
        body.recEngine || "-", body.speedDesign || "-", body.passenger || "-",
        JSON.stringify(body.images || [])
      ]
    });

    await logActivity({
      userId: auth.user.id,
      userName: auth.user.name,
      action: "update_boat_spec",
      description: `เพิ่มข้อมูลสเปคเรือรุ่น: ${body.model}`,
      ipAddress: getClientIp(req)
    });

    return Response.json({ success: true }, { status: 201 });
  } catch (error: any) {
    if (error.message?.includes("UNIQUE")) {
      return jsonError("ชื่อรุ่นเรือซ้ำในระบบ", 409);
    }
    return jsonError("ไม่สามารถเพิ่มข้อมูลเรือได้", 500);
  }
}
