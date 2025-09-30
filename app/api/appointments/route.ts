import { NextRequest } from "next/server";
import { mockSlots, mockAppointments } from "@/lib/mock-data";
import { AppointmentCreateSchema } from "@/lib/validation";
import { checkRateLimit } from "@/lib/rate-limit";
import { errorResponse, ok } from "@/lib/http";
import { sendDemoNotification } from "@/lib/notify";
import { renderBookingConfirmEmail } from "@/emails/booking-confirm";

const typeMap = {
  初診: "first",
  再診: "follow"
} as const;

const consentMap = {
  privacy: "privacy",
  terms: "terms",
  telemedicine: "telemedicine"
} as const;

const SLOT_STATUS_AVAILABLE = "available";
const SLOT_STATUS_BOOKED = "booked";

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.ip ||
    "anonymous";

  const rate = checkRateLimit({ identifier: `appointment:${ip}`, limit: 1, windowMs: 60_000 });
  if (!rate.allowed) {
    return errorResponse(429, "RATE_LIMITED", "短時間に複数の予約はできません", {
      resetMs: rate.resetMs
    });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch (error) {
    return errorResponse(400, "VALIDATION_ERROR", "JSON の解析に失敗しました");
  }

  const parsed = AppointmentCreateSchema.safeParse(body);
  if (!parsed.success) {
    return errorResponse(400, "VALIDATION_ERROR", "入力内容を確認してください", parsed.error.flatten().fieldErrors);
  }

  const input = parsed.data;

  try {
    // モックデータでスロットを検索
    const slot = mockSlots.find(s => s.id === input.slotId);
    if (!slot) {
      throw new Error("NOT_FOUND");
    }
    if (slot.isBooked || !slot.isAvailable) {
      throw new Error("CONFLICT");
    }

    // モック患者とアポイントメントを作成
    const patient = {
      id: `patient_${Date.now()}`,
      name: input.patient.name,
      email: input.patient.email,
      phone: input.patient.phone,
      dateOfBirth: input.patient.dob ? new Date(`${input.patient.dob}T00:00:00+09:00`) : new Date(),
      address: "",
      emergencyContact: "",
      createdAt: new Date()
    };

    const appointment = {
      id: `appt_${Date.now()}`,
      patientId: patient.id,
      doctorId: slot.doctorId,
      slotId: slot.id,
      status: "confirmed" as const,
      notes: "",
      createdAt: new Date(),
      updatedAt: new Date(),
      videoUrl: null,
      patient,
      doctor: { id: slot.doctorId, name: "浦江晋平", specialization: "依存症専門医", bio: "", availability: [] },
      slot
    };

    // モックデータに追加（実際のDBには保存しない）
    mockAppointments.push(appointment);
    slot.isBooked = true;
    slot.isAvailable = false;

    const result = { appointment, patient };

    await sendDemoNotification("appointment.created", {
      appointmentId: result.appointment.id,
      patient: result.patient.name,
      slotId: result.appointment.slotId
    });

    // Google Meetリンクを自動生成してメール送信
    const meetResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/appointments/meet`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        appointmentId: result.appointment.id
      })
    });

    if (meetResponse.ok) {
      const meetData = await meetResponse.json();
      console.log('Google Meetリンクが生成されメールが送信されました:', meetData.meetLink);
    }

    const emailHtml = renderBookingConfirmEmail({
      name: result.patient.name,
      date: new Date().toLocaleDateString("ja-JP", { timeZone: "Asia/Tokyo" }),
      time: new Date().toLocaleTimeString("ja-JP", { timeZone: "Asia/Tokyo", hour: "2-digit", minute: "2-digit" }),
      doctor: "浦江晋平",
      videoUrl: result.appointment.videoUrl ?? undefined
    });
    console.info("[DEMO EMAIL] booking_confirm", emailHtml.substring(0, 120), "...");

    return ok(
      {
        id: result.appointment.id,
        status: result.appointment.status,
        videoUrl: result.appointment.videoUrl,
        patientId: result.patient.id,
        slotId: result.appointment.slotId
      },
      201
    );
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "NOT_FOUND") {
        return errorResponse(404, "NOT_FOUND", "指定した枠が見つかりません");
      }
      if (error.message === "CONFLICT") {
        return errorResponse(409, "CONFLICT", "すでに予約済みの枠です");
      }
    }
    console.error(error);
    return errorResponse(500, "INTERNAL_ERROR", "内部エラーが発生しました");
  }
}
