import { startOfDay, endOfDay, startOfWeek, endOfWeek } from "date-fns";
import { toZonedTime, fromZonedTime } from "date-fns-tz";
import { errorResponse, ok } from "@/lib/http";
import { requireAdminSession } from "@/lib/session";
import { prisma } from "@/lib/db";

const TZ = process.env.APP_TZ ?? "Asia/Tokyo";

function toDisplay(date: Date) {
  return date.toLocaleString("ja-JP", {
    timeZone: TZ,
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });
}

export async function GET() {
  try {
    requireAdminSession();
  } catch (error) {
    return errorResponse(401, "UNAUTHORIZED", "ログインが必要です");
  }

  const now = new Date();
  const zonedNow = toZonedTime(now, TZ);

  const todayStart = fromZonedTime(startOfDay(zonedNow), TZ);
  const todayEnd = fromZonedTime(endOfDay(zonedNow), TZ);

  const weekStart = fromZonedTime(startOfWeek(zonedNow, { weekStartsOn: 1 }), TZ);
  const weekEnd = fromZonedTime(endOfWeek(zonedNow, { weekStartsOn: 1 }), TZ);

  const [appointmentsToday, appointmentsWeek, pendingInquiries] = await Promise.all([
    prisma.appointment.findMany({
      where: {
        Slot: {
          start: {
            gte: todayStart,
            lte: todayEnd
          }
        }
      },
      include: { Patient: true, Slot: true },
      orderBy: { Slot: { start: "asc" } }
    }),
    prisma.appointment.findMany({
      where: {
        Slot: {
          start: {
            gte: weekStart,
            lte: weekEnd
          }
        }
      },
      include: { Patient: true, Slot: true },
      orderBy: { Slot: { start: "asc" } }
    }),
    prisma.inquiry.findMany({
      where: { handled: false },
      orderBy: { createdAt: "desc" }
    })
  ]);

  return ok({
    appointmentsToday: appointmentsToday.map((appt: any) => ({
      id: appt.id,
      start: toDisplay(appt.Slot.start),
      patient: appt.Patient.name,
      status: appt.status.toLowerCase()
    })),
    appointmentsWeek: appointmentsWeek.map((appt: any) => ({
      id: appt.id,
      start: toDisplay(appt.Slot.start),
      patient: appt.Patient.name,
      status: appt.status.toLowerCase()
    })),
    pendingInquiries: pendingInquiries.map((inq: any) => ({
      id: inq.id,
      nickname: inq.nickname,
      createdAt: toDisplay(inq.createdAt)
    }))
  });
}
