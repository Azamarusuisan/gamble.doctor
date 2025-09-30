import { NextRequest } from "next/server";
import { AdminLoginSchema } from "@/lib/validation";
import { errorResponse, ok } from "@/lib/http";
import { createAdminSession } from "@/lib/session";
import { prisma } from "@/lib/db";

const DEMO_EMAIL = process.env.ADMIN_DEMO_EMAIL ?? "doctor@example.com";
const DEMO_PASSWORD = process.env.ADMIN_DEMO_PASSWORD ?? "demoadmin";

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch (error) {
    return errorResponse(400, "VALIDATION_ERROR", "JSON の解析に失敗しました");
  }

  const parsed = AdminLoginSchema.safeParse(body);
  if (!parsed.success) {
    return errorResponse(400, "VALIDATION_ERROR", "入力内容を確認してください", parsed.error.flatten().fieldErrors);
  }

  const { email, password } = parsed.data;

  if (email !== DEMO_EMAIL || password !== DEMO_PASSWORD) {
    return errorResponse(401, "UNAUTHORIZED", "メールアドレスまたはパスワードが正しくありません");
  }

  createAdminSession(email);

  await prisma.auditLog.create({
    data: {
      action: "admin_login",
      actorId: email,
      target: "admin",
      meta: JSON.stringify({ email })
    }
  });

  return ok({ ok: true });
}
