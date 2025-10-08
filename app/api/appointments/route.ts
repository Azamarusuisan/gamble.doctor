import { NextRequest } from "next/server";
import { mockSlots, mockAppointments } from "@/lib/mock-data";
import { AppointmentCreateSchema } from "@/lib/validation";
import { checkRateLimit } from "@/lib/rate-limit";
import { errorResponse, ok } from "@/lib/http";
import { sendDemoNotification } from "@/lib/notify";
import { renderBookingConfirmEmail } from "@/emails/booking-confirm";
import { sendBookingConfirmationEmail, sendNewBookingNotificationToAdmin } from "@/lib/email";
import { createDummyMeetLink, createGoogleMeetLink } from "@/lib/google-meet";

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

    // Google Meetリンクを生成
    let meetLink: string | null = null;

    try {
      // 実際のGoogle Meet APIを使用（環境変数が設定されている場合）
      if (process.env.GOOGLE_CLIENT_EMAIL && process.env.GOOGLE_PRIVATE_KEY) {
        const startTime = new Date(slot.start);
        const endTime = new Date(slot.end);

        meetLink = await createGoogleMeetLink({
          summary: `ギャンブルドクター - ${input.type === "first" ? "初診" : "再診"}`,
          description: `患者: ${patient.name}\n診療タイプ: ${input.type === "first" ? "初診" : "再診"}`,
          startTime,
          endTime,
          attendeeEmail: patient.email,
        });
      }

      // Google Meet APIが設定されていない場合はダミーリンクを使用
      if (!meetLink) {
        meetLink = createDummyMeetLink();
      }

      // appointmentにvideoUrlを設定
      result.appointment.videoUrl = meetLink;
    } catch (error) {
      console.error('Error generating Google Meet link:', error);
      // エラーが発生してもダミーリンクを使用して続行
      meetLink = createDummyMeetLink();
      result.appointment.videoUrl = meetLink;
    }

    // 予約完了メールを送信
    try {
      await sendBookingConfirmationEmail({
        to: patient.email,
        patientName: patient.name,
        appointmentDate: new Date(slot.start).toLocaleDateString("ja-JP", {
          year: "numeric",
          month: "long",
          day: "numeric",
          weekday: "long"
        }),
        appointmentTime: new Date(slot.start).toLocaleTimeString("ja-JP", {
          hour: "2-digit",
          minute: "2-digit"
        }),
        appointmentType: input.type === "first" ? "初診" : "再診",
        meetLink: meetLink || undefined,
      });
      console.log('✅ 予約完了メールを送信しました:', patient.email);
    } catch (error) {
      console.error('❌ 予約完了メール送信エラー:', error);
      // メール送信エラーでも予約は成功として扱う
    }

    // 管理者への通知メールを送信
    try {
      await sendNewBookingNotificationToAdmin({
        patientName: patient.name,
        patientEmail: patient.email,
        patientPhone: patient.phone,
        appointmentDate: new Date(slot.start).toLocaleDateString("ja-JP", {
          year: "numeric",
          month: "long",
          day: "numeric",
          weekday: "long"
        }),
        appointmentTime: new Date(slot.start).toLocaleTimeString("ja-JP", {
          hour: "2-digit",
          minute: "2-digit"
        }),
        appointmentType: input.type === "first" ? "初診" : "再診",
        bookingId: result.appointment.id,
      });
      console.log('✅ 管理者通知メールを送信しました');
    } catch (error) {
      console.error('❌ 管理者通知メール送信エラー:', error);
      // メール送信エラーでも予約は成功として扱う
    }

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
