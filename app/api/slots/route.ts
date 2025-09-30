import { NextRequest } from "next/server";
import { mockSlots } from "@/lib/mock-data";
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

  // モックデータからフィルタリング
  let filteredSlots = mockSlots.filter(slot => {
    const status = slot.isBooked ? "booked" : slot.isAvailable ? "available" : "held";

    if (input.status && status !== statusMap[input.status]) {
      return false;
    }

    if (input.from && slot.startTime < new Date(input.from)) {
      return false;
    }

    if (input.to && slot.startTime > new Date(input.to)) {
      return false;
    }

    return true;
  });

  return ok({
    items: filteredSlots.map((slot) => ({
      id: slot.id,
      start: slot.startTime.toISOString(),
      end: slot.endTime.toISOString(),
      status: slot.isBooked ? "booked" : slot.isAvailable ? "available" : "held"
    }))
  });
}
