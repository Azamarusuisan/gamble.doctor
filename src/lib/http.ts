import { NextResponse } from "next/server";

type ErrorCode =
  | "VALIDATION_ERROR"
  | "RATE_LIMITED"
  | "NOT_FOUND"
  | "CONFLICT"
  | "UNAUTHORIZED"
  | "INTERNAL_ERROR";

type ErrorBody = {
  error: {
    code: ErrorCode;
    message: string;
    details?: Record<string, unknown>;
  };
};

export function ok<T>(data: T, init?: number | ResponseInit) {
  if (typeof init === "number") {
    return NextResponse.json<T>(data, { status: init });
  }
  return NextResponse.json<T>(data, init);
}

export function errorResponse(
  status: number,
  code: ErrorCode,
  message: string,
  details?: Record<string, unknown>
) {
  const body: ErrorBody = { error: { code, message, details } };
  return NextResponse.json(body, { status });
}
