import { Client } from "@libsql/client";
import { hashPassword } from "./auth";

export async function seedDatabase(db: Client) {
  // Check if already seeded
  const result = await db.execute("SELECT COUNT(*) as count FROM users");
  const userCount = result.rows[0].count as number;
  if (userCount > 0) return;

  console.log("🌱 Seeding database with initial data...");

  // ----- Users -----
  const usersData = [
    ["U001", "สมชาย ใจดี", "somchai", "081-234-5678", "somchai@roengvaree.com", "ผู้จัดการฝ่ายขาย", "Admin", "Active", hashPassword("password123"), "30/03/2026 07:05"],
    ["U002", "วิภาดา สายลม", "wiphada", "082-345-6789", "", "", "Manager", "Active", hashPassword("password123"), "30/03/2026 06:12"],
    ["U003", "กิตติพงษ์ มั่นคง", "kittipong", "083-456-7890", "", "", "Editor", "Active", hashPassword("password123"), "29/03/2026 18:45"],
    ["U004", "นารี รัตนา", "naree", "084-567-8901", "", "", "Viewer", "Inactive", hashPassword("password123"), "25/03/2026 10:20"],
    ["U005", "Admin", "admin", "", "", "Admin", "Admin", "Active", hashPassword("Admin1230"), ""],
  ];

  await db.batch(
    usersData.map(u => ({
      sql: `INSERT INTO users (id, name, username, phone, email, position, role, status, password_hash, last_active)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: u
    })),
    "write"
  );

  // ----- Customers -----
  const customersData = [
    ["Acme Corporation", "contact@acme.com", "02-123-4567", "เลขที่ 123 ถ.สุขุมวิท กรุงเทพฯ", "0105-5XX-XXXX", 24, 1520000, "29/03/2026"],
    ["TechStart Inc.", "info@techstart.co.th", "02-234-5678", "เลขที่ 456 ถ.พหลโยธิน กรุงเทพฯ", "0105-6XX-XXXX", 12, 620000, "28/03/2026"],
    ["Global Solutions Ltd.", "sales@globalsol.com", "02-345-6789", "เลขที่ 789 ถ.รัชดา กรุงเทพฯ", "0105-7XX-XXXX", 18, 980000, "27/03/2026"],
    ["บริษัท สยามเทค จำกัด", "info@siamtech.co.th", "02-456-7890", "เลขที่ 321 ถ.เพชรบุรี กรุงเทพฯ", "0105-8XX-XXXX", 15, 750000, "26/03/2026"],
  ];

  await db.batch(
    customersData.map(c => ({
      sql: `INSERT INTO customers (name, email, phone, address, tax_id, total_quotations, total_revenue, last_activity)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      args: c
    })),
    "write"
  );

  // ----- Products -----
  const productsData = [
    ["เรือสปีดโบ๊ท 24 ฟุต", "เรือ", 850000, "ลำ", "เรือสปีดโบ๊ทพร้อมใช้งาน รวมชุดเบาะและระบบไฟ", "BOAT-001", 1, ""],
    ["งานซ่อมทำสีตัวถังเรือ", "ซ่อมเรือ", 45000, "งาน", "ขัดเคลือบและทำสีเงางามรอบคัน", "REP-001", 1, ""],
    ["เครื่องยนต์ Outboard 150HP", "เครื่องยนต์", 320000, "เครื่อง", "เครื่องยนต์ 4 จังหวะ ประหยัดน้ำมัน", "ENG-001", 1, ""],
    ["บริการเช็คระยะประจำปี", "ซ่อมเรือ", 12500, "ครั้ง", "เปลี่ยนถ่ายน้ำมันเครื่องและเช็คระบบไฟ", "SER-001", 1, ""],
    ["เปลือกเรือสปีดโบ๊ทไฟเบอร์ขนาด 52 ฟุต รุ่น R52", "มาตรฐาน", 0, "ชุด", "52-feet fiber speed boat hull, model R55", "STD-001", 1, "R52"],
    ["กันกระแทกรอบเรือ", "มาตรฐาน", 0, "ชุด", "Rubber fender around the boat", "STD-002", 1, "R52"],
    ["ป้อมขับเรือและแผงหน้าปัด", "มาตรฐาน", 0, "ชุด", "Boat Console Plans", "STD-003", 1, "R52"],
    ["กระจกกันลมอะคริลิก", "มาตรฐาน", 0, "ชุด", "Acrylic Windshield", "STD-004", 1, "R52"],
    ["ที่นั่งคนขับ", "มาตรฐาน", 0, "ชุด", "Driver's seat", "STD-005", 1, "R52"],
    ["ที่นั่งผู้โดยสารหัวเรือ รูปตัว U", "มาตรฐาน", 0, "ชุด", "U-Shaped passenger seat", "STD-006", 1, "R52"],
    ["หลังคาไฟเบอร์พร้อมโครงสแตนเลส", "มาตรฐาน", 0, "ชุด", "Canvas roof with stainless steel frame", "STD-007", 1, "R52"],
    ["ห้องเก็บของ", "มาตรฐาน", 0, "ชุด", "Storage room", "STD-008", 1, "R52"],
    ["ห้องเก็บสมอ", "มาตรฐาน", 0, "ชุด", "Anchor room", "STD-009", 1, "R52"],
    ["ห้องน้ำติดตั้งส้วมแบบโยกมือ", "มาตรฐาน", 0, "ชุด", "Toilet with hand pump", "STD-010", 1, "R52"],
    ["ปั๊มน้ำท้องเรือ", "มาตรฐาน", 0, "ชุด", "Bilge Pump", "STD-011", 1, "R52"],
    ["สายฉีดน้ำท้ายเรือ", "มาตรฐาน", 0, "ชุด", "Bidet spray", "STD-012", 1, "R52"],
    ["ถังน้ำจืดพร้อมปั๊มน้ำและระบบท่อ", "มาตรฐาน", 0, "ชุด", "Fresh water tank with pump system", "STD-013", 1, "R52"],
    ["ถังน้ำมันเชื้อเพลิง", "มาตรฐาน", 0, "ชุด", "Fuel tank", "STD-014", 1, "R52"],
    ["เกจวัดน้ำมันเชื้อเพลิง", "มาตรฐาน", 0, "ชุด", "Fuel gauge", "STD-015", 1, "R52"],
    ["เกจวัดแบตเตอรี่", "มาตรฐาน", 0, "ชุด", "Great meter battery", "STD-016", 1, "R52"],
    ["บันไดท้ายเรือ", "มาตรฐาน", 0, "ชุด", "Aft ladder", "STD-017", 1, "R52"],
    ["ห่วงหัวเรือ (U Bolt)", "มาตรฐาน", 0, "ชุด", "U Bolt", "STD-018", 1, "R52"],
    ["ที่ผูกเชือก (Cleat)", "มาตรฐาน", 0, "ชุด", "Cleat", "STD-019", 1, "R52"],
    ["รูระบายน้ำ", "มาตรฐาน", 0, "ชุด", "Drain hole", "STD-020", 1, "R52"],
    ["เบาะที่นั่งตลอดลำ", "มาตรฐาน", 0, "ชุด", "Sofa", "STD-021", 1, "R52"],
    ["ไฟแสงสว่างภายในเรือ", "มาตรฐาน", 0, "ชุด", "Lights inside the boat", "STD-022", 1, "R52"],
    ["ไฟเดินเรือ", "มาตรฐาน", 0, "ชุด", "Nautical lights", "STD-023", 1, "R52"],
    ["ไฟเขียว-แดง", "มาตรฐาน", 0, "ชุด", "Green-Red light", "STD-024", 1, "R52"],
    ["แผงสวิตซ์", "มาตรฐาน", 0, "ชุด", "Switch panel", "STD-025", 1, "R52"],
    ["สวิตซ์เปิด-ปิดปั๊มน้ำ", "มาตรฐาน", 0, "ชุด", "Bilge pump switch", "STD-026", 1, "R52"],
    ["ที่ชาร์จ USB", "มาตรฐาน", 0, "ชุด", "USB charger", "STD-027", 1, "R52"],
    ["ที่วางแก้ว", "มาตรฐาน", 0, "ชุด", "Cup holder", "STD-028", 1, "R52"],
    ["สแตนเลสสำหรับติดตั้งเครื่องยนต์ท้ายเรือ", "มาตรฐาน", 0, "ชุด", "Stainless steel mount", "STD-029", 1, "R52"],
    ["สมอเรือหัวท้ายพร้อมเชือก", "มาตรฐาน", 0, "ชุด", "Boat anchor with rope", "STD-030", 1, "R52"],
    ["ชุดดับเพลิง", "มาตรฐาน", 0, "ชุด", "Fire suit", "STD-031", 1, "R52"],
    ["ทุ่นกันกระแทก", "มาตรฐาน", 0, "ชิ้น", "Fender", "STD-032", 1, "R52"],
    ["บันไดวนท้ายเรือรอบเครื่องยนต์", "มาตรฐาน", 0, "ชุด", "Stern stairs", "STD-033", 1, "R52"],
    ["EVA สำหรับปูพื้นเรือ (ต่อ ตร.ม.)", "อุปกรณ์เสริม", 4200, "ตร.ม.", "EVA for boat decking", "OPT-001", 1, "R52"],
    ["GPS/AIS", "อุปกรณ์เสริม", 26000, "ชุด", "Navigation system", "OPT-002", 1, "R52"],
    ["วิทยุสื่อสาร", "อุปกรณ์เสริม", 18000, "ชุด", "Radio communication", "OPT-003", 1, "R52"],
    ["เสื้อชูชีพ", "อุปกรณ์เสริม", 500, "ชุด", "Life jacket", "OPT-004", 1, "R52"],
    ["แตรลม", "อุปกรณ์เสริม", 3000, "ชุด", "Air horn", "OPT-005", 1, "R52"],
    ["เข็มทิศ สำหรับเดินเรือ", "อุปกรณ์เสริม", 4500, "ชุด", "Compass", "OPT-006", 1, "R52"],
    ["กล้อง CCTV", "อุปกรณ์เสริม", 20000, "ชุด", "CCTV Camera", "OPT-007", 1, "R52"],
    ["เก้าอี้ที่นั่งรถบัส 2 ที่นั่ง", "อุปกรณ์เสริม", 9000, "ชุด", "Bus seat chair for 2 seat", "OPT-008", 1, "R52"],
    ["เก้าอี้ที่นั่งรถบัส 3 ที่นั่ง", "อุปกรณ์เสริม", 11000, "ชุด", "Bus seat chair for 3 seat", "OPT-009", 1, "R52"],
    ["เครื่องเสียงบลูทูธ + ลำโพง 4 ตัว", "อุปกรณ์เสริม", 30000, "ชุด", "Marine boat audio system", "OPT-010", 1, "R52"],
  ];

  await db.batch(
    productsData.map(p => ({
      sql: `INSERT INTO products (name, category, unit_price, unit, description, sku, in_stock, boat_model)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      args: p
    })),
    "write"
  );

  // ----- Quotations (sample) -----
  const quotationsData = [
    ["Q-2603-001", "Acme Corporation", 125000, "อนุมัติแล้ว", "29/03/2026", "28/04/2026"],
    ["Q-2603-002", "TechStart Inc.", 89500, "รอดำเนินการ", "28/03/2026", "27/04/2026"],
    ["Q-2603-003", "Global Solutions Ltd.", 245000, "ส่งแล้ว", "27/03/2026", "26/04/2026"],
    ["Q-2603-004", "บริษัท สยามเทค จำกัด", 67800, "ฉบับร่าง", "26/03/2026", "25/04/2026"],
  ];

  await db.batch(
    quotationsData.map(q => ({
      sql: "INSERT INTO quotations (id, customer_name, amount, status, date, valid_until) VALUES (?, ?, ?, ?, ?, ?)",
      args: q
    })),
    "write"
  );

  // ----- Settings -----
  const settingsData = [
    ["profile", JSON.stringify({ name: "สมชาย ใจดี", username: "somchai", email: "somchai@roengvaree.com", phone: "081-234-5678", company: "RoengVaree Co., Ltd.", position: "ผู้จัดการฝ่ายขาย" })],
    ["companySettings", JSON.stringify({ name: "RoengVaree Co., Ltd.", taxId: "0105-564-123456", address: "เลขที่ 99 ถ.สุขุมวิท กรุงเทพฯ", phone: "02-123-4567", email: "info@roengvaree.com", website: "www.roengvaree.com", logo: "" })],
    ["quotationSettings", JSON.stringify({ prefix: "Q", validDays: 30, defaultVat: true, vatRate: 7, currency: "THB", defaultNotes: "ขอบคุณที่ใช้บริการ", defaultTerms: ["50% Deposit: Payable upon signing the contract.", "30% Second Installment: Payable upon 50% work completion.", "20% Final Payment: Payable upon 100% work completion."] })],
    ["notifications", JSON.stringify({ emailNewQuotation: true, emailApproved: true, emailRejected: true, emailExpiring: true, browserNotify: true })],
    ["categories", JSON.stringify(["เรือ", "ซ่อมเรือ", "เครื่องยนต์", "มาตรฐาน", "อุปกรณ์เสริม"])],
    ["boatModels", JSON.stringify(["R52", "R33"])],
  ];

  await db.batch(
    settingsData.map(s => ({
      sql: "INSERT INTO settings (key, value) VALUES (?, ?)",
      args: s
    })),
    "write"
  );

  // ----- Boat Specifications -----
  await db.execute({
    sql: "INSERT INTO boat_specs (model, loa, beam, draft, fresh_water_capacity, gas_tank, height, rec_engine, speed_design, passenger, images_json) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    args: ["R52", "15.6 m", "4 m", "0.6 m", "150 L", "400 L", "3.5 m", "250Hpx3", "30 Knt", "60+3 Person", "[]"]
  });
  
  await db.execute({
    sql: "INSERT INTO boat_specs (model, loa, beam, draft, fresh_water_capacity, gas_tank, height, rec_engine, speed_design, passenger, images_json) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    args: ["R33", "-", "-", "-", "-", "-", "-", "-", "-", "-", "[]"]
  });

  // ----- Production Costs (Master Data) -----
  // We mirror the products data here as the system uses production_costs for master data in v3
  await db.batch(
    productsData.map(p => ({
      sql: `INSERT INTO production_costs (name, category, unit_price, unit, description, sku, in_stock, boat_model)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      args: p
    })),
    "write"
  );

  console.log("✅ Database seeded successfully!");
}
