import { NextRequest } from "next/server";
import { eachDayOfInterval, addMinutes, eachMinuteOfInterval, set, subMinutes } from "date-fns";
import { toZonedTime, fromZonedTime } from "date-fns-tz";
import { prisma } from "@/lib/db";
import { requireAdminSession } from "@/lib/session";
import { AdminSlotGenerateSchema } from "@/lib/validation";
import { errorResponse, ok } from "@/lib/http";

const TZ = process.env.APP_TZ ?? "Asia/Tokyo";

function buildSlots(startDate: string, endDate: string, template: Array<{ start: string; end: string }>) {
  const start = new Date(`${startDate}T00:00:00${TZ === "Asia/Tokyo" ? "+09:00" : "Z"}`);
  const end = new Date(`${endDate}T00:00:00${TZ === "Asia/Tokyo" ? "+09:00" : "Z"}`);
  const zonedStart = toZonedTime(start, TZ);
  const zonedEnd = toZonedTime(end, TZ);

  const days = eachDayOfInterval({ start: zonedStart, end: zonedEnd });

  const slots: { start: Date; end: Date }[] = [];

  for (const day of days) {
    // 平日のみ生成
    const weekday = day.getDay();
    if (weekday === 0 || weekday === 6) continue;

    for (const block of template) {
      const [startHour, startMinute] = block.start.split(":").map(Number);
      const [endHour, endMinute] = block.end.split(":").map(Number);
      const intervalStart = set(day, { hours: startHour, minutes: startMinute, seconds: 0, milliseconds: 0 });
      const intervalEnd = set(day, { hours: endHour, minutes: endMinute, seconds: 0, milliseconds: 0 });
      const startTimes = eachMinuteOfInterval(
        { start: intervalStart, end: subMinutes(intervalEnd, 30) },
        { step: 30 }
      );

      for (const startTime of startTimes) {
        slots.push({
          start: fromZonedTime(startTime, TZ),
          end: fromZonedTime(addMinutes(startTime, 30), TZ)
        });
      }
    }
  }

  return slots;
}

export async function POST(request: NextRequest) {
  try {
    requireAdminSession();
  } catch (error) {
    return errorResponse(401, "UNAUTHORIZED", "ログインが必要です");
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch (error) {
    return errorResponse(400, "VALIDATION_ERROR", "JSON の解析に失敗しました");
  }

  const parsed = AdminSlotGenerateSchema.safeParse(body);
  if (!parsed.success) {
    return errorResponse(400, "VALIDATION_ERROR", "入力内容を確認してください", parsed.error.flatten().fieldErrors);
  }

  const slotsToCreate = buildSlots(parsed.data.startDate, parsed.data.endDate, parsed.data.template as Array<{ start: string; end: string }>);
  let created = 0;

  await prisma.$transaction(async (tx: any) => {
    for (const slot of slotsToCreate) {
      const exists = await tx.slot.findFirst({ where: { start: slot.start } });
      if (exists) continue;
      await tx.slot.create({
        data: {
          start: slot.start,
          end: slot.end,
          status: "available"
        }
      });
      created += 1;
    }
  });

  return ok({ ok: true, created });
}
