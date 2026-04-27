import { getDb } from "./db";

export type LogAction = 
  | "login" 
  | "logout" 
  | "create_quotation" 
  | "update_quotation" 
  | "delete_quotation"
  | "create_customer"
  | "update_customer"
  | "delete_customer"
  | "create_product"
  | "update_product"
  | "delete_product"
  | "create_po"
  | "update_po"
  | "delete_po"
  | "create_user"
  | "update_user"
  | "delete_user"
  | "update_settings"
  | "update_boat_spec"
  | "other";

export async function logActivity({
  userId,
  userName,
  action,
  description,
  ipAddress = "-",
}: {
  userId: string;
  userName: string;
  action: LogAction;
  description: string;
  ipAddress?: string;
}) {
  const db = getDb();
  try {
    await db.execute({
      sql: `INSERT INTO activity_logs (user_id, user_name, action, description, ip_address)
            VALUES (?, ?, ?, ?, ?)`,
      args: [userId, userName, action, description, ipAddress],
    });
    return true;
  } catch (error) {
    console.error("Failed to log activity:", error);
    return false;
  }
}

export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : req.headers.get("x-real-ip") || "-";
  return ip;
}
