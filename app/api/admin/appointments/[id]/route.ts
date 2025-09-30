import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { AppointmentStatusUpdateSchema } from "@/lib/validation";
import { errorResponse, ok } from "@/lib/http";
import { requireAdminSession } from "@/lib/session";

const statusMap = {
  booked: "booked",
  canceled: "canceled",
  no_show: "no_show"
} as const;

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
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

  const parsed = AppointmentStatusUpdateSchema.safeParse(body);
  if (!parsed.success || !parsed.data.status) {
    return errorResponse(400, "VALIDATION_ERROR", "ステータスを指定してください", parsed.error?.flatten().fieldErrors);
  }

  try {
    const appointment = await prisma.appointment.update({
      where: { id: params.id },
      data: { status: statusMap[parsed.data.status] }
    });

    await prisma.auditLog.create({
      data: {
        action: "admin_update_appointment",
        appointmentId: appointment.id,
        target: `Appointment:${appointment.id}`,
        meta: JSON.stringify({ admin: true, status: parsed.data.status })
      }
    });

    return ok({ id: appointment.id, status: appointment.status });
  } catch (error) {
    console.error(error);
    return errorResponse(500, "INTERNAL_ERROR", "更新に失敗しました");
  }
}
