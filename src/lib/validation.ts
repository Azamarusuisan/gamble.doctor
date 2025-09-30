import { z } from "zod";

export const InquiryCreateSchema = z.object({
  nickname: z.string().min(1).max(50),
  email: z.string().email().optional(),
  sms: z
    .string()
    .regex(/^\+?[0-9]{8,15}$/i, "電話番号は国際形式で入力してください")
    .optional(),
  role: z.enum(["本人", "家族", "その他"]),
  message: z.string().min(10).max(2000),
  channel: z.enum(["メール", "SMS", "どちらでも"])
}).superRefine((data, ctx) => {
  if (!data.email && !data.sms) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["email"],
      message: "メールまたはSMSのいずれかは必須です"
    });
  }
});

export const SlotQuerySchema = z.object({
  from: z.string().optional(),
  to: z.string().optional(),
  status: z.enum(["available", "held", "booked"]).default("available")
});

export const AppointmentPatientSchema = z.object({
  name: z.string().min(1),
  kana: z.string().min(1).optional(),
  email: z.string().email(),
  phone: z.string().optional(),
  dob: z.string().optional(),
  isFamily: z.boolean().default(false)
});

export const ConsentSchema = z.object({
  type: z.enum(["privacy", "terms", "telemedicine"]),
  version: z.string().min(1)
});

export const AppointmentCreateSchema = z.object({
  patient: AppointmentPatientSchema,
  slotId: z.string().min(1),
  type: z.enum(["初診", "再診"]),
  consents: z.array(ConsentSchema).min(1)
});

export const AppointmentStatusUpdateSchema = z.object({
  status: z.enum(["booked", "canceled", "no_show"]).optional(),
  type: z.enum(["初診", "再診"]).optional()
}).refine((data) => data.status || data.type, {
  message: "更新項目が必要です"
});

export const ScreeningCreateSchema = z.object({
  score: z.number().min(0).max(14),
  answers: z.record(z.union([z.number().int().min(0).max(2), z.string()])),
  patientId: z.string().nullable().optional()
});

export const NotifySchema = z.object({
  to: z.string().email(),
  template: z.string().min(1),
  params: z.record(z.any())
});

export const PaymentSchema = z.object({
  appointmentId: z.string().min(1),
  amount: z.number().positive(),
  currency: z.literal("JPY"),
  method: z.literal("card_demo"),
  payer: z.object({
    name: z.string().min(1),
    email: z.string().email()
  })
});

export const AdminLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export const AdminSlotGenerateSchema = z.object({
  startDate: z.string(),
  endDate: z.string(),
  template: z
    .array(
      z.object({
        start: z.string(),
        end: z.string()
      })
    )
    .default([
      { start: "09:00", end: "12:00" },
      { start: "13:00", end: "18:00" }
    ])
});

export type InquiryCreateInput = z.infer<typeof InquiryCreateSchema>;
export type AppointmentCreateInput = z.infer<typeof AppointmentCreateSchema>;
export type AppointmentStatusUpdateInput = z.infer<typeof AppointmentStatusUpdateSchema>;
export type ScreeningCreateInput = z.infer<typeof ScreeningCreateSchema>;
export type NotifyInput = z.infer<typeof NotifySchema>;
export type PaymentInput = z.infer<typeof PaymentSchema>;
export type AdminLoginInput = z.infer<typeof AdminLoginSchema>;
export type AdminSlotGenerateInput = z.infer<typeof AdminSlotGenerateSchema>;
