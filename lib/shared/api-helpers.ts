import { NextResponse } from "next/server";

export function handleApiError(error: unknown) {
  if (error instanceof Error) {
    if (error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    if (error.message === "NOT_FOUND") {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    if (error.message === "CONFLICT") {
      return NextResponse.json({ error: "Conflict" }, { status: 409 });
    }
  }
  console.error(error);
  return NextResponse.json({ error: "Internal server error" }, { status: 500 });
}
