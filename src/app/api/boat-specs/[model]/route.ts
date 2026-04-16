import { NextRequest } from "next/server";
import { getDb } from "@/lib/db";
import { authenticateRequest, jsonError } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: Promise<{ model: string }> }) {
  const auth = authenticateRequest(req);
  if ("error" in auth) return jsonError(auth.error, auth.status);

  const { model } = await params;
  const decodedModel = decodeURIComponent(model);
  const db = getDb();
  const s = db.prepare("SELECT * FROM boat_specs WHERE model = ?").get(decodedModel) as any;
  if (!s) return jsonError("ไม่พบข้อมูลเรือ", 404);

  return Response.json({
    loa: s.loa, beam: s.beam, draft: s.draft,
    freshWaterCapacity: s.fresh_water_capacity,
    gasTank: s.gas_tank, height: s.height,
    recEngine: s.rec_engine, speedDesign: s.speed_design,
    passenger: s.passenger,
    images: JSON.parse(s.images_json || "[]"),
  });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ model: string }> }) {
  const auth = authenticateRequest(req);
  if ("error" in auth) return jsonError(auth.error, auth.status);

  const { model } = await params;
  const decodedModel = decodeURIComponent(model);
  const body = await req.json();
  const db = getDb();

  // If model name changed, handle rename
  if (body.newModel && body.newModel !== decodedModel) {
    db.prepare(`
      INSERT INTO boat_specs (model, loa, beam, draft, fresh_water_capacity, gas_tank, height, rec_engine, speed_design, passenger, images_json)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      body.newModel, body.loa || "-", body.beam || "-", body.draft || "-",
      body.freshWaterCapacity || "-", body.gasTank || "-", body.height || "-",
      body.recEngine || "-", body.speedDesign || "-", body.passenger || "-",
      JSON.stringify(body.images || [])
    );
    db.prepare("DELETE FROM boat_specs WHERE model = ?").run(decodedModel);
  } else {
    db.prepare(`
      UPDATE boat_specs SET loa = ?, beam = ?, draft = ?, fresh_water_capacity = ?,
      gas_tank = ?, height = ?, rec_engine = ?, speed_design = ?, passenger = ?, images_json = ?
      WHERE model = ?
    `).run(
      body.loa || "-", body.beam || "-", body.draft || "-",
      body.freshWaterCapacity || "-", body.gasTank || "-", body.height || "-",
      body.recEngine || "-", body.speedDesign || "-", body.passenger || "-",
      JSON.stringify(body.images || []),
      decodedModel
    );
  }

  return Response.json({ success: true });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ model: string }> }) {
  const auth = authenticateRequest(req);
  if ("error" in auth) return jsonError(auth.error, auth.status);

  const { model } = await params;
  const decodedModel = decodeURIComponent(model);
  const db = getDb();
  db.prepare("DELETE FROM boat_specs WHERE model = ?").run(decodedModel);

  return Response.json({ success: true });
}
