import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { SlotQuerySchema } from "@/lib/validation";
import { errorResponse, ok } from "@/lib/http";

const statusMap = {
  available: "available",
  held: "held",
  booked: "booked"
} as const;

export async function GET(request: NextRequest) {
  const parsed = SlotQuerySchema.safeParse(Object.fromEntries(request.nextUrl.searchParams));
  if (!parsed.success) {
    return errorResponse(400, "VALIDATION_ERROR", "クエリを確認してください", parsed.error.flatten().fieldErrors);
  }

  const input = parsed.data;
  const where: Record<string, unknown> = {};

  if (input.status) {
    where.status = statusMap[input.status];
  }

  if (input.from || input.to) {
    where.start = {
      ...(input.from ? { gte: new Date(input.from) } : {}),
      ...(input.to ? { lte: new Date(input.to) } : {})
    };
  }

  const slots = await prisma.slot.findMany({
    where,
    orderBy: { start: "asc" }
  });

  return ok({
    items: slots.map((slot) => ({
      id: slot.id,
      start: slot.start.toISOString(),
      end: slot.end.toISOString(),
      status: slot.status
    }))
  });
}
