import { requireAdminSession } from "@/lib/session";
import { prisma } from "@/lib/db";

const TZ = process.env.APP_TZ ?? "Asia/Tokyo";

function formatDate(date: Date) {
  return date.toLocaleString("ja-JP", {
    timeZone: TZ,
    year: "numeric",
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
    return new Response(JSON.stringify({ error: { code: "UNAUTHORIZED", message: "ログインが必要です" } }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }

  const appointments = await prisma.appointment.findMany({
    include: { Patient: true, Slot: true },
    orderBy: { createdAt: "desc" }
  });

  const rows = [
    ["id", "patient", "email", "status", "slot_start", "slot_end", "created_at"],
    ...appointments.map((appt) => [
      appt.id,
      appt.Patient.name,
      appt.Patient.email,
      appt.status.toLowerCase(),
      formatDate(appt.Slot.start),
      formatDate(appt.Slot.end),
      formatDate(appt.createdAt)
    ])
  ];

  const csv = rows.map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(",")).join("\n");

  return new Response(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="appointments.csv"`
    }
  });
}
