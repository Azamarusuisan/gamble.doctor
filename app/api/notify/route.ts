import { NextRequest } from "next/server";
import { NotifySchema } from "@/lib/validation";
import { errorResponse, ok } from "@/lib/http";
import { sendDemoNotification } from "@/lib/notify";

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch (error) {
    return errorResponse(400, "VALIDATION_ERROR", "JSON の解析に失敗しました");
  }

  const parsed = NotifySchema.safeParse(body);
  if (!parsed.success) {
    return errorResponse(400, "VALIDATION_ERROR", "入力内容を確認してください", parsed.error.flatten().fieldErrors);
  }

  const result = await sendDemoNotification(parsed.data.template, parsed.data);

  return ok({ ok: true, driver: result.driver });
}
