import { NextRequest } from "next/server";
import { authenticateRequest, jsonError } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const auth = await authenticateRequest(req);
  if ("error" in auth) {
    return jsonError(auth.error, auth.status);
  }

  return Response.json({ user: auth.user });
}
