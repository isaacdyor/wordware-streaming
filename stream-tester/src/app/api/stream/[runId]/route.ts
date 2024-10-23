// app/api/wordware/[runId]/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { runId: string } }
) {
  const runId = params.runId;
  const apiKey = request.headers.get("authorization")?.split(" ")[1];

  if (!apiKey) {
    return NextResponse.json({ error: "API key is required" }, { status: 401 });
  }

  console.log(runId, apiKey);

  return NextResponse.json({ message: "Hello, world!", runId, apiKey });
}
