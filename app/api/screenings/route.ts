import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { ScreeningCreateSchema } from "@/lib/validation";
import { errorResponse, ok } from "@/lib/http";

function judgeRisk(score: number) {
  if (score <= 3) return "Low" as const;
  if (score <= 7) return "Moderate" as const;
  return "High" as const;
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch (error) {
    return errorResponse(400, "VALIDATION_ERROR", "JSON の解析に失敗しました");
  }

  const parsed = ScreeningCreateSchema.safeParse(body);
  if (!parsed.success) {
    return errorResponse(400, "VALIDATION_ERROR", "入力内容を確認してください", parsed.error.flatten().fieldErrors);
  }

  const { score, answers, patientId } = parsed.data;
  const risk = judgeRisk(score);

  try {
    const screening = await prisma.screening.create({
      data: {
        patientId: patientId ?? undefined,
        score,
        answers,
        risk
      }
    });

    return ok({ id: screening.id, risk }, 201);
  } catch (error) {
    console.error(error);
    return errorResponse(500, "INTERNAL_ERROR", "内部エラーが発生しました");
  }
}
