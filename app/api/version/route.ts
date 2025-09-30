import { ok } from "@/lib/http";

const APP_VERSION = "0.1.0";
const SCHEMA_VERSION = "2025-09-29";

export async function GET() {
  return ok({ app: APP_VERSION, schema: SCHEMA_VERSION });
}
