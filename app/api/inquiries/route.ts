import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { InquiryCreateSchema } from "@/lib/validation";
import { checkRateLimit } from "@/lib/rate-limit";
import { errorResponse, ok } from "@/lib/http";
import { sendDemoNotification } from "@/lib/notify";

const roleMap = {
  本人: "person",
  家族: "family",
  その他: "other"
} as const;

const channelMap = {
  メール: "email",
  SMS: "sms",
  どちらでも: "either"
} as const;

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.ip ||
    "anonymous";

  const rate = checkRateLimit({ identifier: `inquiry:${ip}`, limit: 1, windowMs: 60_000 });
  if (!rate.allowed) {
    return errorResponse(429, "RATE_LIMITED", "しばらく経ってから再度お試しください", {
      resetMs: rate.resetMs
    });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch (error) {
    return errorResponse(400, "VALIDATION_ERROR", "JSON の解析に失敗しました");
  }

  const parsed = InquiryCreateSchema.safeParse(body);
  if (!parsed.success) {
    return errorResponse(400, "VALIDATION_ERROR", "入力内容を確認してください", parsed.error.flatten().fieldErrors);
  }

  const input = parsed.data;

  try {
    const inquiry = await prisma.inquiry.create({
      data: {
        nickname: input.nickname,
        email: input.email,
        sms: input.sms,
        role: roleMap[input.role],
        message: input.message,
        channel: channelMap[input.channel]
      }
    });

    await prisma.auditLog.create({
      data: {
        action: "created_inquiry",
        inquiryId: inquiry.id,
        target: `Inquiry:${inquiry.id}`,
        meta: JSON.stringify({ ip })
      }
    });

    await sendDemoNotification("inquiry.created", {
      id: inquiry.id,
      nickname: inquiry.nickname,
      role: input.role
    });

    return ok({ id: inquiry.id, createdAt: inquiry.createdAt.toISOString() }, 201);
  } catch (error) {
    console.error(error);
    return errorResponse(500, "INTERNAL_ERROR", "内部エラーが発生しました");
  }
}
